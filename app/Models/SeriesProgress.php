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
 * @method static SeriesProgress make(array $params)
 *
 * @package App\Models
 */
class SeriesProgress extends Model
{
    protected $fillable = [
        'user_id', 'series_id', 'latest_seen_episode_id', 'next_episode_id'
    ];
}
