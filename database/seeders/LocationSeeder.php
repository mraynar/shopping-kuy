<?php

namespace Database\Seeders;

use App\Models\Province;
use App\Models\City;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            ['id' => 11, 'name' => 'Jawa Timur'],
            ['id' => 12, 'name' => 'Jawa Barat'],
            ['id' => 6, 'name' => 'DKI Jakarta'],
        ];

        foreach ($provinces as $prov) {
            Province::updateOrCreate(['id' => $prov['id']], $prov);
        }

        $cities = [
            ['id' => 444, 'province_id' => 11, 'name' => 'Surabaya'],
            ['id' => 445, 'province_id' => 11, 'name' => 'Sidoarjo'],
            ['id' => 255, 'province_id' => 11, 'name' => 'Malang'],
            // DKI Jakarta
            ['id' => 151, 'province_id' => 6, 'name' => 'Jakarta Barat'],
            ['id' => 153, 'province_id' => 6, 'name' => 'Jakarta Selatan'],
        ];

        foreach ($cities as $city) {
            City::updateOrCreate(['id' => $city['id']], $city);
        }
    }
}
