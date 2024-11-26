<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'typeContrat',
        'typePost',
        'start',
        'end',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
