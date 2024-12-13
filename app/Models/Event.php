<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'planning_id',
        'site_id',
        'userName',
        'month',
        'year',
        'post',
        'postName',
        'typePost',
        'vacation_start',
        'vacation_end',
        'pause_payment',
        'pause_start',
        'pause_end',
        'LunchAllowance',
        'selected_days',
        'work_duration',
        'night_hours',
        'sunday_hours',
        'holiday_hours',
        'isSubEvent',
        'relatedEvent',
    ];


    // Define the relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function site()
    {
        return $this->belongsTo(Site::class, 'site_id'); // Assurez-vous que 'planning_id' est le bon nom de colonne
    }

    public function planning()
    {
        return $this->belongsTo(Planning::class, 'planning_id'); // Assurez-vous que 'planning_id' est le bon nom de colonne
    }

    // Define the relationship with Incident
    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }
}
