<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        // ambil nama file dari URL firebase
        $path = parse_url($value, PHP_URL_PATH);
        $segments = explode('/', $path);
        $lastSegment = end($segments);
        $decodedPath = urldecode($lastSegment);

        return "https://cdn.souvenirlilin.id/{$decodedPath}";
    }

}
