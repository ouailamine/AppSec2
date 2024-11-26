<?php

namespace App\Http\Controllers\EstimateInvoice;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Planning;
use App\Models\Post;
use App\Models\Site;
use App\Models\TypePost;

class EstimateInvoiceController extends Controller
{
    // Display a list of estimates
    public function Index()
{
    // Retrieve all plannings and sites, but only select specific columns from events
    $plannings = Planning::with(['events' => function ($query) {
        $query->select('holiday_hours', 'lunchAllowance', 'night_hours', 'post', 'sunday_hours', 'typePost', 'work_duration', 'planning_id'); // Add planning_id if it's needed for the relation
    }])->get();

    $sites = Site::all();
    $typesPosts = TypePost::where('default_duration', false)->get();
    $Posts= Post::All();


    // Pass the data to the Inertia view
    return Inertia::render('EstimateInvoice/Index2', [
        'plannings' => $plannings,
        'sites' => $sites,
        'typePosts'=> $typesPosts,
        'Posts'=> $Posts,
        'holidays' => Holiday::all(),

    ]);
}

}
