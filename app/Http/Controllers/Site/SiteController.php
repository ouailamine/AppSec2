<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Site;
use App\Models\User;
use Inertia\Inertia;

class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Charger les sites avec leurs gardes associés
        $sites = Site::with('users')->get();

        // Si vous avez besoin de la liste complète des users, récupérez-la aussi
        $users = User::all();

        return inertia('Sites/Index', [
            'sites' => $sites,
            'users' => $users,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Affiche le formulaire pour ajouter ou mettre à jour les users d'un site.
     *
     * @param int $siteId
     * @return \Inertia\Response
     */
    public function editUsers($siteId, $request)
    {
        dd($request);
        $site = Site::with('users')->findOrFail($siteId);
        $users = User::all();

        return Inertia::render('Sites/EditUsers', [
            'site' => $site,
            'users' => $users
        ]);
    }

    /**
     * Update the users for a specific site.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $siteId
     * @return \Inertia\Response
     */
    public function updateUsers(Request $request, $siteId)
    {

        $request->validate([
            'users' => 'array',
            'users.*' => 'exists:users,id'
        ]);

        $site = Site::findOrFail($siteId);
        $site->users()->sync($request->input('users')); // Met à jour la table pivot avec les users sélectionnés

        // Redirige vers la liste des sites avec un message de succès
        return redirect()->back()->with('success', 'Holiday added successfully.');
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return Inertia::render('Sites/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'manager_name' => 'required|string',
            'address' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',

        ]);

        // Handle the creation of the site and assignment of users here
        // Assuming you have a Site model and a relationship setup

        $site = Site::create($request->only('name', 'manager_name', 'address', 'email', 'phone'));
        $site->users()->sync($request->selectedUsers); // Attach Users to site

        return redirect()->route('sites.index')->with('success', 'Site created successfully.');
    }

    public function edit(Site $site)
    {
        return Inertia::render('Sites/Edit', ['site' => $site]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Site $site)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'manager_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $site->update($request->all());

        return redirect()->route('sites.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Site $site)
    {

        $site->delete();
        // Redirect back to the sites index with a flash message
        return redirect()->route('sites.index')->with('success', 'Site supprimé avec succès.');
    }
}
