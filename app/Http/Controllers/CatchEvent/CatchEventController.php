<?php

namespace App\Http\Controllers\CatchEvent;

use App\Http\Controllers\Controller;
use App\Models\CatchEvent;
use App\Models\Post;
use App\Models\Site;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatchEventController extends Controller
{
    // Display a listing of catch events
    public function index()
    {
        return Inertia::render('CatchEvents/Index', [
            'catchEvents' => CatchEvent::all(),
            'users' => User::all(),
            'sites' => Site::all(),
            'posts' => Post::all()
        ]);
    }


    // Show the form for creating a new catch event
    public function create() {}

    // Store a newly created catch event in storage
    public function store(Request $request)
    {
        $catchEventData = [
            'user_id' => $request->input('user_id'),
            'site_id' => $request->input('site_id'),
            'post' => $request->input('post'),
            'date_vacation' => $request->input('vacationDate'),
            'hours' => $request->input('hours'),
            'night_hours' => $request->input('nightHours', 0),
            'sunday_hours' => $request->input('sundayHours', 0),
            'holiday_hours' => $request->input('holidayHours', 0),
            'month' => date('n', strtotime($request->input('vacationDate'))),
            'year' => date('Y', strtotime($request->input('vacationDate'))),
            'managerCreate' => auth()->user()->id, // Assuming managerCreate is the authenticated user
            'isRuler' => false
        ];
        // Create a new catch event
        CatchEvent::create($catchEventData);
        return redirect()->route('catchEvents.index')->with('success', 'CatchEvent created successfully');
    }

    // Display the specified catch event
    public function show() {}

    // Show the form for editing the specified catch event
    public function edit() {}

    // Update the specified catch event in storage
    public function update(Request $request, $id)
    {

        $catchEvent = CatchEvent::find($id);

        if (!$catchEvent) {
            return redirect()->route('catch-events.index')->with('error', 'CatchEvent not found');
        }

        // Check if typeUpdate is "validate"
        if ($request->typeUpdate === "validate") {
            // Update specific fields when typeUpdate is "validate"
            $catchEvent->remarks = $request->remarks;
            $catchEvent->managerValidate =  auth()->user()->id; // Assuming remarks is part of the request
            $catchEvent->date_regularization = now(); // Set current date and time
            $catchEvent->isRuler = true;
        } else {
            // Update with all provided data otherwise
            $catchEvent->update([
                'user_id' => $request->user_id,
                'site_id' => $request->site_id,
                'post' => $request->post,
                'date_vacation' => $request->vacationDate,
                'hours' => $request->hours,
                'nightHours' => $request->nightHours,
                'sundayHours' => $request->sundayHours,
                'holidayHours' => $request->holidayHours,
                'date_regularization' => $request->date_regularization,
                'managerValidate' => $request->managerValidate,
                'isBilled' => $request->isBilled ? 1 : 0, // Convert boolean to integer
            ]);
        }

        // Save the catch event with the updated data
        $catchEvent->save();

        return redirect()->route('catchEvents.index')->with('success', 'CatchEvent mis a jour avec successfully');
    }


    // Remove the specified catch event from storage
    public function destroy($id)
    {
        $catchEvent = CatchEvent::find($id);

        if (!$catchEvent) {
            return redirect()->route('catch-events.index')->with('error', 'CatchEvent not found');
        }

        $catchEvent->delete();
        return redirect()->route('catch-events.index')->with('success', 'CatchEvent deleted successfully');
    }
}
