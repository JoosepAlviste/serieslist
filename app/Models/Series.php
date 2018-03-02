<?php

namespace App\Models;

use App\Models\SeriesStatus;
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
 *
 * @method static Builder search(string $q)
 * @method static Builder byStatus(string|null $status, int|null $userId)
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

    /**
     * Update a series' status for the given user. If no user id
     * is given, get the authenticated user's id.
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

        if ($status) {
            $status->series_status_type_code = $seriesStatusTypeCode;
            $status->save();

            return $status;
        }

        return $this->statuses()->create([
            'user_id' => $userId,
            'series_status_type_code' => $seriesStatusTypeCode,
        ]);
    }

    /**
     * Get the series status for this series and the given user.
     * If no user is given, use the authenticated user.
     *
     * @param int|null $userId
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
     * Remove the status for this series for the user given. If no user is
     * given, use the authenticated user.
     *
     * @param int|null $userId
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
    public function scopeByStatus($query, $status, $userId)
    {
        $userId = $userId ?: auth()->id();

        $query->whereHas('statuses', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        });

        if ($status) {
            $query->whereHas('statuses.type', function ($query) use ($status) {
                $query->where('status', $status);
            });
        }

        return $query;
    }
}
