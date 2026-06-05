<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

class ShopController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $request->validate([
            'shop_name' => 'required|string|max:255|unique:shops,shop_name,' . ($user->shop->id ?? 0),
            'postal_code' => 'required|numeric',
            'address_note' => 'required|string|min:10',
            'ktp_image' => 'nullable|image|max:2048',
            'selfie_image' => 'nullable|image|max:2048',
        ]);

        try {
            $shop = Shop::query()->where('user_id', $user->id)->first();
            $dataToUpdate = $this->prepareShopData($request, $user);

            if ($request->hasFile('ktp_image')) {
                $ktp_file = $request->file('ktp_image');
                $dataToUpdate['ktp_image'] = $this->handleImageUpload($ktp_file, $shop->ktp_image ?? null);
            }

            if ($request->hasFile('selfie_image')) {
                $selfie_file = $request->file('selfie_image');
                $dataToUpdate['selfie_image'] = $this->handleImageUpload($selfie_file, $shop->selfie_image ?? null);
            }

            if (!$shop || $shop->status !== 'verified') {
                $dataToUpdate['status'] = 'pending';
                $dataToUpdate['is_active'] = false;
            }

            Shop::query()->updateOrCreate(['user_id' => $user->id], $dataToUpdate);

            return back()->with('message', 'Informasi toko berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Gagal Simpan Toko: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal menyimpan data toko.']);
        }
    }

    public function autoVerify(): RedirectResponse
    {
        $shop = Shop::query()->where('user_id', Auth::id())->first();

        if ($shop && $shop->status === 'pending') {
            $shop->update([
                'status' => 'verified',
                'is_active' => true
            ]);
        }

        return back();
    }

    private function prepareShopData(Request $request, User $user): array
    {
        return [
            'shop_name' => $request->shop_name,
            'description' => $request->description,
            'slug' => Str::slug($request->shop_name) . '-' . $user->id,
            'province_id' => $request->province_id,
            'city_id' => $request->city_id,
            'district_id' => $request->district_id,
            'subdistrict_id' => $request->subdistrict_id,
            'postal_code' => $request->postal_code,
            'pickup_address' => $request->pickup_address ?? '-',
            'address_note' => $request->address_note,
        ];
    }

    private function handleImageUpload(UploadedFile $file, ?string $oldPath = null): string
    {
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }
        return $file->store('verification', 'public');
    }
}
