<?php

namespace App\Models;


use Illuminate\Foundation\Auth\User as Authenticatable; // Importation de la classe Authenticatable
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Authenticatable // Votre modèle doit maintenant étendre Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'manager_name',
        'email',
        'phone',
        'address',
        'password',
    ];

    public function sites()
    {
        return $this->hasMany(Site::class);
    }
}

