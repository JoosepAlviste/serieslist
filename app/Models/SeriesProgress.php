<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SeriesProgress.
 *
 * @property int id
 * @property int user_id
 * @property int series_id
 * @property int latest_seen_episode_id
 * @property int next_episode_id
 *
 * @property Episode latestSeenEpisode
 * @property Episode nextEpisode
 * @property Series series
 *
 * @method static SeriesProgress make(array $params)
 *
 * @package App\Models
 */
class SeriesProgress extends Model
{
    protected $fillable = [
        'user_id', 'series_id', 'latest_seen_episode_id', 'next_episode_id',
    ];

    /**
     * Register the latestSeenEpisode relation where a series progress points
     * to one episode which is the latest seen episode.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function latestSeenEpisode()
    {
        return $this->belongsTo(Episode::class, 'latest_seen_episode_id');
    }

    /**
     * Register the series relationship where a SeriesProgress points to one
     * series, the progress for which the SeriesProgress represents.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function series()
    {
        return $this->belongsTo(Series::class);
    }
}
