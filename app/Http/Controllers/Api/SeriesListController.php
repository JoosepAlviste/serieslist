<?php

namespace App\Http\Controllers\Api;

use App\Models\Series;
use App\Models\User;
use App\Http\Resources\InProgressSeries as InProgressSeriesResource;
use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;

/**
 * Class SeriesListController.
 *
 * @package App\Http\Controllers\Api
 */
class SeriesListController extends Controller
{
    public function index(User $user)
    {
        $status = request()->get('status', null);

        /** @var Collection|Series[] $series */
        $series = Series::byStatus($status, $user->id)
            ->get();

        $returnData = $series->map(function ($oneSeries) {
            $obj = new \StdClass;
            $obj->series_id = $oneSeries->id;
            $obj->series_title = $oneSeries->title;

            return $obj;
        });

        return InProgressSeriesResource::collection($returnData);
    }
}
