<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planning extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_id',
        'year',
        'month',
        'isValidate',
    ];

    // Define the relationship with Site
    public function site()
    {
        return $this->belongsTo(Site::class, 'site_id');
    }

    public function events()
    {
        return $this->hasMany(Event::class, 'planning_id'); // Assurez-vous que 'planning_id' est le bon nom de colonne
    }
    protected static function booted()
    {
        static::deleting(function ($planning) {
            $planning->events()->delete();
        });
    }
}
