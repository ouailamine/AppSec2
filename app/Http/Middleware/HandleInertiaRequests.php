<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

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

        // Si le customer n'a pas de rôle, il n'est pas nécessaire de tenter de charger les rôles.
        // On peut définir simplement un tableau vide ou d'autres informations liées à l'utilisateur.
        $roles = [];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? $user->toArray() : null,
                'roles' => $roles,  // Aucun rôle ici, ou remplacez par autre information pertinente
            ],
        ];
    }
}
