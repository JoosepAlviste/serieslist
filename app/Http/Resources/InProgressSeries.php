<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

/**
 * Class InProgressSeries.
 * Used as an interface to transform in progress series to the format required
 * by the front-end.
 *
 * @package App\Http\Resources
 */
class InProgressSeries extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request)
    {
        $latestSeenEpisode = [
            'id' => $this->episode_id,
            'shortSlug' => $this->shortSlug,
        ];

        $nextEpisode = isset($this->nextEpisode)
            ? [ 'id' => $this->nextEpisode->id ]
            : null;

        return [
            'id' => $this->series_id,
            'title' => $this->series_title,
            'latestSeenEpisode' => $latestSeenEpisode,
            'nextEpisode' => $nextEpisode,
        ];
    }
}
