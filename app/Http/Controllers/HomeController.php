<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Shop;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome', [
            'dbCategories' => $this->getFormattedCategories(),
            'products' => $this->getLatestProducts(),
            'featuredProducts' => $this->getFeaturedProducts(),
            'recommendedSellers' => $this->getRecommendedSellers(),
        ]);
    }

    private function getFormattedCategories()
    {
        return Category::all()->map(function ($cat) {
            $nameLower = strtolower($cat->name);
            $extension = in_array($nameLower, ['sepatu', 'gaya hidup']) ? 'jpeg' : 'jpg';
            $fileName = ($nameLower === 'pakaian atas') ? 'pakaian atasan' : $nameLower;

            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'img' => "/storage/categories/{$fileName}.{$extension}"
            ];
        });
    }

    private function getLatestProducts()
    {
        $user = Auth::user();
        $query = Product::with('shop');

        if (Schema::hasColumn('products', 'is_available')) {
            $query->where('is_available', true);
        }

        return $query->latest()->take(10)->get()->map(function ($product) use ($user) {
            $productArray = $product->toArray();
            // Cek apakah user login dan apakah produk ini ada di tabel favorites
            $productArray['is_favourited'] = $user
                ? $user->favorites()->where('product_id', $product->id)->exists()
                : false;
            return $productArray;
        });
    }

    private function getFeaturedProducts()
    {
        $user = Auth::user();
        $query = Product::with('shop');

        if (Schema::hasColumn('products', 'is_featured')) {
            $query->where('is_featured', true);
        }

        return $query->latest()->take(4)->get()->map(function ($product) use ($user) {
            $productArray = $product->toArray();
            $productArray['is_favourited'] = $user
                ? $user->favorites()->where('product_id', $product->id)->exists()
                : false;
            return $productArray;
        });
    }

    private function getRecommendedSellers()
    {
        return Shop::with(['products' => function ($query) {
            $query->latest()->take(3);
        }])->latest()->take(8)->get()->map(function ($shop) {
            $cleanedImages = $shop->products->map(function ($product) {
                $path = str_replace(['"', '[', ']', '\\'], '', $product->thumbnail);
                return $path ? "/storage/{$path}" : null;
            })->filter()->values();

            return [
                'name' => $shop->shop_name,
                'avatar' => strtoupper(substr($shop->shop_name, 0, 1)),
                'images' => $cleanedImages->count() >= 3
                    ? $cleanedImages->take(3)->toArray()
                    : [
                        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400',
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400',
                        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400'
                    ],
                'rating' => 5
            ];
        });
    }
}
