<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;


    /**
     * @var string[]
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'code',
        'slug',
        'deleted_at',
        'views_count',
    ];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->uuid = Str::uuid();
        });

        static::saving(function (Product $product) {
            $product->slug = Str::slug($product->name);
        });
    }
    /**
     * @return BelongsTo
     */
    public function productCategories(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable', 'documentable_type');
    }

    /**
     * Get all the variants for the product.
     */
    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Get all the variant combinations for the product.
     */
    public function variantCombinations()
    {
        return $this->hasMany(VariantCombination::class);
    }

    /**
     * Get the product category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_categories_id');
    }

    /**
     * Method to easily access formatted variant information.
     *
     * @return \Illuminate\Support\Collection
     */
    public function formattedVariants()
    {
        return $this->variants->map(function ($variant) {
            return [
                'name' => $variant->name,
                'options' => 'hehe'
                // 'options' => $variant->options,
            ];
        });
    }

    public function productWithVariantsAndOptions()
    {
        return self::where('id', $this->id)
            ->with(['variants' => function ($query) {
                $query->with('options'); // Eager load options for existing variants
            }]);
    }


    /**
     * Method to easily access variant combinations with their values.
     *
     * @return \Illuminate\Support\Collection
     */
    public function detailedCombinations()
    {
        return $this->variantCombinations->map(function ($combination) {
            return [
                'sku' => $combination->sku,
                'price' => $combination->price,
                'stock' => $combination->stock,
                'options' => $combination->values->mapWithKeys(function ($value) {
                    return [$value->option->variant->name => $value->option->name];
                }),
            ];
        });
    }


    /**
     * Get the translations for the product.
     */
    public function translations()
    {
        return $this->hasMany(ProductTranslation::class);
    }

    /**
     * Get the translation for the current locale or fallback to default.
     *
     * @param string|null $locale
     * @return \App\Models\ProductTranslation|null
     */
    public function translation(?string $locale = null)
    {
        $locale = $locale ?: App::getLocale();
        // First try to find a translation for the current locale
        $translation = $this->translations()->where('locale', $locale)->first();
        
        // If not found and locale isn't already the fallback locale, try the fallback
        if (!$translation && $locale !== config('app.fallback_locale')) {
            $translation = $this->translations()->where('locale', config('app.fallback_locale'))->first();
        }
        
        return $translation;
    }

    /**
     * Get the translated name attribute.
     *
     * @return string
     */
    public function getTranslatedNameAttribute()
    {
        $translation = $this->translation();
        return $translation && $translation->name ? $translation->name : $this->name;
    }

    /**
     * Get the translated description attribute.
     *
     * @return string
     */
    public function getTranslatedDescriptionAttribute()
    {
        $translation = $this->translation();
        return $translation && $translation->description ? $translation->description : $this->description;
    }

    /**
     * Get the price in the specified currency.
     *
     * @param string|null $currencyCode
     * @return float
     */
    public function getPriceInCurrencyAttribute(?string $currencyCode = null)
    {
        // If no currency specified, use default
        if (!$currencyCode) {
            $currency = Currency::getDefault();
            return $this->price;
        }

        $currency = Currency::find($currencyCode);
        if (!$currency) {
            return $this->price; // Return original price if currency not found
        }

        return $currency->convert($this->price);
    }

    /**
     * Get the formatted price in the specified currency.
     *
     * @param string|null $currencyCode
     * @return string
     */
    public function getFormattedPriceAttribute()
    {
        $currencyCode = request()->query('currency');
        // If no currency specified, use default
        if (!$currencyCode) {
            $currency = Currency::getDefault();
            return $currency->format($this->price);
        }

        $currency = Currency::find($currencyCode);
        if (!$currency) {
            return Currency::getDefault()->format($this->price);
        }

        return $currency->convertAndFormat($this->price);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    // Optional: Add a method to calculate average rating
    public function getAverageRatingAttribute()
    {
        return $this->reviews()->where('is_approved', true)->avg('rating') ?? 0;
    }
}