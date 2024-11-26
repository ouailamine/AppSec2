<?php

namespace App\Http\Controllers\TypePost;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TypePost;

class TypePostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $typePosts = TypePost::all();
        $posts = Post::with('typePost')->get();

        return Inertia::render('TypePost/Index', [
            'typePosts' => $typePosts,
            'posts' => $posts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('TypePosts/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        TypePost::create($request->all());

        return redirect()->back()->with('success', 'type de poste added successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TypePost  $typePost
     * @return \Inertia\Response
     */
    public function show(TypePost $typePost)
    {
        return Inertia::render('TypePosts/Show', [
            'typePost' => $typePost
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TypePost  $typePost
     * @return \Inertia\Response
     */
    public function edit(TypePost $typePost)
    {
        return Inertia::render('TypePosts/Edit', [
            'typePost' => $typePost
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TypePost  $typePost
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, TypePost $typePost)
    {
        $request->validate([
            'name' => 'required|string|max:255',

        ]);

        $typePost->update($request->all());

        return redirect()->route('typePosts.index')
            ->with('success', 'TypePost updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TypePost  $typePost
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(TypePost $typePost)
    {
        $typePost->delete();

        return redirect()->route('typePosts.index')
            ->with('success', 'TypePost deleted successfully.');
    }
}
