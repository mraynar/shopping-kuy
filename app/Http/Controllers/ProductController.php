<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Shop;
use App\Models\Category;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $shop = Shop::query()->where('user_id', $user->id)->first();
        $products = $shop
            ? Product::query()->where('shop_id', $shop->id)->latest()->get()
            : collect([]);

        return Inertia::render('Products/Index', array_merge([
            'products' => $products,
            'shop' => $shop,
        ], $this->getMasterData()));
    }

    public function show(Product $product): Response
    {
        $product->load('shop');

        $isInCart = false;
        if (Auth::check()) {
            $isInCart = Cart::query()
                ->where('user_id', Auth::id())
                ->where('product_id', $product->id)
                ->exists();
        }

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'isInCart' => $isInCart
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer|min:1',
            'weight' => 'required|integer',
            'gender' => 'required|in:pria,wanita,unisex',
            'condition' => 'required|in:new,like_new,good,fair',
            'category' => 'required',
            'description' => 'required',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $shop = Shop::query()->where('user_id', $user->id)->first();
        $imagePaths = $this->uploadImages($request);

        Product::query()->create([
            'shop_id' => $shop->id,
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::lower(Str::random(5)),
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'weight' => $request->weight,
            'size' => $request->size,
            'brand' => $request->brand,
            'condition' => $request->condition,
            'gender' => $request->gender,
            'category' => $request->category,
            'images' => $imagePaths,
            'thumbnail' => $imagePaths[0] ?? null,
            'is_negotiable' => $request->is_negotiable ?? true,
            'is_available' => true,
        ]);

        return back()->with('message', 'Produk berhasil diterbitkan!');
    }

    public function toggleFavourite(Product $product): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $favourite = $user->favorites()->where('product_id', $product->id)->first();

        if ($favourite) {
            $favourite->delete();
            $status = 'Produk dihapus dari favorit.';
        } else {
            $user->favorites()->create(['product_id' => $product->id]);
            $status = 'Produk berhasil disukai.';
        }

        return back()->with('message', $status);
    }

    private function getMasterData(): array
    {
        return [
            'categories' => Category::query()->select('id', 'name')->get(),
            'genders' => [
                ['value' => 'pria', 'label' => 'Pria'],
                ['value' => 'wanita', 'label' => 'Wanita'],
                ['value' => 'unisex', 'label' => 'Unisex'],
            ],
            'conditions' => [
                ['value' => 'new', 'label' => 'Baru (BNIB/NWOT)'],
                ['value' => 'like_new', 'label' => 'Seperti Baru (VGC)'],
                ['value' => 'good', 'label' => 'Layak Pakai (Good)'],
                ['value' => 'fair', 'label' => 'Biasa (Fair)'],
            ],
        ];
    }

    private function uploadImages(Request $request): array
    {
        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $paths[] = $image->store('products', 'public');
            }
        }
        return $paths;
    }
}
