<?php

namespace App\Http\Controllers\Planning;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Holiday;
use Illuminate\Http\Request;
use App\Models\Planning;
use App\Models\Site;
use App\Models\Post;
use App\Models\TypePost;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;

class PlanningController extends Controller
{
    public function index()
    {
        $plannings = Planning::with(['site'])->get();
        $sites = site::All();
        return Inertia::render('Planning/Index', [
            'plannings' => $plannings,
            'sites' => $sites

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // Méthode pour afficher le formulaire de création
    public function create()
    {
        return Inertia::render('Planning/Create3', [
            'posts' => Post::all(),
            'sites' => Site::with('users')->get(),
            'holidays' => Holiday::all(),
            'users' => User::all(),
            'plannings' => Planning::all(),
            'typePosts' => TypePost::all(),
            'IsShow' => false
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Debug the request (remove in production)
        dd($request);

        // 1. Validate that there are events in the request
        if (empty($request->events) || !is_array($request->events)) {
            return redirect()->back()->withErrors(['error' => 'No events provided for the planning.']);
        }

        // 2. Create the planning for the current month if events are present
        $planning = Planning::create([
            'site_id' => $request->site,
            'month' => $request->month,
            'year' => $request->year,
            'isValidate' => false,
        ]);

        // 3. Create the associated events for the current month
        foreach ($request->events as $eventData) {
            $planning->events()->create([
                'id' => $eventData['id'],
                'user_id' => $eventData['user_id'],
                'site_id' => $request->site,
                'month' => $request->month,
                'year' => $request->year,
                'typePost' => $eventData['typePost'],
                'post' => $eventData['post'],
                'lunchAllowance' => $eventData['lunchAllowance'],
                'vacation_start' => $eventData['vacation_start'],
                'vacation_end' => $eventData['vacation_end'],
                'pause_payment' => $eventData['pause_payment'],
                'pause_start' => $eventData['pause_start'],
                'pause_end' => $eventData['pause_end'],
                'selected_days' => $eventData['selected_days'],
                'work_duration' => $eventData['work_duration'],
                'night_hours' => $eventData['night_hours'],
                'sunday_hours' => $eventData['sunday_hours'],
                'holiday_hours' => $eventData['holiday_hours'],
            ]);
        }

        // 4. Handle events for the next month, if provided
        if (!empty($request->eventsNextMonth) && is_array($request->eventsNextMonth)) {
            $nextMonth = $request->month + 1;
            $nextYear = $request->year;

            // Adjust year if the month is December (12 -> 1 of next year)
            if ($nextMonth > 12) {
                $nextMonth = 1;
                $nextYear += 1;
            }

            $nextMonthPlanning = Planning::create([
                'site_id' => $request->site,
                'month' => $nextMonth,
                'year' => $nextYear,
                'isValidate' => false,
            ]);

            foreach ($request->eventsNextMonth as $eventData) {
                $nextMonthPlanning->events()->create([
                    'id' => $eventData['id'],
                    'user_id' => $eventData['user_id'],
                    'site_id' => $request->site,
                    'month' => $nextMonth,
                    'year' => $nextYear,
                    'typePost' => $eventData['typePost'],
                    'post' => $eventData['post'],
                    'lunchAllowance' => $eventData['lunchAllowance'],
                    'vacation_start' => $eventData['vacation_start'],
                    'vacation_end' => $eventData['vacation_end'],
                    'pause_payment' => $eventData['pause_payment'],
                    'pause_start' => $eventData['pause_start'],
                    'pause_end' => $eventData['pause_end'],
                    'selected_days' => $eventData['selected_days'],
                    'work_duration' => $eventData['work_duration'],
                    'night_hours' => $eventData['night_hours'],
                    'sunday_hours' => $eventData['sunday_hours'],
                    'holiday_hours' => $eventData['holiday_hours'],
                ]);
            }
        }

        // 5. Redirect with a success message
        return redirect()->route('plannings.index')->with('success', 'Planning created successfully with associated events.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        // Ensure that 'planningIds' is a single value or an array; adjust accordingly
        $planningId = $request->planningIds;

        // Fetch all required data in one go
        $sites = Site::with('users')->get();
        $posts = Post::all();
        $holidays = Holiday::all();
        $users = User::all();

        // Find the planning instance with the associated events
        $selectedPlanning = Planning::with('events')->find($planningId);





        // If planning is not found, handle the error (optional)
        if (!$selectedPlanning) {
            return redirect()->route('plannings.index')->with('error', 'Planning not found.');
        }

        // Return the Inertia view with the required data
        return Inertia::render('Planning/Create3', [
            'selectedPlanning' => $selectedPlanning,
            'posts' => $posts,
            'sites' => $sites,
            'holidays' => $holidays,
            'users' => $users,
            'typePosts' => TypePost::all(),
            'isShow' => true
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // 1. Retrieve the existing Planning instance by ID
        $planning = Planning::findOrFail($id);

        // 2. Update the Planning with the new data from the request
        $planning->update([
            'site_id' => $request->site,
            'month' => $request->month,
            'year' => $request->year,
            'isValidate' => $request->isValidate ?? false,
        ]);

        // 3. Update the associated events
        // First, clear the existing events (optional: you might want to update existing records instead of deleting them)
        $planning->events()->delete();

        // Then, create the new events from the request data
        foreach ($request->events as $eventData) {

            $planning->events()->create([
                'id' => $eventData['id'],
                'user_id' => $eventData['user_id'],
                'site_id' => $eventData['site_id'],
                'month' => $eventData['month'],
                'year' => $eventData['year'],
                'post' => $eventData['post'],
                'vacation_start' => $eventData['vacation_start'],
                'vacation_end' => $eventData['vacation_end'],
                'pause_payment' => $eventData['pause_payment'],
                'pause_start' => $eventData['pause_start'],
                'pause_end' => $eventData['pause_end'],
                'selected_days' => $eventData['selected_days'],
                'work_duration' => $eventData['work_duration'],
                'night_hours' => $eventData['night_hours'],
                'sunday_hours' => $eventData['sunday_hours'],
                'holiday_hours' => $eventData['holiday_hours'],
            ]);
        }

        return redirect()->back()->with('success', 'planning mis a jour ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Delete the planning record
        $planning = Planning::findOrFail($id);
        $planning->delete();

        return redirect()->route('plannings.index')->with('success', 'Planning deleted successfully.');
    }


    public function validate(Request $request)
    {
        // Récupérez les IDs des plannings depuis la requête
        $planningIds = $request->planningId;


        // Trouvez les plannings par leurs IDs et mettez à jour le champ isValidated
        $validatePlanning = Planning::where('id', $planningIds)->update(['isValidate' => true]);


        // Utilisez redirect()->back() pour revenir à la page précédente avec un message de succès
        return back()->with('success', 'Plannings validés avec succès');
    }
}
