<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Class Episode.
 *
 * @property int id
 * @property string title
 * @property int number
 * @property int season_id
 * @property Season season
 * @property bool isSeen
 *
 * @method static Episode|Episode[]|Collection find($arg)
 * @method static Builder search(string $q)
 *
 * @package App\Models
 */
class Episode extends Model
{
    protected $fillable = ['title', 'number'];

    protected $with = ['season', 'season.series'];

    /**
     * Boot method used to add global scopes, etc. So whenever Episodes are
     * queried, these scopes are automatically activated.
     */
    protected static function boot() {
        parent::boot();

        static::addGlobalScope('orderByNumber', function (Builder $builder) {
            $builder->orderBy('number', 'asc');
        });
    }

    /**
     * Make a string path which points to this episode.
     *
     * @return string
     */
    public function path()
    {
        return "/series/{$this->season->series_id}/episodes/{$this->id}";
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

    /**
     * Checks if this episode is seen by the given user or
     * if no user is given, the authenticated user.
     *
     * @param int|null $userId
     *
     * @return bool
     */
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
            $this->markAsSeen($userId);
        } else {
            $this->markAsNotSeen($userId);
        }

        return $this;
    }

    /**
     * Generates a short slug for this episode.
     *
     * @return string
     */
    public function shortSlug()
    {
        return sprintf("S%02dE%02d", $this->season->number, $this->number);
    }

    /**
     * Gets the next episode. If this is the last episode of the season
     * get the first episode of the next season.
     *
     * @return Episode
     */
    public function nextEpisode()
    {
        $this->season;
        $nextEpisode = $this->season
                            ->episodes()
                            ->where('number', $this->number + 1)
                            ->setEagerLoads([])
                            ->first();
        if ($nextEpisode) {
            // Improve performance (less SQL queries), with setEagerLoads([])
            $nextEpisode->season = $this->season;
        }

        if ( ! $nextEpisode) {
            $nextSeason = $this->season->nextSeason;

            if ($nextSeason) {
                $nextEpisode = $nextSeason->episodes->first();
            }
        }

        return $nextEpisode;
    }

    /**
     * Mark this episode as not seen.
     *
     * @param int|null $userId
     *
     * @return $this
     */
    public function markAsNotSeen($userId = null)
    {
        $userId = $userId ?: auth()->id();

        SeenEpisode::where('user_id', $userId)
            ->where('episode_id', $this->id)
            ->delete();

        return $this;
    }

    /**
     * Mark this episode as seen by the given user.
     *
     * @param int|null $userId
     *
     * @return SeenEpisode
     */
    public function markAsSeen($userId = null)
    {
        $userId = $userId ?: auth()->id();

        return SeenEpisode::firstOrCreate([
            'user_id' => $userId,
            'episode_id' => $this->id,
        ]);
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

    /**
     * Set the many to one relationship where an episode can have a seen episode.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function seenEpisodes()
    {
        return $this->hasMany(SeenEpisode::class);
    }

    /**
     * Register the Search scope. Episodes can be searched for
     * by their title.
     *
     * @param Builder $query
     * @param string $q
     *
     * @return Builder
     */
    public function scopeSearch($query, $q)
    {
        return $query->whereRaw('LOWER(title) like ?', ["%{$q}%"]);
    }
}
