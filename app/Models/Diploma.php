<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diploma extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [

        'name',
        'validity_months',
        'endDate',
    ];

    /**
     * Get the user that owns the diploma.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the guard that owns the diploma.
     */
    public function guards()
    {
        return $this->belongsTo(Guard::class);
    }
}
