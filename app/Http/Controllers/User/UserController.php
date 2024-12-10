<?php

namespace App\Http\Controllers\User;

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
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use DateTime;
use Carbon\Carbon;




class UserController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function index()
    {
        return Inertia::render('SearchEmployee/Home', [
            'departements' => Departement::all(),
            'regions' => Region::all(),
            'diplomas' => Diploma::all(),
            'genres' => Genre::all(),
            'adsType' => TypeAds::all(),
            'roles' => Role::pluck('name'),
            'users' => User::all(),
            'nationalities' => Nationality::all(),
            'typeAds' => TypeAds::all(),
            'cities' => City::all(),
            'guards'=> Guard::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SearchEmployee/Create', [
            'roles' => Role::all(),
            'genres' => Genre::all(),
            'nationalities' => Nationality::all(),
            'typeAds' => TypeAds::all(),
            'diplomas' => Diploma::all(),
            'departements' => Departement::all(),
            'regions' => Region::all(),
            'cities' => City::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id)
    {
        $part = explode("-", $request->professional_card_number);
        $StringADSendDate = $part[1] . "-" . $part[2] . "-" . $part[3];
        $ADSendDate = DateTime::createFromFormat('Y-m-d', $StringADSendDate);



        // Récupération des diplômes depuis la base de données
        $diplomas = DB::table('diplomas')->get(); // Cela vous donne une collection d'objets

        // Récupération des données du formulaire
        $formData = $request->input('diplomas'); // Assurez-vous que 'diplomas' correspond au nom de votre champ dans le formulaire

        // Préparer une liste pour stocker les diplômes avec leurs dates de fin
        $processedDiplomas = [];

        foreach ($formData as $diploma) {
            $diplomaName = $diploma['name']; // Nom du diplôme
            $obtentionDate = Carbon::parse($diploma['start_date']); // Date d'obtention

            // Recherche de la durée de validité en mois pour le diplôme
            $diplomaObj = $diplomas->firstWhere('name', $diplomaName);

            if ($diplomaObj) {
                $validityMonths = $diplomaObj->validity_months; // Accès avec -> pour les objets

                $endDate = $obtentionDate->copy()->addMonths($validityMonths); // Calcul de la date de fin

                // Ajouter le diplôme avec sa date de fin à la liste des diplômes traités
                $processedDiplomas[] = [
                    'name' => $diplomaName,
                    'start_date' => $obtentionDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d'), // Formater la date si nécessaire
                ];
            } else {
                // Gestion des cas où le diplôme n'est pas trouvé dans la collection
                $processedDiplomas[] = [
                    'name' => $diplomaName,
                    'start_date' => $obtentionDate->format('Y-m-d'),
                    'end_date' => null,
                ];
            }
        }

        // Vous pouvez maintenant utiliser la liste $processedDiplomas selon vos besoins

        // Create the user
        $user = User::create([
            'fullname' => $request->input('fullname'),
            'firstname' => $request->input('firstname'),
            'genre' => $request->input('genre'),
            'nationality' => $request->input('nationality'),
            'date_of_birth' => $request->input('dateofbirth'),
            'address' => $request->input('address'),
            'city' => $request->input('city'),
            'region' => $request->input('region'),
            'departement' => $request->input('departement'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'social_security_number' => $request->input('social_security_number'),
            'professional_card_number' => $request->input('professional_card_number'),
            'password' => Hash::make('atalixsecurite'), // Change this as needed
            'registerNumber' => User::max('registerNumber') + 1,
            'typeAds' => $request->typeAds,
            'note' => 10,
        ]);



        $user->assignRole($request->role);

        event(new Registered($user));

        $guard = Guard::create([

            'fullname' => $request->fullname,
            'firstname' => $request->firstname,
            'genre' => $request->genre,
            'date_of_birth' => $request->dateofbirth,
            'nationality' => $request->nationality,
            'address' => $request->address,
            'city' => $request->city,
            'region' => $request->region,
            'departement' => $request->region,
            'email' => $request->email,
            'phone' => $request->phone,
            'social_security_number' => $request->social_security_number,
            'professional_card_number' => $request->professional_card_number,
            'typeADS' => $request->typeAds,
            'diplomas' => json_encode($diplomas),

        ]);


        event(new Registered($guard));


        // Return a response or redirect
        return redirect()->route('users.index')->with('success', 'User created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        $user = User::findOrFail($id);
        $diplomasUser = json_decode($user->diplomas);
        $roles = $user->roles->pluck('name');


        return Inertia::render('SearchEmployee/Show', [
            'user' => $user,
            'roles' => $roles,
            'diplomasUser' => $diplomasUser,
            'departements' => DB::table('departements')->get(),
            'regions' => DB::table('regions')->get()
        ]);
    }

    public function edit(string $id)
    {
        $user = User::findOrFail($id);
        $cities = City::all();
        $departments = Departement::all();
        $regions = Region::all();
        $typeADS = TypeAds::all();
        $diplomas = DB::table('diplomas')->get();
        $diplomasUser = json_decode($user->diplomas, true) ?? [];
        $filteredDiplomasUser = array_filter($diplomasUser, function ($diploma) {
            return $diploma['has_diploma'] ?? false;
        });

        return Inertia::render('SearchEmployee/Edit', [
            'user' => $user,
            'cities' => $cities,
            'departments' => $departments,
            'regions' => $regions,
            'typeADS' => $typeADS,
            'diplomas' => $diplomas,
            'diplomasUser' => $filteredDiplomasUser
        ]);
    }

    public function update(Request $request, string $id)
    {

        $user = User::findOrFail($id);
        $user->update($request->all());
        return redirect()->route('user.index')->with('success', 'Utilisateur mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        $guard = Guard::create([

            'fullname' => $user->fullname,
            'firstname' => $user->firstname,
            'genre' => $user->genre,
            'date_of_birth' => $user->date_of_birth,
            'nationality' => $user->nationality,
            'address' => $user->address,
            'city' => $user->city,
            'region' => $user->region,
            'departement' => $user->region,
            'email' => $user->email,
            'phone' => $user->phone,
            'social_security_number' => $user->social_security_number,
            'professional_card_number' => $user->professional_card_number,
            'typeADS' => $user->typeADS,
            'diplomas' => $user->diplomas

        ]);


        event(new Registered($guard));

        
        return redirect()->back();
    }


    /**
     * Remove the specified resource from storage.
     */
    public function createUser(User $user)
    {

       
        try {

            // Créer l'utilisateur
            $user = User::create([
                'fullname' => $user->fullname,
                'firstname' => $user->firstname,
                'genre' => $user->genre,
                'nationality' => $user->nationality,
                'date_of_birth' => $user->date_of_birth,
                'address' => $user->address,
                'city' => $user->city,
                'region' => $user->region,
                'departement' => $user->departement,
                'email' => $user->email,
                'phone' => $user->phone,
                'social_security_number' => $user->social_security_number,
                'professional_card_number' => $user->professional_card_number,
                'password' => Hash::make('atalixsecurite'),
                'registerNumber' => User::max('registerNumber') + 1,
                'typeAds' => $user->typeAds,
                'note' => 10,
                'diplomas' => $user->diplomas,
            ]);

            // Assigner le rôle
            $user->assignRole('Employee');

            // Déclencher l'événement
            event(new Registered($user));

            $user->delete();

            // Rediriger avec succès
            return redirect()->route('SearchEmployee.index')->with('success', 'User created successfully');
        } catch (\Exception $e) {
            // Gérer les erreurs
            return redirect()->back()->with('error', 'Erreur lors de la création du compte');
        }
    }
}
