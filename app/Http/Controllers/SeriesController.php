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

    public function store()
    {
        $this->validate(request(), [
            'title' => 'required',
            'description' => 'required',
            'start_year' => 'required|numeric',
            'end_year' => 'nullable|numeric',
        ]);

        $series = Series::create([
            'title' => request()->title,
            'description' => request()->description,
            'start_year' => request()->start_year,
            'end_year' => request()->end_year,
        ]);

        return redirect("/series/{$series->id}");
    }

    public function create()
    {
        return view('series.admin.create');
    }
}
