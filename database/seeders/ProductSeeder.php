<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        Product::query()->truncate();
        Schema::enableForeignKeyConstraints();

        $shop = Shop::query()->first();
        $shopId = $shop->id ?? 1;

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Nike Dunk Low',
            'slug' => 'nike-dunk-low-' . Str::lower(Str::random(5)),
            'description' => 'Sepatu Nike original dengan kondisi prima. Sangat nyaman untuk harian atau olahraga ringan.',
            'price' => 750000,
            'stock' => 1,
            'size' => 'EU 42',
            'brand' => 'Nike',
            'weight' => 800,
            'condition' => 'like_new',
            'minus_detail' => 'Tidak ada minus, hanya kotor pemakaian di sol.',
            'category' => 'Footwear',
            'images' => json_encode(["products/nike shoes.jpg"]),
            'thumbnail' => "products/nike shoes.jpg",
            'is_available' => true,
            'is_negotiable' => true,
            'is_featured' => true,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Nike Air Force 1',
            'slug' => 'nike-af1-' . Str::lower(Str::random(5)),
            'description' => 'Varian lain dari koleksi Nike. Desain klasik yang tidak lekang oleh waktu.',
            'price' => 680000,
            'stock' => 1,
            'size' => 'EU 41',
            'brand' => 'Nike',
            'weight' => 850,
            'condition' => 'good',
            'minus_detail' => 'Box asli sudah hilang.',
            'category' => 'Footwear',
            'images' => json_encode(["products/nike shoes 2.jpg"]),
            'thumbnail' => "products/nike shoes 2.jpg",
            'is_available' => true,
            'is_negotiable' => true,
            'is_featured' => false,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Nike Stussy Sweater',
            'slug' => 'nike-stussy-Sweater-' . Str::lower(Str::random(5)),
            'description' => 'Kolaborasi langka Nike x Stussy. Koleksi wajib bagi para sneakerhead.',
            'price' => 2500000,
            'stock' => 1,
            'size' => 'EU 43',
            'brand' => 'Nike',
            'weight' => 900,
            'condition' => 'new',
            'minus_detail' => 'Brand New In Box (BNIB).',
            'category' => 'Footwear',
            'images' => json_encode(["products/sweat nike stussy.jpg"]),
            'thumbnail' => "products/sweat nike stussy.jpg",
            'is_available' => true,
            'is_negotiable' => false,
            'is_featured' => true,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Apple Watch',
            'slug' => 'apple-watch-' . Str::lower(Str::random(5)),
            'description' => 'Smartwatch Apple kondisi mulus. Battery health masih sangat baik di atas 90%.',
            'price' => 3200000,
            'stock' => 1,
            'size' => '44mm',
            'brand' => 'Apple',
            'weight' => 300,
            'condition' => 'like_new',
            'minus_detail' => 'Lecet halus hampir tidak terlihat di bodi samping.',
            'category' => 'Electronics',
            'images' => json_encode(["products/apple watch.jpg"]),
            'thumbnail' => "products/apple watch.jpg",
            'is_available' => true,
            'is_negotiable' => true,
            'is_featured' => true,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Ami Hoodie',
            'slug' => 'ami-hoodie-' . Str::lower(Str::random(5)),
            'description' => 'Hoodie Ami Paris original. Bahan sangat tebal dan hangat, kualitas butik.',
            'price' => 1200000,
            'stock' => 1,
            'size' => 'L',
            'brand' => 'Ami Paris',
            'weight' => 700,
            'condition' => 'good',
            'minus_detail' => 'Tag leher sedikit pudar.',
            'category' => 'Fashion',
            'images' => json_encode(["products/ami hoodie.jpg"]),
            'thumbnail' => "products/ami hoodie.jpg",
            'is_available' => true,
            'is_negotiable' => true,
            'is_featured' => false,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Fred Perry Shirt',
            'slug' => 'fred-perry-shirt-' . Str::lower(Str::random(5)),
            'description' => 'Kaos Fred Perry klasik. Cocok untuk tampilan kasual tapi tetap rapi.',
            'price' => 450000,
            'stock' => 1,
            'size' => 'M',
            'brand' => 'Fred Perry',
            'weight' => 250,
            'condition' => 'good',
            'minus_detail' => 'Warna sedikit pudar karena pencucian.',
            'category' => 'Fashion',
            'images' => json_encode(["products/fred perry shirt.jpeg"]),
            'thumbnail' => "products/fred perry shirt.jpeg",
            'is_available' => true,
            'is_negotiable' => true,
            'is_featured' => false,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Coach Bag',
            'slug' => 'coach-bag-' . Str::lower(Str::random(5)),
            'description' => 'Tas Coach original. Kulit asli masih sangat lentur, interior bersih.',
            'price' => 1850000,
            'stock' => 1,
            'size' => 'Medium',
            'brand' => 'Coach',
            'weight' => 600,
            'condition' => 'like_new',
            'minus_detail' => 'Dustbag tidak ada.',
            'category' => 'Accessories',
            'images' => json_encode(["products/coach bag.jpeg"]),
            'thumbnail' => "products/coach bag.jpeg",
            'is_available' => true,
            'is_negotiable' => true,
            'is_featured' => true,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Buku Belajar Flutter',
            'slug' => 'buku-belajar-flutter-' . Str::lower(Str::random(5)),
            'description' => 'Panduan lengkap belajar Flutter. Sangat cocok untuk kamu yang ingin jadi mobile developer.',
            'price' => 95000,
            'stock' => 1,
            'size' => 'A5',
            'brand' => 'Edukasi',
            'weight' => 400,
            'condition' => 'good',
            'minus_detail' => 'Ada coretan sedikit di halaman depan.',
            'category' => 'Accessories',
            'images' => json_encode(["products/buku flutter.png"]),
            'thumbnail' => "products/buku flutter.png",
            'is_available' => true,
            'is_negotiable' => false,
            'is_featured' => false,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Crocs Women',
            'slug' => 'crocs-women-' . Str::lower(Str::random(5)),
            'description' => 'Sandal Crocs wanita, sangat ringan dan empuk. Cocok untuk santai.',
            'price' => 500000,
            'stock' => 1,
            'size' => 'W7',
            'brand' => 'Crocs',
            'weight' => 400,
            'condition' => 'good',
            'minus_detail' => 'Jibbitz sudah tidak lengkap.',
            'category' => 'Footwear',
            'images' => json_encode(["products/crocs women.jpg"]),
            'thumbnail' => "products/crocs women.jpg",
            'is_available' => true,
            'is_negotiable' => true,
            'is_featured' => false,
        ]);

        Product::query()->create([
            'shop_id' => $shopId,
            'name' => 'Air Pods 2',
            'slug' => 'air-pods-2-' . Str::lower(Str::random(5)),
            'description' => 'Apple AirPods 2nd Gen. Koneksi cepat, suara masih jernih, baterai awet.',
            'price' => 1100000,
            'stock' => 1,
            'size' => 'One Size',
            'brand' => 'Apple',
            'weight' => 150,
            'condition' => 'fair',
            'minus_detail' => 'Charging case ada baret-baret halus pemakaian.',
            'category' => 'Electronics',
            'images' => json_encode(["products/air pods 2.jpg"]),
            'thumbnail' => "products/air pods 2.jpg",
            'is_available' => true,
            'is_negotiable' => true,
            'is_featured' => true,
        ]);
    }
}
