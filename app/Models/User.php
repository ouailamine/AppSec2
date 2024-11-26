<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

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
        'note',
        'registerNumber'
    ];

    public function sites()
    {
        return $this->belongsToMany(Site::class, 'site_user');
    }
    public function diplomas()
    {
        return $this->hasMany(Diploma::class);
    }
    public function planning()
    {
        return $this->hasOne(Planning::class);
    }
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
