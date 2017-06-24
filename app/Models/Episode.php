<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Episode.
 *
 * @property int id
 * @property string title
 * @property int number
 * @property Season season
 * @property bool isSeen
 *
 * @package App\Models
 */
class Episode extends Model
{
    protected $fillable = ['title', 'number'];

    protected $with = ['season', 'season.series'];

    protected $appends = ['isSeen'];

    /**
     * Make a string path which points to this episode.
     *
     * @return string
     */
    public function path()
    {
        return "/series/{$this->season->series->id}/episodes/{$this->id}";
    }

    /**
     * Set the one to many relationship where an episode belongs to a season.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function seenEpisodes()
    {
        return $this->hasMany(SeenEpisode::class);
    }

    /**
     * Check if this episode is seen by the user with the
     * given ID.
     * If no ID is given, use authenticated user ID instead.
     *
     * @return bool
     */
    public function getIsSeenAttribute()
    {
        return $this->isSeen();
    }

    public function isSeen($userId = null)
    {
        $userId = $userId ?: auth()->id();

        return ! ! $this->seenEpisodes
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Toggle this episode's seen status for the user with the given id.
     * If no user id is given, use authenticated user instead.
     *
     * @param int|null $userId
     *
     * @return $this
     */
    public function toggleSeen($userId = null)
    {
        $userId = $userId ?: auth()->id();

        if ( ! $this->isSeen) {
            $seen             = new SeenEpisode;
            $seen->user_id    = $userId;
            $seen->episode_id = $this->id;
            $seen->save();
        } else {
            $seen = SeenEpisode::where('user_id', $userId)
                               ->where('episode_id', $this->id)
                               ->first();
            $seen->delete();
        }

        return $this;
    }

    public function shortSlug()
    {
        return sprintf("S%02dE%02d", $this->season->number, $this->number);
    }
}
