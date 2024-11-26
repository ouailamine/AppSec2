<?php

namespace App\Http\Controllers\Guard;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Departement;
use App\Models\Diploma;
use App\Models\TypeAds;
use App\Models\Region;
use App\Models\Genre;
use App\Models\Guard;
use App\Models\Nationality;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use DateTime;
use Carbon\Carbon;

class GuardController extends Controller
{

    public function index()
    {
        return Inertia::render('SearchGuard/Index', [

            'guards' => guard::all(),
            'roles' => Role::pluck('name'),
            'departements' => DB::table('departements')->get(),
            'regions' => DB::table('regions')->get(),
            'diplomas' => DB::table('diplomas')->get(),
            'genres' => DB::table('genres')->get(),
            'adsType' => DB::table('type_ads')->get(),
            'roles' => Role::pluck('name'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $guard = Guard::findOrFail($id);
        $diplomasGuard = json_decode($guard->diplomas);
        return Inertia::render('SearchGuard/Show', [
            'guard' => $guard,
            'diplomasGuard' => $diplomasGuard,
            'departements' => DB::table('departements')->get(),
            'regions' => DB::table('regions')->get()
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function edit(string $id)
    {
        $guard = Guard::findOrFail($id);
        $diplomas = Diploma::all();
        $diplomasGuard = json_decode($guard->diplomas, true) ?? [];

        return Inertia::render('SearchGuard/Edit', [
            'genres' => Genre::all(),
            'nationalities' => Nationality::all(),
            'typeAds' => TypeAds::all(),
            'diplomas' => $diplomas,
            'departements' => Departement::all(),
            'regions' => Region::all(),
            'cities' => City::all(),
            'guard' => $guard,
            'diplomasGuard' => $diplomasGuard,
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function update(Request $request, string $id)
    {
        $guard = Guard::findOrFail($id);
        $guard->update($request->all());
        return redirect()->route('guard.index')->with('success', 'Utilisateur mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        dd($id);
        $guard = Guard::findOrFail($id);
        dd('$guard');
        $guard->delete();
        return redirect()->route('guards.index')->with('success', 'Utilisateur supprimé avec succès');
    }
}
