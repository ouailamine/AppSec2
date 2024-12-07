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
        return Inertia::render('Planning/Create', [
            'posts' => Post::all(),
            'sites' => Site::with('users')->get(),
            'holidays' => Holiday::pluck('date')->toArray(),
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
        // Vérifier que les événements sont valides
        if (empty($request->events) || !is_array($request->events)) {
            return redirect()->back()->withErrors(['error' => 'No events provided for the planning.']);
        }

        DB::beginTransaction(); // Démarrer une transaction

        try {
            // Créer le planning principal
            $planning = Planning::create([
                'site_id' => $request->site,
                'month' => $request->month,
                'year' => $request->year,
                'isValidate' => false,
            ]);

            // Ajouter les événements pour le mois courant
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
                    'isSubEvent' => $eventData['isSubEvent'],
                    'relatedEvent' => $eventData['relatedEvent'],
                ]);
            }

            // Ajouter les événements pour le mois suivant, si fournis
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
                        'isSubEvent' => $eventData['isSubEvent'],
                        'relatedEvent' => $eventData['relatedEvent'],
                    ]);
                }
            }

            DB::commit(); // Confirmer la transaction si tout est réussi

            return redirect()->route('plannings.index')->with('success', 'Planning created successfully with associated events.');
        } catch (\Exception $e) {
            DB::rollBack(); // Annuler toutes les opérations en cas d'erreur
            return redirect()->back()->withErrors(['error' => 'An error occurred while creating the planning: ' . $e->getMessage()]);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
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
            'isShow' => true
        ]);
    }


    public function edit(string $id) {}

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
