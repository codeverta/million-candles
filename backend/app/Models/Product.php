<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use App\Services\CurrencyService;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'description', 'price', 'stock', 'code', 'slug', 'deleted_at', 'views_count',
    ];

    // Single currency cache for entire request lifecycle
    protected static array $currencyCache = [];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->uuid = Str::uuid();
        });

        static::saving(function (Product $product) {
            $product->slug = Str::slug($product->name);
        });
    }

    // Optimized currency retrieval with single cache
    public function getCurrency(?string $code = null): Currency
    {
        $currencyService = app(CurrencyService::class);
        return $code ? $currencyService->getByCode($code) : $currencyService->getDefault();
    }

    // Relationships
    public function productCategories(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable', 'documentable_type');
    }

    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function variantCombinations()
    {
        return $this->hasMany(VariantCombination::class);
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_categories_id');
    }

    public function productTranslations()
    {
        return $this->hasMany(ProductTranslation::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    // Optimized translation method
    public function translation(?string $locale = null)
    {
        $locale = $locale ?: app()->getLocale();
        
        if ($this->relationLoaded('productTranslations')) {
            return $this->productTranslations->firstWhere('locale', $locale)
                ?? $this->productTranslations->firstWhere('locale', config('app.fallback_locale'));
        }
        
        return $this->productTranslations()->where('locale', $locale)->first()
            ?? $this->productTranslations()->where('locale', config('app.fallback_locale'))->first();
    }

    // Simplified price methods
    public function getPriceInCurrency(?string $currencyCode = null): float
    {
        $currency = self::getCurrency($currencyCode);
        return $currencyCode ? $currency->convert($this->price) : $this->price;
    }

    public function getFormattedPrice(?string $currencyCode = null): string
    {
        $currency = self::getCurrency($currencyCode);
        return $currencyCode ? $currency->convertAndFormat($this->price) : $currency->format($this->price);
    }

    // Attributes
    public function getTranslatedNameAttribute()
    {
        $translation = $this->translation();
        return $translation?->name ?? $this->name;
    }

    public function getTranslatedDescriptionAttribute()
    {
        $translation = $this->translation();
        return $translation?->description ?? $this->description;
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->where('is_approved', true)->avg('rating') ?? 0;
    }
}