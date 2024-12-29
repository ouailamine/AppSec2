<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Planning;
use App\Models\Site;
use App\Models\Customer;
use App\Models\Holiday;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use DateTime;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class CustomerPageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customer =  Auth::user();
        $customer_id = $customer->id;
        $customerSites = Customer::with('sites')->find($customer_id);
        $site_ids = $customerSites->sites->pluck('id');

        //
        //$sites = $customer->sites;

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
        $sitesIds = [1, 3, 4];

        $plannings = Planning::where(function ($query) use ($currentMonth, $currentYear, $previousMonth, $previousYear, $nextMonth, $nextYear, $sitesIds) {
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
            ->whereIn('site_id', $site_ids)
            ->with('events') // Eager load related events
            ->get();




        return Inertia::render('CustomerPage/App', [
            'plannings' => $plannings,
            'customerSites' => $customerSites,
            'users' => User::all(),
            'sites' => Site::all(),
            'holidays' => Holiday::all(),

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
