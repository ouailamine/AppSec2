<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'departement_code',
        'region_code',
        'ZIP_code',
    ];

    /**
     * Get the department that owns the city.
     */
    public function department()
    {
        return $this->belongsTo(Departement::class, 'departement_code', 'departement_code');
    }
}
