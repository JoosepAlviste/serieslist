<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SeenEpisode.
 *
 * @property int id
 * @property int user_id
 * @property int episode_id
 * @property User user
 * @property Episode episode
 *
 * @package App\Models
 */
class SeenEpisode extends Model
{
    protected $fillable = ['user_id', 'episode_id'];

    /**
     * Register the many to one relationship with episode.
     * The episode which has been seen by the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function episode()
    {
        return $this->belongsTo(Episode::class, 'episode_id', 'id');
    }

    /**
     * Register the many to one relationship with user.
     * The user who has seen the episode.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
