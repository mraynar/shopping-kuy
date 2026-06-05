<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'size',
        'brand',
        'weight',
        'condition',
        'category',
        'gender',
        'images',
        'thumbnail',
        'is_available',
        'is_negotiable'
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'integer',
        'stock' => 'integer',
        'is_available' => 'boolean',
        'is_negotiable' => 'boolean',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
