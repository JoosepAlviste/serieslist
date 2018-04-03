<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * Class Season.
 *
 * @property int id
 * @property int number
 * @property int series_id
 * @property Series series
 * @property Episode[]|Collection episodes
 * @property Season nextSeason
 * @property Season previousSeason
 *
 * @method static Builder where(string $table, string | int $val)
 *
 * @package App\Models
 */
class Season extends Model
{
    protected $fillable = ['number'];

    /**
     * Register model event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($season) {
            Episode::where('season_id', $season->id)->delete();
        });
    }

    /**
     * Construct a string path for a season.
     *
     * @return string
     */
    public function path()
    {
        return "/series/{$this->series_id}/seasons/{$this->number}";
    }

    /**
     * Add an episode to this season with the given parameters.
     *
     * @param array $episode
     *
     * @return Episode
     */
    public function addEpisode($episode)
    {
        /** @var Episode $episode */
        $episode = $this->episodes()->create($episode);

        return $episode;
    }

    /**
     * Update the episodes in this season based on the new episodes given.
     *
     * @param $episodes
     *
     * @throws \Exception
     */
    public function updateEpisodes($episodes)
    {
        $updatedEpisodes = new Collection;

        foreach ($this->episodes as $oldEpisode) {
            $shouldDelete = true;
            foreach ($episodes as $newEpisode) {
                if ($oldEpisode->number == $newEpisode['number']) {

                    $oldEpisode->title = $newEpisode['title'];

                    $oldEpisode->save();

                    $updatedEpisodes->push($oldEpisode->number);
                    $shouldDelete = false;
                    break;
                }
            }

            if ($shouldDelete) {
                $oldEpisode->delete();
            }
        }

        foreach ($episodes as $episode) {
            if (!$updatedEpisodes->contains($episode['number'])) {
                $this->addEpisode($episode);
            }
        }
    }

    /**
     * Many to one relationship where a series has many seasons.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function series()
    {
        return $this->belongsTo(Series::class);
    }

    /**
     * One to many relationship where a season consists of many episodes.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function episodes()
    {
        return $this->hasMany(Episode::class);
    }

    /**
     * Find the next season for this season's series.
     *
     * @return Season
     */
    public function getNextSeasonAttribute()
    {
        return Season::where('series_id', $this->series_id)
            ->where('number', $this->number + 1)
            ->first();
    }

    /**
     * Find the previous season for this season's series.
     *
     * @return Season
     */
    public function getPreviousSeasonAttribute()
    {
        return Season::where('series_id', $this->series_id)
            ->where('number', $this->number - 1)
            ->first();
    }
}
