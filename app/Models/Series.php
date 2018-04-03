<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
 * @property SeriesStatus[]|Collection seriesStatuses
 * @property SeriesProgress[]|Collection progresses
 *
 * @method static Builder search(string $q)
 * @method static Builder byStatus(string|null $status, int|null $userId)
 * @method static Builder withProgress(int|null $userId)
 * @method static Series first
 * @method static Builder whereHas($association, $rule)
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
     * Add a season to this series. Also triggers adding episodes for the
     * created series from the given parameters.
     *
     * The parameters can have a key 'episodes' containing a list of episodes.
     * These episodes will be added to the newly created season.
     *
     * TODO: This should probably be done in a more efficient way -- one SQL query
     *
     * @param array $season
     *
     * @return Season
     */
    public function addSeason($season)
    {
        /* @var Season $savedSeason */
        $savedSeason = $this->seasons()->create($season);

        if (array_key_exists('episodes', $season)) {
            foreach ($season['episodes'] as $episode) {
                $savedSeason->addEpisode($episode);
            }
        }

        return $savedSeason;
    }

    /**
     * Update the seasons for this series with the given values. First checks if
     * there should be any seasons or episodes updated from the existing ones.
     * Next, it will delete the seasons, which don't exist in the new seasons.
     * Then, it will add new seasons.
     *
     * @param array $newSeasons
     *
     * @return $this
     *
     * @throws \Exception
     */
    public function updateSeasons($newSeasons)
    {
        $addedSeasons = new Collection;

        foreach ($this->seasons as $oldSeason) {
            $shouldDelete = true;
            foreach ($newSeasons as $newSeason) {
                if ($oldSeason->number == $newSeason['number']) {
                    $newEpisodes = array_key_exists('episodes', $newSeason)
                        ? $newSeason['episodes']
                        : [];
                    $oldSeason->updateEpisodes($newEpisodes);

                    $shouldDelete = false;
                    $addedSeasons->push($oldSeason->number);
                    break;
                }
            }

            if ($shouldDelete) {
                $oldSeason->delete();
            }
        }

        foreach ($newSeasons as $newSeason) {
            if (!$addedSeasons->contains($newSeason['number'])) {
                $this->addSeason($newSeason);
            }
        }

        return $this;
    }

    /**
     * Get the latest episode of this series the given user has seen. Does not
     * take into account seen episodes after skipped episodes.
     *
     * TODO: Remove this because we now have SeriesProgress in the database?
     *
     * Might be good for finding episodes that have been missed (one episode not
     * seen and the next ones have been seen).
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
     * Update a series' status for the given user. The series status code is one
     * that's found in the `series_status_types` table.
     *
     * If no user id is given, get the authenticated user's id.
     *
     * @param int $seriesStatusTypeCode
     * @param int|null $userId
     *
     * @return SeriesStatus
     */
    public function updateSeriesStatus($seriesStatusTypeCode, $userId = null)
    {
        $userId = $userId ?: auth()->id();

        $status = $this->statusForUser($userId);

        // TODO: Look into Eloquent update or create
        if ($status) {
            $status->series_status_type_code = $seriesStatusTypeCode;
            $status->save();

            return $status;
        }

        /** @var SeriesStatus $status */
        $status = $this->statuses()->create([
            'user_id' => $userId,
            'series_status_type_code' => $seriesStatusTypeCode,
        ]);

        return $status;
    }

    /**
     * Get the series status for this series and the given user.
     *
     * If no user is given, use the authenticated user.
     *
     * @param int|null $userId
     *
     * @return SeriesStatus
     */
    public function statusForUser($userId = null)
    {
        $userId = $userId ?: auth()->id();

        return $this->statuses()
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Remove the status for this series for the given user.
     *
     * If no user is given, use the authenticated user.
     *
     * @param int|null $userId
     *
     * @return int
     */
    public function removeStatusForUser($userId = null)
    {
        $userId = $userId ?: auth()->id();

        return $this->statuses()
            ->where('user_id', $userId)
            ->delete();
    }

    /**
     * Get the progress for the user for this series. If no user id is given,
     * get the currently authenticated user's id.
     *
     * @param int|null $userId
     *
     * @return SeriesProgress|null
     */
    public function progress($userId = null)
    {
        $userId = $userId ?: auth()->id();

        return $this->progresses()->where('user_id', $userId)->first();
    }

    /**
     * Updates or creates a new progress for this series and the given user.
     *
     * If the user has no progress, will insert a new entry into the series
     * progresses table with the given latest seen episode id and the next
     * episode id.
     *
     * When no user id is given, take the authenticated user's id.
     *
     * @param int $latestSeenEpisodeId
     * @param int|null $nextEpisodeId
     * @param int|null $userId
     *
     * @return SeriesProgress|Model|null
     */
    public function setProgress(
        $latestSeenEpisodeId, $nextEpisodeId = null, $userId = null
    )
    {
        $userId = $userId ?: auth()->id();

        // TODO: Look into Eloquent create or update?
        if (!$progress = $this->progress($userId)) {
            $progress = $this->progresses()->make([
                'user_id' => $userId,
            ]);
        }

        $progress->latest_seen_episode_id = $latestSeenEpisodeId;
        $progress->next_episode_id = $nextEpisodeId;
        $progress->save();

        return $progress;
    }

    /**
     * Deletes the progress for the given user.
     *
     * If no user id is given, use the authenticated user's id.
     *
     * @param int|null $userId
     */
    public function deleteProgress($userId = null)
    {
        $userId = $userId ?: auth()->id();

        $this->progresses()->where('user_id', $userId)->delete();
    }

    /**
     * Register the by status scope. Gets series where the given status for the
     * given user is set. So, when the user has marked a series as
     * 'in-progress' and asks for their 'in-progress' series, they get the
     * correct series.
     *
     * If no status is given, gets all series for which the user has marked a
     * status.
     *
     * @param Builder $query
     * @param null|string $status
     * @param null|int $userId
     *
     * @return Builder
     */
    public function scopeByStatus($query, $status, $userId = null)
    {
        $userId = $userId ?: auth()->id();

        $query->whereHas('statuses', function ($query) use ($userId, $status) {
            $query->where('user_id', $userId);

            if ($status) {
                // If a status type filter has been added, check that the type
                // text is also correct ('in progress', 'completed', etc.)
                $query->whereHas('type', function ($query) use ($status) {
                    $query->where('status', $status);
                });
            }
        });

        return $query;
    }

    /**
     * Register the Search scope. Series can be searched for by their title and
     * description.
     *
     * TODO: Eventually this will be handled by something smarter like Elasticsearch
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

    /**
     * Add progresses for the given user to the query.
     *
     * @param Builder $query
     * @param int|null $userId
     *
     * @return Builder
     */
    public function scopeWithProgress($query, $userId = null)
    {
        $userId = $userId ?: auth()->id();

        return $query->with([
            'progresses' => function ($query) use ($userId) {
                /** @var Builder $query */
                $query->where('user_id', $userId);
                // Because we already have series info from the series
                // table, we do not need it again (added by default by
                // Episode)
                $query->with([
                    'latestSeenEpisode' => function ($query) {
                        /** @var Builder $query */
                        $query->without('season.series');
                    },
                ]);
            },
        ]);
    }

    /**
     * Many to one relationship where a series has many seasons.
     *
     * @return HasMany
     */
    public function seasons()
    {
        return $this->hasMany(Season::class);
    }

    /**
     * Many to one relationship where a series has many statuses.
     *
     * @return HasMany
     */
    public function statuses()
    {
        return $this->hasMany(SeriesStatus::class);
    }

    /**
     * Many to one relationship where a series has many progresses associated
     * with it. Each user has one series progress so this collection should
     * always have one or zero elements.
     *
     * TODO: Look into having filter for auth()->id() and a hasOne relationship?
     *
     * @return HasMany
     */
    public function progresses()
    {
        return $this->hasMany(SeriesProgress::class);
    }
}
