<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\UpdateSeriesStatus;
use App\Models\Series;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\Routing\ResponseFactory;
use Symfony\Component\HttpFoundation\Response;

class SeriesStatusController extends Controller
{
    /**
     * Update the given series' status for the currently logged in user.
     *
     * @param Series $series
     * @param UpdateSeriesStatus $request
     *
     * @return ResponseFactory|Response
     */
    public function update(Series $series, UpdateSeriesStatus $request)
    {
        $statusCode = $request->input('code');

        $series->updateSeriesStatus($statusCode);

        return response('', 200);
    }

    /**
     * Remove a series from having any status for the current user.
     *
     * @param Series $series
     *
     * @return ResponseFactory|Response
     */
    public function destroy(Series $series)
    {
        $series->removeStatusForUser();

        return response('', 200);
    }
}
