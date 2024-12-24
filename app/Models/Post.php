<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    use HasFactory;

    protected $fillable = [
        'name',
        'abbreviation',
        'type_post_id',
        'default_duration_hours',
        'default_duration_minutes',
    ];

    public function typePost()
    {
        return $this->belongsTo(TypePost::class);
    }
}
