<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Planning;
use App\Models\Site;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use DateTime;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class EmployeeController extends Controller
{
    public function index()
{
    $guard = Auth::user();
    $guard_id = $guard->id;
    
    // Calculer les mois
    $currentMonth = Carbon::now()->month;
    $currentYear = Carbon::now()->year;

    $previousMonth = $currentMonth - 1;
    $nextMonth = $currentMonth + 1;

    if ($previousMonth < 1) {
        $previousMonth = 12;
        $previousYear = $currentYear - 1;
    } else {
        $previousYear = $currentYear;
    }

    if ($nextMonth > 12) {
        $nextMonth = 1;
        $nextYear = $currentYear + 1;
    } else {
        $nextYear = $currentYear;
    }

    $sites = Site::all();

    $plannings = Planning::where(function ($query) use ($currentMonth, $currentYear, $previousMonth, $previousYear, $nextMonth, $nextYear) {
        $query->where(function ($query) use ($currentMonth, $currentYear) {
            $query->where('month', $currentMonth)
                  ->where('year', $currentYear);
        })
        ->orWhere(function ($query) use ($previousMonth, $previousYear) {
            $query->where('month', $previousMonth)
                  ->where('year', $previousYear);
        })
        ->orWhere(function ($query) use ($nextMonth, $nextYear) {
            $query->where('month', $nextMonth)
                  ->where('year', $nextYear);
        });
    })
    ->with(['events' => function ($query) use ($guard_id) {
        $query->where('user_id', $guard_id);
    }])
    ->get();

 

    return Inertia::render('Employee/Dashboard', [
        'planning' => $plannings,
        'currentMonth' => $currentMonth,
        'currentYear' => $currentYear,
        'sites' => $sites,
        'posts'=>Post::all(),
    ]);
}


public function planningGuard()
{
    $guard = Auth::user();
    $guard_id = $guard->id;
    
    // Calculer les mois
    $currentMonth = Carbon::now()->month;
    $currentYear = Carbon::now()->year;

    $previousMonth = $currentMonth - 1;
    $nextMonth = $currentMonth + 1;

    if ($previousMonth < 1) {
        $previousMonth = 12;
        $previousYear = $currentYear - 1;
    } else {
        $previousYear = $currentYear;
    }

    if ($nextMonth > 12) {
        $nextMonth = 1;
        $nextYear = $currentYear + 1;
    } else {
        $nextYear = $currentYear;
    }


    $plannings = Planning::where(function ($query) use ($currentMonth, $currentYear, $previousMonth, $previousYear, $nextMonth, $nextYear) {
        $query->where(function ($query) use ($currentMonth, $currentYear) {
            $query->where('month', $currentMonth)
                  ->where('year', $currentYear);
        })
        ->orWhere(function ($query) use ($previousMonth, $previousYear) {
            $query->where('month', $previousMonth)
                  ->where('year', $previousYear);
        })
        ->orWhere(function ($query) use ($nextMonth, $nextYear) {
            $query->where('month', $nextMonth)
                  ->where('year', $nextYear);
        });
    })
    ->with(['events' => function ($query) use ($guard_id) {
        $query->where('user_id', $guard_id);
    }])
    ->get();

    

    return Inertia::render('Employee/PlanningGuard', [
        'plannings' => $plannings,
        'currentMonth' => $currentMonth,
        'currentYear' => $currentYear,
        'sites' => Site::all(),
        'posts'=>Post::all(),
    ]);
}

}
