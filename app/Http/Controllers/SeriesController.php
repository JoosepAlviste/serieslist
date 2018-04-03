<?php

namespace App\Http\Controllers;

use App\FileUploader;
use App\Models\SeriesStatusType;
use App\Repositories\SeriesRepository;
use App\Http\Requests\StoreSeries;
use App\Models\Series;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Class SeriesController.
 *
 * @package App\Http\Controllers
 */
class SeriesController extends Controller
{
    /** @var Request */
    protected $request;
    /** @var SeriesRepository */
    protected $seriesRepository;

    /**
     * SeriesController constructor.
     *
     * @param Request $request
     * @param SeriesRepository $seriesRepository
     */
    public function __construct(
        Request $request,
        SeriesRepository $seriesRepository
    )
    {
        $this->request = $request;
        $this->seriesRepository = $seriesRepository;
    }

    /**
     * Show one series info page.
     *
     * @param Series $series
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(Series $series)
    {
        $status = auth()->check() ? $series->statusForUser() : null;
        $statusTypes = SeriesStatusType::all();

        return view('series.show', compact('series', 'status', 'statusTypes'));
    }

    /**
     * Show all series with pagination.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $series = $this->seriesRepository->paginate();

        return view('series.index', compact('series'));
    }

    /**
     * Save a series from the request. Also saves the seasons and episodes for
     * each season.
     *
     * @param StoreSeries $request
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(StoreSeries $request)
    {
        $series = $request->getInstance();

        $series = $this->savePoster($request, $series);

        $series->save();

        if ($request->filled('seasons')) {
            foreach ($request->get('seasons') as $season) {
                $series->addSeason($season);
            }
        }

        return redirect($series->path());
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
     *
     * @throws \Exception
     */
    public function update(StoreSeries $request, Series $series)
    {
        $series = $request->getInstance($series);
        $series = $this->savePoster($request, $series);
        $series->save();

        $series->updateSeasons($request->get('seasons', new Collection));

        return redirect($series->path());
    }

    /**
     * Show the edit series form with the currently saved series info.
     *
     * @param Series $series
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function edit(Series $series)
    {
        $series->load([
            'seasons',
            'seasons.episodes',
        ]);

        return view('series.admin.edit', compact('series'));
    }

    /**
     * Delete a series.
     *
     * @param Series $series
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     *
     * @throws \Exception
     */
    public function destroy(Series $series)
    {
        $series->delete();

        return redirect('/series');
    }

    /**
     * Save the poster from the given request to the given series object. Does
     * not perform the actual saving but just sets the field value.
     *
     * @param StoreSeries $request
     * @param Series $series
     *
     * @return Series
     */
    protected function savePoster(StoreSeries $request, $series)
    {
        if ($request->file('poster')) {
            $fileNames = app()->make(FileUploader::class)
                ->storeSeriesPoster($request);
            $series->poster = $fileNames['filename'];
        }

        return $series;
    }
}
