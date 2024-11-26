<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\TypeAds;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexTypeAds()
    {
        return Inertia::render('TypeAds/Index', ['typeAds' => TypeAds::all()]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function storeTypeAds(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:type_ads,name',
        ]);

        if ($validator->fails()) {
            return redirect()->route('typeAds.index')
                ->withErrors($validator)
                ->withInput();
        }

        // Create a new TypeAd
        TypeAds::create([
            'name' => $request->input('name'),
        ]);

        // Redirect with a success message
        return redirect()->route('typeAds.index')->with('success', 'Type Ad created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function showTypeAgent(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function editTypeAgent(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateTypeAgent(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyTypeAds(string $id)
    {

        $typeAds = TypeAds::findOrFail($id); // Trouver le TypeAd par ID ou échouer

        $typeAds->delete(); // Supprimer le TypeAd

        return redirect()->route('typeAds.index')->with('success', 'Type Ad deleted successfully.'); // Rediriger avec message de succès

    }


    /**
     * Display a listing of the resource.
     */
    public function indexDiplome()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function createDiplome()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeDiplome(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function showDiplome(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function editDiplome(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateDiplome(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyDiplome(string $id)
    {
        //
    }


    /**
     * Display a listing of the resource.
     */
    public function indexPermission()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function createPermission()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storePermission(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function showPermission(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function editPermission(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updatePermission(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyPermission(string $id)
    {
        //
    }
}
