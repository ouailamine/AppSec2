<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatchEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'post',
        'site_id',
        'sunday_hours',
        'holiday_hours',
        'night_hours',
        'hours',
        'date_vacation',
        'date_regularization',
        'managerCreate',
        'managerValidate',
        'isRuler',
        'isBilled',
        'lunchAllowance'
    ];

    // Define relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }
}
