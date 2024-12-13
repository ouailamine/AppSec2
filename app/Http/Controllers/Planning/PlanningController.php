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
        // Vérifier que les événements sont valides
        if (empty($request->events) || !is_array($request->events)) {
            return redirect()->back()->withErrors(['error' => 'No events provided for the planning.']);
        }

        // Étape 1 : Début de la transaction
        DB::beginTransaction();

        try {
            // Étape 2 : Préparation des événements pour le mois courant
            $currentMonthEvents = [];
            foreach ($request->events as $eventData) {
                $currentMonthEvents[] = [
                    'id' => $eventData['id'],
                    'user_id' => $eventData['user_id'],
                    'userName' => $eventData['userName'],
                    'site_id' => $request->site,
                    'month' => $request->month,
                    'year' => $request->year,
                    'typePost' => $eventData['typePost'],
                    'post' => $eventData['post'],
                    'postName' => $eventData['postName'],
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
                    'isSubEvent' => $eventData['isSubEvent'],
                    'relatedEvent' => $eventData['relatedEvent'],
                ];
            }

            // Étape 3 : Vérification des données des événements préparés


            // Valider les données des événements (optionnel, en fonction des besoins)
            if (empty($currentMonthEvents)) {
                throw new \Exception('No valid events provided for the current month.');
            }

            // Étape 4 : Création du planning principal
            $planning = Planning::create([
                'site_id' => $request->site,
                'month' => $request->month,
                'year' => $request->year,
                'isValidate' => false,
            ]);

            // Vérification du planning créé


            // Étape 5 : Ajout des événements au planning
            $planning->events()->createMany($currentMonthEvents);

            // Vérification des événements associés au planning


            // Étape 6 : Gestion des événements pour le mois suivant (si fournis)
            if (!empty($request->eventsNextMonth) && is_array($request->eventsNextMonth)) {
                $nextMonth = $request->month + 1;
                $nextYear = $request->year;

                if ($nextMonth > 12) {
                    $nextMonth = 1;
                    $nextYear += 1;
                }

                $nextMonthEvents = [];
                foreach ($request->eventsNextMonth as $eventData) {
                    $nextMonthEvents[] = [
                        'id' => $eventData['id'],
                        'user_id' => $eventData['user_id'],
                        'userName' => $eventData['userName'],
                        'site_id' => $request->site,
                        'month' => $nextMonth,
                        'year' => $nextYear,
                        'typePost' => $eventData['typePost'],
                        'post' => $eventData['post'],
                        'postName' => $eventData['postName'],
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
                        'isSubEvent' => $eventData['isSubEvent'],
                        'relatedEvent' => $eventData['relatedEvent'],
                    ];
                }

                if (!empty($nextMonthEvents)) {
                    $nextMonthPlanning = Planning::create([
                        'site_id' => $request->site,
                        'month' => $nextMonth,
                        'year' => $nextYear,
                        'isValidate' => false,
                    ]);

                    $nextMonthPlanning->events()->createMany($nextMonthEvents);

                    // Vérification des événements du mois suivant
                    dd('Étape 6: Événements mois suivant', $nextMonthPlanning->events);
                }
            }

            // Étape 7 : Confirmation de la transaction
            DB::commit();
            return redirect()->route('plannings.index')->with('success', 'Planning created successfully with associated events.');
        } catch (\Exception $e) {
            // Étape 8 : Gestion des erreurs
            DB::rollBack();
            dd('Erreur rencontrée', $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'An error occurred while creating the planning: ' . $e->getMessage()]);
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
