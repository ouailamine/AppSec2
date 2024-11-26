<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
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
    ];

    /**
     * Get the region that owns the department.
     */
    public function region()
    {
        return $this->belongsTo(Region::class, 'region_code', 'region_code');
    }

    /**
     * Get the cities for the department.
     */
    public function cities()
    {
        return $this->hasMany(City::class, 'departement_code', 'departement_code');
    }
}
