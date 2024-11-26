<?php

namespace App\Http\Controllers\HourlyReport;

use App\Http\Controllers\Controller;
use App\Models\CatchEvent;
use App\Models\Event;
use Illuminate\Http\Request;
use App\Models\Site;
use App\Models\Post;
use App\Models\TypePost;
use App\Models\User;

class HourlyReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('HourlyReports/Index2', [
            'sites' => Site::with('users')->get(),
            'users' => User::all(),
            'events' => Event::all(),
            'posts' => Post::all(),
            'catchEvents' => CatchEvent::all(),

        ]);
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
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
