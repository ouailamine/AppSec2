<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $roles = [];
        $permissions = [];

        // Vérification si l'utilisateur est authentifié
        if ($user) {
            // Vérifiez si l'utilisateur a la méthode `getRoleNames()`, ce qui signifie qu'il a des rôles
            if (method_exists($user, 'getRoleNames')) {
                $roles = $user->getRoleNames(); // Récupérer les rôles
            }

            // Vérifiez si l'utilisateur a la méthode `getAllPermissions()`, ce qui signifie qu'il a des permissions
            if (method_exists($user, 'getAllPermissions')) {
                $permissions = $user->getAllPermissions()->pluck('name'); // Récupérer les permissions
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? $user->toArray() : null,
                'roles' => $roles,
                'permissions' => $permissions,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'info' => session('info'),

            ],
        ];
    }
}
