<?php

namespace App\Http\Controllers\ProCard;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Carbon\Carbon; //
use App\Models\User;
use Inertia\Inertia;


class ProCardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Récupérer tous les utilisateurs
        $users = User::all();
    
        // La date actuelle
        $now = Carbon::now();
        $sixMonthsFromNow = $now->copy()->addMonths(6);
    
        // Regrouper les utilisateurs par nom complet et filtrer les diplômes
        $groupedUsers = $users->reduce(function ($acc, $user) use ($now, $sixMonthsFromNow) {
            // Décoder les diplômes depuis JSON avec gestion des erreurs
            $diplomas = json_decode($user->diplomas, true);
    
            // Assurer que les diplômes sont bien décodés en tableau
            if (is_array($diplomas)) {
                // Filtrer les diplômes qui se terminent dans moins de 6 mois
                $validDiplomas = collect($diplomas)->filter(function ($diploma) use ($now, $sixMonthsFromNow) {
                    return isset($diploma['end_date']) && Carbon::parse($diploma['end_date'])->between($now, $sixMonthsFromNow);
                });
    
                // Si l'utilisateur a des diplômes valides
                if ($validDiplomas->isNotEmpty()) {
                    $key = "{$user->fullname} ({$user->firstname})";
    
                    // Créer une entrée pour l'utilisateur s'il n'existe pas déjà
                    if (!isset($acc[$key])) {
                        $acc[$key] = [
                            'fullname' => $user->fullname,
                            'firstname' => $user->firstname,
                            'diplomas' => []
                        ];
                    }
    
                    // Ajouter les diplômes valides à l'entrée de l'utilisateur
                    foreach ($validDiplomas as $diploma) {
                        $acc[$key]['diplomas'][] = [
                            'name' => $diploma['name'],
                            'end_date' => $diploma['end_date']
                        ];
                    }
                }
            }
    
            return $acc;
        }, []);
    
        // Convertir le tableau regroupé en collection pour Inertia
        $filteredUsers = collect($groupedUsers)->values();
    
        // Compter le nombre d'utilisateurs filtrés
        $filteredUsersCount = $filteredUsers->count();
    
        // Retourner la vue avec les diplômes filtrés et le nombre d'utilisateurs
        return Inertia::render('ProCard/Index', [
            'filteredUsers' => $filteredUsers,
            'filteredUsersCount' => $filteredUsersCount
        ]);
    }
    

    public function create(Request $request)
{
    $userId = $request->query('user_id'); // Obtenir l'ID utilisateur de la requête

    // Obtenez les détails de l'utilisateur si un ID est fourni
    $user = $userId ? User::find($userId) : null;

    // Passez les données nécessaires à votre vue
    return Inertia::render('ProCard/Create', [
        'user' => $user,
        'users' => User::all(),
        'selectedUserId' => $userId,
    ]);
}

}
