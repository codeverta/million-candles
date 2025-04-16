<?php

// app/Models/MaterialStockMovement.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialStockMovement extends Model
{
    protected $fillable = ['material_id', 'type', 'quantity', 'note'];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
