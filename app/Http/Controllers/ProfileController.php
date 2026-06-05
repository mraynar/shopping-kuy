<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $activeTab = $request->query('tab', 'info');

        return Inertia::render('Profile/Index', [
            'auth' => ['user' => $user],
            'shop' => $this->getUserShop((int) $user->id),
            'orders' => $this->getUserOrders((int) $user->id),
            'reviews' => $this->getUserReviews((int) $user->id),
            'activeTab' => $activeTab,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'                         => 'required|string|max:255',
            'phone'                        => ['nullable', 'string', 'max:20', Rule::unique('users', 'phone')->ignore($user->id)],
            'bio'                          => 'nullable|string|max:500',
            'address'                      => 'nullable|string',
            'address_notes'                => 'required|string|min:10',
            'province_id'                  => 'nullable',
            'city_id'                      => 'nullable',
            'district_id'                  => 'nullable',
            'subdistrict_id'               => 'nullable',
            'postal_code'                  => 'required|numeric',
            'rajaongkir_destination_id'    => 'nullable|integer',
            'rajaongkir_destination_label' => 'nullable|string|max:500',
            'avatar'                       => 'nullable',
        ]);

        $validated['address'] = $validated['address'] ?? '-';
        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $this->handleAvatarUpload($request, $user);
        $user->save();

        return Redirect::back()->with('status', 'profile-updated');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        $avatarPath = $user->avatar ? (string) $user->avatar : null;
        $this->deleteAvatarFile($avatarPath);

        $userId = $user->id;

        Auth::logout();

        User::query()->where('id', $userId)->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    protected function getUserShop(int $userId)
    {
        return Shop::query()
            ->withCount('products')
            ->where('user_id', $userId)
            ->first();
    }

    protected function getUserOrders(int $userId)
    {
        return Order::query()
            ->with(['items.product'])
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    protected function getUserReviews(int $userId)
    {
        return Review::query()
            ->with('product')
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    protected function handleAvatarUpload(Request $request, User $user): void
    {
        if ($request->hasFile('avatar')) {
            $this->deleteAvatarFile((string) $user->avatar);

            $file = $request->file('avatar');
            if ($file instanceof \Illuminate\Http\UploadedFile) {
                $path = $file->store('avatars', 'public');
                $user->avatar = asset('storage/' . $path);
            }
        } elseif ($request->input('avatar') === 'delete') {
            $this->deleteAvatarFile((string) $user->avatar);
            $user->avatar = null;
        }
    }

    protected function deleteAvatarFile(?string $avatarUrl): void
    {
        if ($avatarUrl && !str_contains($avatarUrl, 'googleusercontent')) {
            $storageUrl = url('storage');
            $path = str_replace($storageUrl . '/', '', $avatarUrl);

            if (!empty($path) && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }
}
