<?php

namespace App\Http\Controllers;

use App\Models\Series;
use Illuminate\Http\Request;

class SeriesController extends Controller
{
    public function show(Series $series)
    {
        return view('series.show', compact('series'));
    }

    public function index()
    {
        $series = Series::all();
        return view('series.index', compact('series'));
    }
}
