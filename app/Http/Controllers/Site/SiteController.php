<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\Site;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sites = Site::with(['users'])->get();
        $users = User::all();
        $customers =Customer::all();

        return inertia('Sites/Index', [
            'sites' => $sites,
            'users' => $users,
            'customers'=>$customers,
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
        $custumers = Customer::all();

        return Inertia::render('Sites/EditUsers', [
            'site' => $site,
            'users' => $users,
            'custumers' =>$custumers
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
        
        'name' => 'required|string|max:255',
        'manager_name' => 'required|string|max:255',
        'address' => 'required|string|max:500',
        'email' => 'required|email|unique:sites,email',
        'phone' => 'required|string|max:20',
        // No need to validate the password as it's being set automatically.
    ]);

    // Hash the default password.
    $defaultPassword = Hash::make('atalixsecurite');

    // Create the site with the validated data and default password.
    $site = Site::create([
        'customer_id'=>$request->customer_id,
        'name' => $request->name,
        'manager_name' => $request->manager_name,
        'address' => $request->address,
        'email' => $request->email,
        'phone' => $request->phone,
        'password' => $defaultPassword,
    ]);

    // Sync users if selectedUsers exists in the request.
    if ($request->has('selectedUsers') && is_array($request->selectedUsers)) {
        $site->users()->sync($request->selectedUsers);
    }

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

