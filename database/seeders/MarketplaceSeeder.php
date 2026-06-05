<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name' => 'Raynar Seller',
            'email' => 'seller@example.com',
            'password' => Hash::make('password'),
        ]);

        $shopId = DB::table('shops')->insertGetId([
            'user_id' => $user->id,
            'name' => 'Raynar Preloved Store',
            'slug' => 'raynar-preloved',
            'province_id' => 11,
            'city_id' => 444,
            'address_detail' => 'Jl. Raya UPN Veteran, Surabaya',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    DB::table('products')->insert([
            [
                'shop_id' => $shopId,
                'name' => 'Jaket Vintage Kuning Mulus',
                'slug' => Str::slug('Jaket Vintage Kuning Mulus'),
                'description' => 'Jaket warna kuning sesuai foto model, kondisi 95% masih bagus.',
                'price' => 150000,
                'weight' => 800,
                'category' => 'Pakaian Pria',
                'condition' => 'like_new',
                'images' => json_encode(['jaket-kuning.jpg']),
                'created_at' => now(),
            ],
            [
                'shop_id' => $shopId,
                'name' => 'Sepatu Sneakers Bekas Kuliah',
                'slug' => Str::slug('Sepatu Sneakers Bekas Kuliah'),
                'description' => 'Minus pemakaian wajar, sol masih tebal.',
                'price' => 200000,
                'weight' => 1200,
                'category' => 'Sepatu',
                'condition' => 'good',
                'images' => json_encode(['sepatu.jpg']),
                'created_at' => now(),
            ],
        ]);
    }
}
