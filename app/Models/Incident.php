<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    // Indique les attributs qui peuvent être assignés en masse
    protected $fillable = [

        'start_time',
        'end_time',
        'type',
        'description',
        'isClose'
    ];
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
