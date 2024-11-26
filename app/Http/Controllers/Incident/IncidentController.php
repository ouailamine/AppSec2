<?php

namespace App\Http\Controllers\Incident;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
    public function index()
    {
        return Inertia::render('Incident/Index', [
            'incidents' => Incident::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Incident/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'site' => 'required|string|max:255',
            'guard' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Incident::create($validated);

        return redirect()->route('incidents.index')->with('success', 'Incident created successfully.');
    }

    public function show(Incident $incident)
    {
        return Inertia::render('Incident/Show', [
            'incident' => $incident,
        ]);
    }

    public function edit(Incident $incident)
    {
        return Inertia::render('Incident/Edit', [
            'incident' => $incident,
        ]);
    }

    public function update(Request $request, Incident $incident)
    {
        $validated = $request->validate([
            'site' => 'required|string|max:255',
            'guard' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $incident->update($validated);

        return redirect()->route('incidents.index')->with('success', 'Incident updated successfully.');
    }

    public function destroy(Incident $incident)
    {
        $incident->delete();

        return redirect()->route('incidents.index')->with('success', 'Incident deleted successfully.');
    }
}
