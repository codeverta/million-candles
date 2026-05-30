<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'documentable_id',
        'documentable_type',
        'filename',
    ];

    public function documentable()
    {
        return $this->morphTo();
    }

    public function getFilenameAttribute($value)
    {
        if (! $value) {
            return $value;
        }

        if (Str::startsWith($value, ['http://', 'https://'])) {
            if (Str::contains($value, 'firebasestorage.googleapis.com')) {
                $path = parse_url($value, PHP_URL_PATH);
                $segments = explode('/', $path);
                $lastSegment = end($segments);
                $decodedPath = urldecode($lastSegment);

                return "https://cdn.souvenirlilin.id/{$decodedPath}";
            }

            return $value;
        }

        return Storage::disk('public')->url($value);
    }

}
