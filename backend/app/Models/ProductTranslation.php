<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductTranslation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_id',
        'locale',
        'name',
        'description',
    ];

    /**
     * Get the product that this translation belongs to.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected static function booted(): void
    {
        // Panggil setelah ProductTranslation disimpan (dibuat/diperbarui)
        static::saved(function (ProductTranslation $translation) {
            // ATAU Anda bisa memilih locale mana pun untuk menjadi dasar slug.
            $defaultLocale = config('app.locale');

            if ($translation->locale === $defaultLocale) {
                $product = $translation->product;
                
                // Pastikan nama ada
                if ($translation->name && $product) {
                    $slug = Str::slug($translation->name);
                    
                    // Hanya simpan jika slug berubah untuk menghindari loop
                    if ($product->slug !== $slug) {
                        $product->slug = $slug;
                        $product->saveQuietly(); // Gunakan saveQuietly() untuk menghindari memicu event lagi
                    }
                }
            }
        });
    }
}