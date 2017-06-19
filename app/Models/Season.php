<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Season.
 *
 * @property int id
 * @property int number
 * @property int series_id
 * @property Series series
 * @property Episode[] episodes
 *
 * @package App\Models
 */
class Season extends Model
{
    protected $fillable = ['number'];

    /**
     * Construct a string path for a season.
     *
     * @return string
     */
    public function path()
    {
        return "/series/{$this->series->id}/seasons/{$this->number}";
    }

    /**
     * Add an episode to this season.
     *
     * @param array $episode
     *
     * @return Episode
     */
    public function addEpisode($episode)
    {
        return $this->episodes()->create($episode);
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
}
