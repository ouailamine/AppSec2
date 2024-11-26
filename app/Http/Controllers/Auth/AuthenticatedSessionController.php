<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use App\Models\User; // Importer le modèle User
use App\Models\CatchEvent; // Importer le modèle CatchEvent
use Carbon\Carbon;   // Importer Carbon pour la gestion des dates

class AuthenticatedSessionController extends Controller
{
    /**
     * Affiche la vue de connexion.
     */
    public function create(): Response
    {
        $roles = Auth::check() ? Auth::user()->roles->pluck('name') : [];

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'roles' => $roles,
        ]);
    }

    /**
     * Gère une requête d'authentification entrante.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        // Récupérer les comptes
        $filteredUsersCount = $this->getFilteredUsersCount();
        $filteredVacationsCount = $this->getFilteredVacationsCount(); // Appel de la méthode pour les vacances

        // Log des comptes pour le débogage
        Log::info('Filtered Users Count:', ['count' => $filteredUsersCount]);
        Log::info('Filtered Vacations Count:', ['count' => $filteredVacationsCount]);

        // Rediriger selon le rôle
        return $this->redirigerSelonRole($user, $filteredUsersCount, $filteredVacationsCount);
    }

    /**
     * Calcule le nombre d'utilisateurs ayant des diplômes se terminant dans moins de 6 mois.
     */
    public function getFilteredUsersCount(): int
    {
        // Récupérer tous les utilisateurs
        $users = User::all();

        // La date actuelle
        $now = Carbon::now();
        $sixMonthsFromNow = $now->copy()->addMonths(6);

        // Filtrer les utilisateurs par diplômes valides
        return $users->filter(function ($user) use ($now, $sixMonthsFromNow) {
            $diplomas = json_decode($user->diplomas, true);
            if (is_array($diplomas)) {
                return collect($diplomas)->contains(function ($diploma) use ($now, $sixMonthsFromNow) {
                    return isset($diploma['end_date']) && Carbon::parse($diploma['end_date'])->between($now, $sixMonthsFromNow);
                });
            }
            return false;
        })->count();
    }

    /**
     * Compte les catchEvents où isRuler = false.
     */
    public function getFilteredVacationsCount(): int
    {
        // Compter les catchEvents où isRuler = false
        $vacationsCount = CatchEvent::where('isRuler', false)->count();

        // Log pour le débogage
        Log::info('Filtered Vacations Count:', ['count' => $vacationsCount]);

        return $vacationsCount;
    }

    /**
     * Redirige les utilisateurs en fonction de leur rôle.
     */
    protected function redirigerSelonRole($user, $filteredUsersCount, $filteredVacationsCount): RedirectResponse
    {
        try {
            $user->load('roles');
            Log::info('Roles de l\'utilisateur:', ['roles' => $user->roles->pluck('name')]);

            // Détermination de la route de redirection en fonction du rôle de l'utilisateur
            $route = match (true) {
                $user->hasRole('Admin') => route('dashboardAdmin', [
                    'filteredUsersCount' => $filteredUsersCount,
                    'filteredVacationsCount' => $filteredVacationsCount
                ]),
                $user->hasAnyRole(['Leader', 'Manager']) => route('dashboardLeader', ['filteredUsersCount' => $filteredUsersCount, 'filteredVacationsCount' => $filteredVacationsCount]),
                $user->hasAnyRole(['Employee', 'LeaderTeam']) => route('dashboard', ['filteredUsersCount' => $filteredUsersCount, 'filteredVacationsCount' => $filteredVacationsCount]),
                default => route('dashboard', ['filteredUsersCount' => $filteredUsersCount, 'filteredVacationsCount' => $filteredVacationsCount]),
            };

            return redirect()->intended($route);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la redirection:', ['message' => $e->getMessage(), 'exception' => $e]);
            return redirect()->route('login');
        }
    }

    /**
     * Détruit une session authentifiée.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
