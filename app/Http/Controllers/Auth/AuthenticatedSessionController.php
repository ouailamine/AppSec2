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
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

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
     * Gère une requête d'authentification entrante.
     */
    public function store(LoginRequest $request): RedirectResponse
    {



        if ($request->actor == 'customer') {
            // Récupérer les informations d'identification (email et mot de passe)
            $credentials = $request->only('email', 'password');

            // Tenter l'authentification avec le guard 'customer'
            if (Auth::guard('customer')->attempt($credentials)) {
                // Si l'authentification est réussie, régénérer la session
                $request->session()->regenerate();

                // Récupérer le customer authentifié
                $customer = Auth::guard('customer')->user();
                // Rediriger vers le tableau de bord du customer
                return redirect()->route('dashboardCustomer');
            }

            // Si l'authentification échoue, retourner un message d'erreur
            return back()->withErrors([
                'email' => 'The provided credentials do not matccccch our records.',
            ]);
        } elseif ($request->actor == 'Admin') {
            sleep(5);
            $request->authenticate();
            $request->session()->regenerate();

            // Rediriger vers le tableau de bord du customer
            return redirect()->route('dashboardAdmin');
        } else {

            $request->authenticate();
            $request->session()->regenerate();

            $user = Auth::user();

            if ($user) {
                // Vérifiez si l'utilisateur a la méthode `getRoleNames()` et `getAllPermissions()`
                $roles = $user->getRoleNames(); // Récupérer les rôles


                // Récupérer les comptes
                $filteredUsersCount = $this->getFilteredUsersCount();
                $filteredVacationsCount = $this->getFilteredVacationsCount(); // Appel de la méthode pour les vacances


                // Rediriger selon le rôle
                return $this->redirigerSelonRole($roles, $filteredUsersCount, $filteredVacationsCount);
            }

            return back()->withErrors([
                'email' => 'The provided credentials do not maxxxxtch our records.',
            ]);
        }
    }



    /**
     * Redirige les utilisateurs en fonction de leur rôle.
     */
    protected function redirigerSelonRole($roles, $filteredUsersCount, $filteredVacationsCount): RedirectResponse
    {
        try {

            sleep(5);

            // Détermination de la route de redirection en fonction du rôle de l'utilisateur
            $route = match ($roles[0]) {
                'Admin' => route('dashboardAdmin', [
                    'filteredUsersCount' => $filteredUsersCount,
                    'filteredVacationsCount' => $filteredVacationsCount,

                ]),
                'Leader', 'Manager' => route('dashboardAdmin', [
                    'filteredUsersCount' => $filteredUsersCount,
                    'filteredVacationsCount' => $filteredVacationsCount,

                ]),
                'LeaderTeam' => route('dashboardAdmin', [
                    'filteredUsersCount' => $filteredUsersCount,
                    'filteredVacationsCount' => $filteredVacationsCount,

                ]),
            };


            return redirect()->intended($route);
        } catch (\Exception $e) {
            // Gestion des erreurs
            Log::error('Erreur lors de la redirection:', [
                'message' => $e->getMessage(),
                'exception' => $e
            ]);
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
