<?php

namespace App\Http\Controllers;

use App\Models\SeriesStatusType;
use Illuminate\Contracts\View\Factory;
use Illuminate\View\View;

/**
 * Class PagesController.
 * Used to display static pages, just to render views.
 *
 * @package App\Http\Controllers
 */
class PagesController extends Controller
{
    /**
     * Display the home view.
     *
     * @return Factory|View
     */
    public function home()
    {
        return view('pages.home');
    }

    /**
     * Display the welcome view.
     *
     * @return Factory|View
     */
    public function welcome()
    {
        return view('pages.welcome');
    }

    /**
     * Display the in progress series' list view.
     *
     * @param string $filter
     *
     * @return Factory|View
     */
    public function seriesList($filter = 'all')
    {
        $statusTypes = SeriesStatusType::all();

        $correctFilter = $statusTypes->pluck('status')->contains($filter);
        if (!$correctFilter) {
            $filter = 'all';
        }

        return view('list.index', compact('statusTypes', 'filter'));
    }
}
