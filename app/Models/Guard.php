<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guard extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fullname',
        'firstname',
        'date_of_birth',
        'genre',
        'nationality',
        'address',
        'city',
        'departement',
        'region',
        'phone',
        'social_security_number',
        'professional_card_number',
        'diplomas',
        'typeAds',
        'email',
        'password',
    ];

    /**
     * Get the genre that owns the guard.
     */
    public function genre()
    {
        return $this->belongsTo(Genre::class, 'genre_id'); // Précisez la clé étrangère genre_id
    }



    /**
     * Get the diplomas for the guard.
     */
    public function diplomas()
    {
        return $this->hasMany(Diploma::class);
    }
}
