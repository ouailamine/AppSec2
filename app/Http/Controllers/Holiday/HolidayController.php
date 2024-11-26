<?php

namespace App\Http\Controllers\Holiday;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function index()
    {
        $holidays = Holiday::all();
        return inertia('Holidays/Index', ['holidays' => $holidays]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        Holiday::create($request->only('name', 'date'));

        return redirect()->back()->with('success', 'Holiday added successfully.');
    }

    public function update(Request $request, Holiday $holiday)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $holiday->update($request->only('name', 'date'));

        return redirect()->back()->with('success', 'Holiday updated successfully.');
    }

    public function destroy(Holiday $holiday)
    {

        $holiday->delete();

        return redirect()->back()->with('success', 'Holiday deleted successfully.');
    }
}
