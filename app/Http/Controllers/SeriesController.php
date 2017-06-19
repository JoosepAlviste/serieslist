<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\Series;
use Illuminate\Http\Request;

class SeriesController extends Controller
{
    /**
     * Show one series info page.
     *
     * @param Series $series
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(Series $series)
    {
        return view('series.show', compact('series'));
    }

    /**
     * Show all series.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $series = Series::all();
        return view('series.index', compact('series'));
    }

    /**
     * Save a series from the request.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store()
    {
        $this->validate(request(), [
            'title' => 'required',
            'description' => 'required',
            'start_year' => 'required|numeric',
            'end_year' => 'nullable|numeric',
        ]);

        /** @var Series $series */
        $series = Series::create([
            'title' => request()->title,
            'description' => request()->description,
            'start_year' => request()->start_year,
            'end_year' => request()->end_year,
        ]);

        if (request()->has('seasons')) {
            foreach (request()->seasons as $season) {
                $savedSeason = $series->addSeason($season);
                if (array_key_exists('episodes', $season)) {
                    foreach ($season['episodes'] as $episode) {
                        $savedSeason->addEpisode($episode);
                    }
                }
            }
        }

        return redirect("/series/{$series->id}");
    }

    /**
     * Show the create series form.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {
        return view('series.admin.create');
    }

    /**
     * Update the given series with parameters from the request.
     *
     * @param Series $series
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Series $series)
    {
        $this->validate(request(), [
            'title' => 'required',
            'description' => 'required',
            'start_year' => 'required|numeric',
            'end_year' => 'nullable|numeric',
        ]);

        $series->title = request()->title;
        $series->description = request()->description;
        $series->start_year = request()->start_year;
        $series->end_year = request()->end_year;

        $series->save();

        return redirect("/series/{$series->id}");
    }

    /**
     * Show the edit series form.
     *
     * @param Series $series
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function edit(Series $series)
    {
        return view('series.admin.edit', compact('series'));
    }
}
