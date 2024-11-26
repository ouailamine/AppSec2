<?php

namespace App\Http\Controllers\Diploma;

use App\Http\Controllers\Controller;
use App\Models\Diploma;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiplomaController extends Controller
{
    // Display a listing of the diplomas.
    public function index()
    {
        $diplomas = Diploma::all();

        return Inertia::render('Diploma/Index', [
            'diplomas' => $diplomas
        ]);
    }

    // Store a newly created diploma in storage.
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|unique:diplomas,name|max:255',
            'validity_months' => 'required|integer|min:1', // Ensure the validity_months field is required and validated
        ]);

        Diploma::create($validatedData);

        return redirect()->route('diplomas.index')->with('success', 'Diploma created successfully.');
    }

    public function update(Request $request, Diploma $diploma)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255|unique:diplomas,name,' . $diploma->id,
            'validity_months' => 'required|integer|min:1', // Ensure the validity_months field is required and validated
        ]);

        $diploma->update($validatedData);

        return redirect()->route('diplomas.index')->with('success', 'Diploma updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Diploma $diploma)
    {
        $diploma->delete();

        return redirect()->route('diplomas.index')->with('flash', ['success' => 'Type Ads deleted successfully!']);
    }
}
