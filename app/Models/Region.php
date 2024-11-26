<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'region_code',
    ];

    /**
     * Get the departments for the region.
     */
    public function departments()
    {
        return $this->hasMany(Departement::class, 'region_code', 'region_code');
    }
}
