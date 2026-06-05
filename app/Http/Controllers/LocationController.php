<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getProvinces()
    {
        return cache()->remember('provinces_list', 604800, function () {
            try {
                $response = Http::withHeaders([
                    'key' => env('RAJAONGKIR_API_KEY'),
                    'Accept' => 'application/json',
                ])->get('https://rajaongkir.komerce.id/api/v1/destination/province');

                $data = $response->json();
                return $data['data'] ?? [];
            } catch (\Throwable $e) {
                Log::error('RajaOngkir Province Error: ' . $e->getMessage());
                return [];
            }
        });
    }

    public function getCities($province_id)
    {
        return cache()->remember("cities_v1_{$province_id}", 604800, function () use ($province_id) {
            try {
                $response = Http::withHeaders([
                    'key' => env('RAJAONGKIR_API_KEY'),
                    'Accept' => 'application/json',
                ])->get("https://rajaongkir.komerce.id/api/v1/destination/city/{$province_id}");

                $data = $response->json();
                return $data['data'] ?? [];
            } catch (\Throwable $e) {
                Log::error('RajaOngkir City Error: ' . $e->getMessage());
                return [];
            }
        });
    }

    public function getDistricts($city_id)
    {
        return cache()->remember("districts_v1_{$city_id}", 604800, function () use ($city_id) {
            try {
                $response = Http::withHeaders([
                    'key' => env('RAJAONGKIR_API_KEY'),
                    'Accept' => 'application/json',
                ])->get("https://rajaongkir.komerce.id/api/v1/destination/district/{$city_id}");

                $data = $response->json();
                return $data['data'] ?? [];
            } catch (\Throwable $e) {
                Log::error('RajaOngkir District Error: ' . $e->getMessage());
                return [];
            }
        });
    }

    public function getSubDistricts($district_id)
    {
        return cache()->remember("subdistricts_v1_{$district_id}", 604800, function () use ($district_id) {
            try {
                $response = Http::withHeaders([
                    'key' => env('RAJAONGKIR_API_KEY'),
                    'Accept' => 'application/json',
                ])->get("https://rajaongkir.komerce.id/api/v1/destination/sub-district/{$district_id}");

                $data = $response->json();
                return $data['data'] ?? [];
            } catch (\Throwable $e) {
                Log::error('RajaOngkir Sub-District Error: ' . $e->getMessage());
                return [];
            }
        });
    }

    public function searchDestination(Request $request)
    {
        $search = $request->query('search', '');
        $limit = $request->query('limit', 10);

        try {
            $response = Http::withHeaders([
                'key' => env('RAJAONGKIR_API_KEY'),
                'Accept' => 'application/json',
            ])->get('https://rajaongkir.komerce.id/api/v1/destination/domestic-destination', [
                'search' => $search,
                'limit'  => $limit,
                'offset' => 0,
            ]);

            $data = $response->json();
            return response()->json($data['data'] ?? []);
        } catch (\Throwable $e) {
            Log::error('RajaOngkir Search Destination Error: ' . $e->getMessage());
            return response()->json([]);
        }
    }
}
