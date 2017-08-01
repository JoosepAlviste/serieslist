<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SeenEpisode.
 *
 * @property int id
 * @property int user_id
 * @property int episode_id
 *
 * @package App\Models
 */
class SeenEpisode extends Model
{
    public function episode()
    {
        return $this->belongsTo(Episode::class, 'episode_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
