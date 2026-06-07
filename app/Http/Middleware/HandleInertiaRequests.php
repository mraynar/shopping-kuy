<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                    'address' => $user->address,
                    'address_notes' => $user->address_notes,
                    'province_name' => $this->getLocationName('provinces_list', $user->province_id),
                    'city_name' => $this->getLocationName("cities_v1_{$user->province_id}", $user->city_id),
                    'district_name' => $this->getLocationName("districts_v1_{$user->city_id}", $user->district_id),
                    'subdistrict_name' => $this->getLocationName("subdistricts_v1_{$user->district_id}", $user->subdistrict_id),
                    'postal_code' => $user->postal_code,
                    'profile_photo_url' => $user->profile_photo ?? $user->avatar,
                    'shop' => $user->shop,
                    'subdistrict_id' => $user->subdistrict_id,
                    'rajaongkir_destination_id'    => $user->rajaongkir_destination_id,
                    'rajaongkir_destination_label' => $user->rajaongkir_destination_label,
                ] : null,
                'cart_count' => $user ? $user->carts()->sum('quantity') : 0,
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'status' => fn() => $request->session()->get('status'),
            ],
        ]);
    }

    private function getLocationName(string $cacheKey, $id): ?string
    {
        if (!$id) return null;

        $list = cache()->get($cacheKey, []);

        $item = collect($list)->firstWhere('id', $id)
            ?? collect($list)->firstWhere('id', (string) $id)
            ?? collect($list)->firstWhere('id', (int) $id);

        return $item['name'] ?? null;
    }
}
