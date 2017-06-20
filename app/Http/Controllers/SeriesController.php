<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSeries;
use App\Models\Series;
use Illuminate\Support\Collection;

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
     * @param StoreSeries $request
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(StoreSeries $request)
    {
        $series = new Series;
        $series->title = $request->get('title');
        $series->description = $request->get('description');
        $series->start_year = $request->get('start_year');
        $series->end_year = $request->get('end_year');

        $series->save();

        if ($request->has('seasons')) {
            foreach ($request->get('seasons') as $season) {
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
     * @param StoreSeries $request
     * @param Series $series
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StoreSeries $request, Series $series)
    {
        $series->title = $request->get('title');
        $series->description = $request->get('description');
        $series->start_year = $request->get('start_year');
        $series->end_year = $request->get('end_year');

        $series->save();

        $oldSeasons = $series->seasons;
        $newSeasons = $request->get('seasons') ?: new Collection;
        $addedSeasons = new Collection;

        foreach ($oldSeasons as $oldSeason) {
            $shouldDelete = true;
            foreach ($newSeasons as $newSeason) {
                if ($oldSeason->number === $newSeason['number']) {
                    // TODO: Update episodes?
                    $shouldDelete = false;
                    $addedSeasons->push($oldSeason->number);
                    break;
                }
            }

            if ($shouldDelete) {
                $oldSeason->delete();
            }
        }

        foreach ($newSeasons as $newSeason) {
            if (!$addedSeasons->contains($newSeason['number'])) {
                $series->addSeason($newSeason);
            }
        }

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
