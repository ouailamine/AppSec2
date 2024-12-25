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
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\ManagerPlanningMail;
use App\Mail\GuardPlanningMail;
use Illuminate\Support\Facades\Mail;

use Carbon\Carbon;

class PlanningController extends Controller
{
    public function index()
    {
        return Inertia::render('Planning/Index', [
            'plannings' => Planning::with(['site'])->get(),
            'sites' => site::All(),
        ]);
    }


    public function create()
    {

        $currentDate = now(); // Récupère la date actuelle

        // Récupérer le mois actuel
        $currentMonth = 1;

        // Récupérer le mois suivant
        $nextMonth = 2;

        // Récupérer les plannings dont la date se trouve entre le début du mois actuel et la fin du mois suivant
        $plannings = Planning::whereBetween('month', [
            $currentMonth,
            $nextMonth
        ])->get();


        // Récupérer les événements associés aux plannings récupérés
        $eventsForSearchGuard = Event::whereIn('planning_id', $plannings->pluck('id'))->get();

        return Inertia::render('Planning/Create', [
            'posts' => Post::all(),
            'sites' => Site::with('users')->get(),
            'holidays' => Holiday::pluck('date')->toArray(),
            'users' => User::all(),
            'plannings' => Planning::all(),
            'typePosts' => TypePost::all(),
            'IsShow' => false,
            'eventsForSearchGuard' => $eventsForSearchGuard
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction(); // Commencer une transaction

        try {
            $planning = Planning::create([
                'site_id' => $request->site,
                'month' => $request->month,
                'year' => $request->year,
                'isValidate' => false,
            ]);

            // Traitement des événements du mois actuel
            if (!empty($request->events) && is_array($request->events)) {
                foreach ($request->events as $eventData) {
                    try {
                        $planning->events()->create([
                            'user_id' => $eventData['user_id'],
                            'userName' => $eventData['userName'],
                            'site_id' => $planning->site_id,
                            'planning_id' => $planning->id,
                            'month' => $planning->month,
                            'year' => $planning->year,
                            'post' => $eventData['post'],
                            'postName' => $eventData['postName'],
                            'typePost' => $eventData['typePost'],
                            'vacation_start' => $eventData['vacation_start'],
                            'vacation_end' => $eventData['vacation_end'],
                            'pause_payment' => $eventData['pause_payment'],
                            'pause_start' => $eventData['pause_start'],
                            'pause_end' => $eventData['pause_end'],
                            'selected_days' => is_array($eventData['selected_days']) ? json_encode($eventData['selected_days']) : $eventData['selected_days'],
                            'lunchAllowance' => $eventData['lunchAllowance'],
                            'work_duration' => $eventData['work_duration'],
                            'night_hours' => $eventData['night_hours'],
                            'sunday_hours' => $eventData['sunday_hours'],
                            'holiday_hours' => $eventData['holiday_hours'],
                            'isSubEvent' => $eventData['isSubEvent'],
                            'relatedEvent' => $eventData['relatedEvent'],
                            'updated_at' => now(),
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Erreur création événement : ' . $e->getMessage());
                    }
                }
            }

            // Traitement des événements du mois suivant
            if (!empty($request->eventsNextMonth) && is_array($request->eventsNextMonth)) {
                $nextMonth = $request->month + 1;
                $nextYear = $request->year;

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
                    try {
                        $nextMonthPlanning->events()->create([
                            'user_id' => $eventData['user_id'],
                            'userName' => $eventData['userName'],
                            'site_id' => $nextMonthPlanning->site_id,
                            'planning_id' => $nextMonthPlanning->id,
                            'month' => $nextMonthPlanning->month,
                            'year' => $nextMonthPlanning->year,
                            'post' => $eventData['post'],
                            'postName' => $eventData['postName'],
                            'typePost' => $eventData['typePost'],
                            'vacation_start' => $eventData['vacation_start'],
                            'vacation_end' => $eventData['vacation_end'],
                            'pause_payment' => $eventData['pause_payment'],
                            'pause_start' => $eventData['pause_start'],
                            'pause_end' => $eventData['pause_end'],
                            'selected_days' => is_array($eventData['selected_days']) ? json_encode($eventData['selected_days']) : $eventData['selected_days'],
                            'lunchAllowance' => $eventData['lunchAllowance'],
                            'work_duration' => $eventData['work_duration'],
                            'night_hours' => $eventData['night_hours'],
                            'sunday_hours' => $eventData['sunday_hours'],
                            'holiday_hours' => $eventData['holiday_hours'],
                            'isSubEvent' => $eventData['isSubEvent'],
                            'relatedEvent' => $eventData['relatedEvent'],
                            'updated_at' => now(),
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Erreur création événement (mois suivant) : ' . $e->getMessage());
                    }
                }
            }

            DB::commit(); // Commit de la transaction
            return redirect()->route('plannings.index')->with('success', 'Planning et événements créés avec succès.');
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback en cas d'erreur
            Log::error('Erreur lors de la transaction : ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Une erreur est survenue : ' . $e->getMessage()]);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {

        $currentDate = now(); // Récupère la date actuelle



        // Récupérer le mois actuel
        $currentMonth = $currentDate->month;

        // Récupérer le mois suivant
        $nextMonth = $currentDate->copy()->addMonth()->month;

        // Vérification pour décembre (facultatif, car Carbon gère déjà le cas)
        if ($currentMonth === 12) {
            $nextMonth = 1; // Le mois suivant décembre est janvier
        }



        // Récupérer les plannings dont la date se trouve entre le début du mois actuel et la fin du mois suivant
        $plannings = Planning::whereBetween('month', [
            $currentMonth,
            $nextMonth
        ])->get();


        // Récupérer les événements associés aux plannings récupérés
        $eventsForSearchGuard = Event::whereIn('planning_id', $plannings->pluck('id'))->get();
        $planningId = $request->planningIds;
        $selectedPlanning = Planning::with('events')->find($planningId);


        if (!$selectedPlanning) {
            return redirect()->route('plannings.index')->with('error', 'Planning not found.');
        }


        return Inertia::render('Planning/Create', [
            'selectedPlanning' => $selectedPlanning,
            'posts' => Post::all(),
            'sites' => Site::with('users')->get(),
            'holidays' => Holiday::pluck('date')->toArray(),
            'users' => User::all(),
            'typePosts' => TypePost::all(),
            'isShow' => true,
            'eventsForSearchGuard' => $eventsForSearchGuard
        ]);
    }

    public function update(Request $request, string $id)
    {
        try {
            // Démarrer une transaction
            DB::beginTransaction();

            // Trouver le planning existant
            $planning = Planning::findOrFail($id);

            // Supprimer les événements existants (optionnel selon votre logique métier)
            $planning->events()->delete();

            // Traitement des événements du mois actuel
            if (!empty($request->events) && is_array($request->events)) {
                foreach ($request->events as $eventData) {
                    $planning->events()->create([
                        'user_id' => $eventData['user_id'],
                        'userName' => $eventData['userName'],
                        'site_id' => $planning->site_id,
                        'planning_id' => $planning->id,
                        'month' => $planning->month,
                        'year' => $planning->year,
                        'post' => $eventData['post'],
                        'postName' => $eventData['postName'],
                        'typePost' => $eventData['typePost'],
                        'vacation_start' => $eventData['vacation_start'],
                        'vacation_end' => $eventData['vacation_end'],
                        'pause_payment' => $eventData['pause_payment'],
                        'pause_start' => $eventData['pause_start'],
                        'pause_end' => $eventData['pause_end'],
                        'selected_days' => is_array($eventData['selected_days']) ? json_encode($eventData['selected_days']) : $eventData['selected_days'],
                        'lunchAllowance' => $eventData['lunchAllowance'],
                        'work_duration' => $eventData['work_duration'],
                        'night_hours' => $eventData['night_hours'],
                        'sunday_hours' => $eventData['sunday_hours'],
                        'holiday_hours' => $eventData['holiday_hours'],
                        'isSubEvent' => $eventData['isSubEvent'],
                        'relatedEvent' => $eventData['relatedEvent'],
                        'updated_at' => \Carbon\Carbon::now(),
                    ]);
                }
            }

            // Gestion des événements du mois suivant
            if (!empty($request->eventsNextMonth) && is_array($request->eventsNextMonth)) {
                $nextMonth = $planning->month + 1;
                $nextYear = $planning->year;

                if ($nextMonth > 12) {
                    $nextMonth = 1;
                    $nextYear += 1;
                }

                // Vérifiez si un planning pour le mois suivant existe déjà
                $nextMonthPlanning = Planning::firstOrCreate([
                    'site_id' => $planning->site_id,
                    'month' => $nextMonth,
                    'year' => $nextYear,
                ], [
                    'isValidate' => false,
                ]);

                // Supprimer les événements existants du mois suivant
                $nextMonthPlanning->events()->delete();

                // Ajouter les nouveaux événements
                foreach ($request->eventsNextMonth as $eventData) {
                    $nextMonthPlanning->events()->create([
                        'user_id' => $eventData['user_id'],
                        'userName' => $eventData['userName'],
                        'site_id' => $nextMonthPlanning->site_id,
                        'planning_id' => $nextMonthPlanning->id,
                        'month' => $nextMonthPlanning->month,
                        'year' => $nextMonthPlanning->year,
                        'post' => $eventData['post'],
                        'postName' => $eventData['postName'],
                        'typePost' => $eventData['typePost'],
                        'vacation_start' => $eventData['vacation_start'],
                        'vacation_end' => $eventData['vacation_end'],
                        'pause_payment' => $eventData['pause_payment'],
                        'pause_start' => $eventData['pause_start'],
                        'pause_end' => $eventData['pause_end'],
                        'selected_days' => is_array($eventData['selected_days']) ? json_encode($eventData['selected_days']) : $eventData['selected_days'],
                        'lunchAllowance' => $eventData['lunchAllowance'],
                        'work_duration' => $eventData['work_duration'],
                        'night_hours' => $eventData['night_hours'],
                        'sunday_hours' => $eventData['sunday_hours'],
                        'holiday_hours' => $eventData['holiday_hours'],
                        'isSubEvent' => $eventData['isSubEvent'],
                        'relatedEvent' => $eventData['relatedEvent'],
                        'updated_at' => \Carbon\Carbon::now(),
                    ]);
                }
            }

            // Finaliser la transaction
            DB::commit();

            return redirect()->route('plannings.index')->with('success', 'Planning and associated events updated successfully.');
        } catch (\Exception $e) {
            // Annuler la transaction en cas d'erreur
            DB::rollBack();
            Log::error('Error updating planning: ' . $e->getMessage());

            return back()->withErrors(['error' => 'Something went wrong: ' . $e->getMessage()]);
        }
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
        // Fetch planning IDs from the request
        $planningIds = $request->planningId;

        // Ensure $planningIds is an array for further processing
        if (!is_array($planningIds)) {
            $planningIds = [$planningIds];
        }

        // Fetch the selected planning with associated events
        $selectedPlanning = Planning::with('events')->whereIn('id', $planningIds)->get();
        $isValidatePlanning = $selectedPlanning[0]->isValidate;


        // Validate if any planning was found
        if ($selectedPlanning->isEmpty()) {
            return back()->withErrors(['error' => 'Invalid planning ID(s)']);
        }

        // Collect all events from the selected plannings
        $events = $selectedPlanning->flatMap->events;

        // Validate if events were found
        if ($events->isEmpty()) {
            return back()->withErrors(['error' => 'No events found for the selected planning.']);
        }

        // Extract unique user IDs, site IDs, and months
        $userIds = $events->pluck('user_id')->unique()->toArray();
        $siteIds = $events->pluck('site_id')->unique()->toArray();
        $months = $events->pluck('month')->unique()->map(fn($month) => (int) $month)->toArray();
        $year = $events->pluck('year')->unique()->first(); // Assume the year is consistent

        // Fetch user emails
        $users = User::whereIn('id', $userIds)->get(['id', 'email']);
        $userEmails = $users->pluck('email')->toArray(); // List of user emails

        // Fetch site details
        $sites = Site::whereIn('id', $siteIds)->get(['id', 'name', 'email', 'manager_name']);
        $siteDetails = $sites->mapWithKeys(function ($site) {
            return [
                $site->id => [
                    'email' => $site->email,
                    'manager_name' => $site->manager_name,
                    'name' => $site->name,
                ],
            ];
        })->toArray();



        // Translate month numbers to month names in French
        Carbon::setLocale('fr'); // Set locale to French
        $monthNames = array_map(function ($month) {
            return Carbon::create()->month($month)->translatedFormat('F');
        }, $months);



        // Update the `isValidate` field for the selected plannings
        Planning::whereIn('id', $planningIds)->update(['isValidate' => true]);


        try {
            Mail::to('ouailamin84@gmail.com')->send(new ManagerPlanningMail($siteDetails, $monthNames, $year, $isValidatePlanning));
            Mail::to('ouailamin84@gmail.com')->send(new GuardPlanningMail($userEmails, $monthNames, $year, $isValidatePlanning));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to send emails: ' . $e->getMessage()]);
        }
        // Return a success response with the result
        return back()->with('success', 'Plannings validés avec succès');
    }
}
