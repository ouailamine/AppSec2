<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $rolesWithPermissions = DB::table('roles')
            ->join('role_has_permissions', 'roles.id', '=', 'role_has_permissions.role_id')
            ->join('permissions', 'permissions.id', '=', 'role_has_permissions.permission_id')
            ->select('roles.id as role_id', 'roles.name as role_name', 'permissions.id as permission_id', 'permissions.name as permission_name')
            ->get();

        // Structurer les données par rôle
        $roles = [];
        foreach ($rolesWithPermissions as $item) {
            $roles[$item->role_id]['id'] = $item->role_id;
            $roles[$item->role_id]['name'] = $item->role_name;
            $roles[$item->role_id]['permissions'][] = [
                'id' => $item->permission_id,
                'name' => $item->permission_name
            ];
        }

        return Inertia::render('Role/Index', [
            'roles' => $roles,
            'permissions' => Permission::all(),
            'flash' => session()->all() // Passer toutes les données de session, y compris les messages flash
        ]);
    }

    public function create() {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions']);

        return redirect()->route('roles.index')
            ->with('success', 'Le rôle a été ajouté avec succès.');
    }

    public function show(Role $role)
    {
        $rolePermissions = $role->permissions()->pluck('name');

        return Inertia::render('Role/Show', [
            'role' => $role,
            'rolePermissions' => $rolePermissions
        ]);
    }

    public function edit(Role $role)
    {
        $user = auth()->user(); // Récupérer l'utilisateur actuellement authentifié

        // Vérifier si l'utilisateur est un admin
        if ($role->name === 'Admin' && !$user->hasRole('Admin')) {
            return redirect()->route('roles.index')->with('error', 'Vous n\'avez pas la permission de modifier le rôle Admin.');
        }

        $rolePermissions = $role->permissions()->pluck('id')->all();

        return Inertia::render('Role/Edit', [
            'role' => $role,
            'permissions' => Permission::all(),
            'rolePermissions' => $rolePermissions
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $user = auth()->user();


        if ($role->name == 'Admin' && !$user->hasRole('Admin')) {
            return redirect()->route('roles.index')->with('error', 'Vous n\'avez pas la permission de modifier le rôle Admin.');
        }
        $role->update(['name' => $request['name']]);
        $role->syncPermissions($request['permissions']);

        return redirect()->route('roles.index')
            ->with('success', 'Le rôle a été mis à jour avec succès.');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'Admin') {
            abort(403, 'LE RÔLE ADMIN NE PEUT PAS ÊTRE SUPPRIMÉ');
        }

        if (auth()->user()->hasRole($role->name)) {
            abort(403, 'IL EST INTERDIT DE SUPPRIMER SON PROPRE RÔLE');
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Le rôle a été supprimé avec succès.');
    }
}
