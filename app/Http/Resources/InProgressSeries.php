<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

/**
 * Class InProgressSeries.
 * Used as an interface to transform in progress series to the format required
 * by the front-end.
 *
 * @property int episode_id
 * @property string shortSlug
 * @property int series_id
 * @property string series_title
 * @property int next_episode_id
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

        $nextEpisodeId = isset($this->next_episode_id)
            ? $this->next_episode_id
            : null;

        return [
            'id' => $this->series_id,
            'title' => $this->series_title,
            'latestSeenEpisode' => $latestSeenEpisode,
            'next_episode_id' => $nextEpisodeId,
        ];
    }
}
