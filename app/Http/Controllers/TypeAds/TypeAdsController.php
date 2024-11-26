<?php

namespace App\Http\Controllers\TypeAds;

use App\Http\Controllers\Controller;
use App\Models\TypeAds;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TypeAdsController extends Controller
{
    /**
     * Afficher une liste de la ressource.
     */
    public function index()
    {
        return Inertia::render('TypeAds/Index', [
            'typeAds' => TypeAds::all(),
            'flash' => session('flash', [])
        ]);
    }

    /**
     * Afficher le formulaire de création d'une nouvelle ressource.
     */
    public function create()
    {
        // Pas besoin de gérer cela dans cet exemple, géré dans une modal
    }

    /**
     * Enregistrer une nouvelle ressource dans le stockage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        TypeAds::create($request->only('name'));

        return redirect()->route('typeAds.index')->with('flash', ['success' => 'Type d\'agent créé avec succès!']);
    }

    /**
     * Afficher le formulaire d'édition de la ressource spécifiée.
     */
    public function edit(TypeAds $typeAd)
    {
        // Pas besoin de gérer cela dans cet exemple, géré dans une modal
    }

    /**
     * Mettre à jour la ressource spécifiée dans le stockage.
     */
    public function update(Request $request, TypeAds $typeAd)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $typeAd->update($request->only('name'));

        return redirect()->route('typeAds.index')->with('flash', ['success' => 'Type d\'agent mis à jour avec succès!']);
    }

    /**
     * Supprimer la ressource spécifiée du stockage.
     */
    public function destroy(TypeAds $typeAd)
    {
        $typeAd->delete();

        return redirect()->route('typeAds.index')->with('flash', ['success' => 'Type d\'agent supprimé avec succès!']);
    }
}
