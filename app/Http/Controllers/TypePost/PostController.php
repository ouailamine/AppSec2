<?php

namespace App\Http\Controllers\TypePost;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {


        Post::create([
            'name' => $request->input('name'),
            'abbreviation' => $request->input('abbreviation'),
            'type_post_id' => $request->input('type_post_id'),
            'default_duration_hours' => $request->input('default_duration_hours'),
            'default_duration_minutes' => $request->input('default_duration_minutes'),
        ]);
        return redirect()->back()->with('success', 'type de poste added successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {


        try {
            $post->update([
                'name' => $request->input('name'),
                'abbreviation' => $request->input('abbreviation'),
                'type_post_id' => $request->input('type_post_id'),
                'default_duration_hours' => $request->input('duration_of_work_hours'),
                'default_duration_minutes' => $request->input('duration_of_work_minutes'),
            ]);

            // Redirection avec un message de succès
            return redirect()->back()->with('success', 'Type de poste mis à jour avec succès.');
        } catch (\Exception $e) {
            // En cas d'erreur, retour avec un message d'erreur
            return response()->json([
                'error' => 'Erreur lors de la mise à jour du poste. Veuillez réessayer.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->back()->with('success', 'type de poste added successfully.');
    }
}
