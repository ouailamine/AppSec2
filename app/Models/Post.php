<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    use HasFactory;

    protected $fillable = ['name', 'abbreviation', 'type', 'duration_of_work', 'type_post_id'];

    public function typePost()
    {
        return $this->belongsTo(TypePost::class);
    }
}
