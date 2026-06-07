<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Order extends Model
{
    // ─── Status Constants ──────────────────────────────────────────────────
    const STATUS_PENDING   = 'pending';
    const STATUS_PAID      = 'paid';
    const STATUS_PACKING   = 'packing';
    const STATUS_SHIPPING  = 'shipping';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'order_number',
        'user_id',
        'total_amount',
        'shipping_cost',
        'courier',
        'service',
        'waybill',
        'status',
        'snap_token',
        'payment_type',
        'shipping_address',
    ];

    // ─── Query Scopes ──────────────────────────────────────────────────────

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', [
            self::STATUS_PAID,
            self::STATUS_PACKING,
            self::STATUS_SHIPPING,
        ]);
    }

    // ─── Relationships ─────────────────────────────────────────────────────

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
