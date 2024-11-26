<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypePost extends Model
{
    protected $fillable = ['name', 'default_duration'];


    public function typePost()
    {
        return $this->belongsTo(TypePost::class);
    }
}
