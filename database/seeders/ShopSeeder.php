<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->first() ?? User::factory()->create([
            'name' => 'Muhammad Raynar Hammam',
            'email' => 'raynar@example.com',
        ]);

        Shop::query()->create([
            'user_id'        => $user->id,
            'shop_name'      => 'Raynar Preloved Store',
            'slug'           => Str::slug('Raynar Preloved Store'),
            'description'    => 'Toko thrift terbaik di Surabaya dengan koleksi vintage pilihan.',
            'province_id'    => 11,
            'city_id'        => 444,
            'address_detail' => 'Jl. Raya Rungkut Madya, Gunung Anyar',
            'logo'           => 'https://ui-avatars.com/api/?name=Raynar+Store&background=0D0D0D&color=fff',
            'is_active'      => true,
        ]);
    }
}
