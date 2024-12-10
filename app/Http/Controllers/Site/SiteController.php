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
   
        $sites = Site::with(['users'])->get();
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
        // Trouver le site par son ID
        $site = Site::findOrFail($siteId);
    
        // Récupérer les utilisateurs principaux et secondaires depuis la requête
        $primaryUsers = $request->input('primaryUsers', []); // Utilisateurs principaux
        $secondaryUsers = $request->input('secondaryUsers', []); // Utilisateurs secondaires
    
        // Fusionner les utilisateurs principaux et secondaires
        $allUsers = collect($primaryUsers)->merge($secondaryUsers)->unique();
    
        // Préparer les données pour la synchronisation avec attribut `isFirstList`
        $syncData = [];
        foreach ($allUsers as $userId) {
            $syncData[$userId] = ['isFirstList' => in_array($userId, $primaryUsers)];
        }
    
        // Synchroniser les utilisateurs avec la table pivot
        $site->users()->sync($syncData);
    
        // Retourner avec un message de succès
        return redirect()->back()->with('success', 'Liste d\'agents modifiée.');
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

        $site = Site::create($request->only('name', 'manager_name', 'address', 'email', 'phone'));
        $site->users()->sync($request->selectedUsers); // Attach Users to site

        return redirect()->route('sites.index')->with('success', 'Site created successfully.');
    }

    public function edit(Site $site)
    {
        return Inertia::render('Sites/Edit', ['site' => $site]);
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
