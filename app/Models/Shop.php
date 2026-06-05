<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shop extends Model
{
    protected $fillable = [
        'user_id',
        'shop_name',
        'slug',
        'description',
        'ktp_image',
        'selfie_image',
        'province_id',
        'city_id',
        'district_id',
        'subdistrict_id',
        'postal_code',
        'pickup_address', 
        'address_note',
        'status',
        'is_active',
    ];

    /**
     * Relasi ke User (Pemilik Toko)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Produk (Kunci untuk memperbaiki error RelationNotFoundException)
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // Pastikan model Province dan City tersedia di database
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
