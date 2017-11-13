<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Class Series.
 *
 * @property int id
 * @property string title
 * @property string description
 * @property int start_year
 * @property int end_year
 * @property string poster
 * @property Season[]|Collection seasons
 *
 * @method static Builder search(string $q)
 * @method static Series first
 *
 * @package App\Models
 */
class Series extends Model
{
    protected $fillable = ['title', 'description', 'start_year', 'end_year'];

    /**
     * Register model event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($series) {
            $series->seasons->each->delete();
        });

        static::addGlobalScope('orderByTitle', function (Builder $builder) {
            $builder->orderBy('title');
        });
    }

    /**
     * Get a string path which points to this series.
     *
     * @return string
     */
    public function path()
    {
        return "/series/{$this->id}";
    }

    /**
     * Add a season to this series.
     *
     * @param array $season
     *
     * @return Season
     */
    public function addSeason($season)
    {
        return $this->seasons()->create($season);
    }

    /**
     * Get the latest episode of this series the given user
     * has seen.
     * Does not take into account seen episodes after skipped
     * episodes.
     *
     * @param int|null $userId
     *
     * @return Episode
     */
    public function latestSeenEpisode($userId = null)
    {
        $userId = $userId ?: auth()->id();

        $lastSeen = null;
        $shouldBreak = false;

        foreach ($this->seasons as $season) {
            foreach ($season->episodes as $episode) {
                if ($episode->isSeen($userId)) {
                    $lastSeen = $episode;
                } else {
                    $shouldBreak = true;
                    break;
                }
            }

            if ($shouldBreak) {
                break;
            }
        }

        return $lastSeen;
    }

    /**
     * Many to one relationship where a series has many seasons..
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function seasons()
    {
        return $this->hasMany(Season::class);
    }

    /**
     * Register the Search scope. Series can be searched for
     * by their title and description.
     *
     * @param Builder $query
     * @param string $q
     *
     * @return Builder
     */
    public function scopeSearch($query, $q)
    {
        return $query->whereRaw('LOWER(title) like ?', ["%{$q}%"])
            ->orWhereRaw('LOWER(description) like ?', ["%$q%"]);
    }
}
