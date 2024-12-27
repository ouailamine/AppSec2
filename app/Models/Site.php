<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'manager_name',
        'customer_id',
        'address',
        'email',
        'phone',

    ];

    public function events()
    {
        return $this->hasMany(Event::class, 'site_id'); // Assurez-vous que 'planning_id' est le bon nom de colonne
    }

    public function users()
{
    return $this->belongsToMany(User::class, 'site_user', 'site_id', 'user_id')
                ->withPivot('isFirstList'); 
               
}

public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}
