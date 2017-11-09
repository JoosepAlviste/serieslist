<?php

namespace App\Http\Controllers;

/**
 * Class ListController.
 *
 * @package App\Http\Controllers
 */
class ListController extends Controller
{
    /**
     * Render the list view.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
//        $controller = app(\App\Http\Controllers\Api\SeriesController::class);
//        $series = $controller->inProgressSeries(auth()->user());
//        dd($series);
//
//        return view('pages.home');
        return view('list.index');
    }
}
