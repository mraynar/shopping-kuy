<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class TransactionsController extends Controller
{
    public function cart(): Response
    {
        return Inertia::render('Transactions/CartPage', [
            'cartItems' => $this->getCartItems()
        ]);
    }

    public function addToCart(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'nullable|string'
        ]);

        $userId = Auth::id();
        $productId = $request->input('product_id');
        $product = Product::query()->where('id', $productId)->first();
        $cart = Cart::query()
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($cart) {
            if ($request->input('type') === 'update') {
                $cart->quantity = (int) $request->quantity;
            } else {
                if ($product && $product->stock <= 1) {
                    return redirect()->back()->with('message', 'Item sudah ada di Tas Belanja.');
                }
                $cart->quantity += (int) $request->quantity;
            }
            $cart->save();
        } else {
            Cart::query()->create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $request->quantity,
            ]);
        }

        return redirect()->back();
    }

    public function removeFromCart(string $id): RedirectResponse
    {
        Cart::query()->where('id', $id)->where('user_id', Auth::id())->delete();
        return redirect()->route('cart.index');
    }

    public function checkout(): Response
    {
        return Inertia::render('Transactions/CheckoutPage', [
            'cartItems' => $this->getCartItems()
        ]);
    }

    public function getShippingCost(Request $request)
    {
        $request->validate([
            'destination' => 'required|integer',
            'weight'      => 'required|integer',
            'courier'     => 'required|string',
        ]);

        try {
            $response = Http::withHeaders([
                'key' => env('RAJAONGKIR_API_KEY'),
            ])->asForm()->post('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', [
                'origin'      => env('RAJAONGKIR_ORIGIN_ID'),
                'destination' => $request->destination,
                'weight'      => $request->weight,
                'courier'     => $request->courier,
            ]);

            $data = $response->json();

            if ($data['meta']['code'] !== 200) {
                return response()->json([], 422);
            }

            return response()->json($data['data'] ?? []);
        } catch (\Throwable $e) {
            Log::error('RajaOngkir Cost Error: ' . $e->getMessage());
            return response()->json([], 500);
        }
    }

    public function placeOrder(Request $request)
    {
        $request->validate([
            'courier'       => 'required|string',
            'service'       => 'required|string',
            'shipping_cost' => 'required|integer',
            'payment_type'  => 'required|string',
            'item_ids'      => 'required|array'
        ]);

        $user = Auth::user();

        $itemsToOrder = Cart::query()
            ->with('product')
            ->whereIn('id', $request->item_ids)
            ->where('user_id', $user->id)
            ->get();

        if ($itemsToOrder->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada item terpilih'
            ], 422);
        }

        // =========================
        // HITUNG TOTAL
        // =========================
        $subtotal = $itemsToOrder->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $shippingCost = (int) $request->shipping_cost;

        $grossAmount = $subtotal + $shippingCost;

        // =========================
        // ALAMAT
        // =========================
        $shippingAddress = implode(', ', array_filter([
            $user->address_notes,
            $user->subdistrict_name,
            $user->district_name,
            $user->city_name,
            $user->province_name,
            $user->postal_code,
        ]));

        // =========================
        // BUAT ORDER
        // =========================
        $order = Order::create([
            'order_number'     => 'ORD-' . strtoupper(uniqid()),
            'user_id'          => $user->id,
            'total_amount'     => $grossAmount,
            'shipping_cost'    => $shippingCost,
            'courier'          => strtoupper($request->courier),
            'service'          => strtoupper($request->service),
            'status'           => 'pending',
            'payment_type'     => $request->payment_type,
            'shipping_address' => $shippingAddress,
        ]);

        // =========================
        // ORDER ITEMS
        // =========================
        foreach ($itemsToOrder as $item) {

            // OPTIONAL:
            // cek product null supaya aman
            if (!$item->product) {
                continue;
            }

            OrderItem::create([
                'order_id'          => $order->id,
                'product_id'        => $item->product_id,
                'quantity'          => $item->quantity,
                'price_at_purchase' => $item->product->price,
            ]);
        }

        // =========================
        // MIDTRANS CONFIG
        // =========================
        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        // =========================
        // ITEM DETAILS
        // =========================
        $itemDetails = [];

        foreach ($itemsToOrder as $item) {

            if (!$item->product) {
                continue;
            }

            $itemDetails[] = [
                'id'       => (string) $item->product_id,
                'price'    => (int) $item->product->price,
                'quantity' => (int) $item->quantity,
                'name'     => substr($item->product->name, 0, 50),
            ];
        }

        // TAMBAH ONGKIR
        $itemDetails[] = [
            'id'       => 'SHIPPING',
            'price'    => $shippingCost,
            'quantity' => 1,
            'name'     => 'Ongkos Kirim',
        ];

        // =========================
        // PARAMS MIDTRANS
        // =========================
        $params = [
            'transaction_details' => [
                'order_id'     => $order->order_number,
                'gross_amount' => (int) $grossAmount,
            ],

            'customer_details' => [
                'first_name' => $user->name,
                'email'      => $user->email,
                'phone'      => $user->phone ?? '',
            ],

            'item_details' => $itemDetails,
        ];

        try {

            Log::info('MIDTRANS PARAMS', $params);

            $snapToken = Snap::getSnapToken($params);

            $order->update([
                'snap_token' => $snapToken
            ]);

            // HAPUS CART SETELAH TOKEN BERHASIL DIBUAT
            Cart::query()
                ->whereIn('id', $request->item_ids)
                ->where('user_id', $user->id)
                ->delete();

            return response()->json([
                'success'      => true,
                'snap_token'   => $snapToken,
                'order_number' => $order->order_number,
            ]);
        } catch (\Throwable $e) {

            Log::error('MIDTRANS ERROR: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function midtransNotification(Request $request)
    {
        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);

        try {
            $notif = new Notification();
            $order = Order::where('order_number', $notif->order_id)->first();

            if (!$order) return response()->json(['message' => 'Order tidak ditemukan'], 404);

            $transactionStatus = $notif->transaction_status;
            $paymentType       = $notif->payment_type;
            $fraudStatus       = $notif->fraud_status;

            if ($transactionStatus == 'capture') {
                $order->status = $fraudStatus == 'accept' ? 'paid' : 'cancelled';
            } elseif ($transactionStatus == 'settlement') {
                $order->status = 'paid';
            } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
                $order->status = 'cancelled';
            } elseif ($transactionStatus == 'pending') {
                $order->status = 'pending';
            }

            $order->payment_type = $paymentType;
            $order->save();

            return response()->json(['message' => 'OK']);
        } catch (\Throwable $e) {
            Log::error('Midtrans Notification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error'], 500);
        }
    }

    public function orders(): Response
    {
        $orders = Order::query()
            ->with(['items.product.shop'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Transactions/OrdersPage', [
            'orders' => $orders
        ]);
    }

    public function success(): Response
    {
        return Inertia::render('Transactions/SuccessPage');
    }

    private function getCartItems()
    {
        return Cart::query()
            ->with('product.shop')
            ->where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id'         => $item->id,
                    'product_id' => $item->product->id,
                    'name'       => $item->product->name,
                    'brand'      => $item->product->brand,
                    'price'      => $item->product->price,
                    'quantity'   => $item->quantity,
                    'condition'  => $item->product->condition,
                    'size'       => $item->product->size,
                    'thumbnail'  => $item->product->thumbnail
                        ? asset('storage/' . $item->product->thumbnail)
                        : null,
                ];
            });
    }
}
