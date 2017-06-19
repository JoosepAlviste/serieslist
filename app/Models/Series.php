<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * Class Series.
 *
 * @property int id
 * @property string title
 * @property string description
 * @property int start_year
 * @property int end_year
 * @property Season[]|Collection seasons
 *
 * @package App\Models
 */
class Series extends Model
{
    protected $fillable = ['title', 'description', 'start_year', 'end_year'];

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
     * Many to one relationship where a series has many seasons..
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function seasons()
    {
        return $this->hasMany(Season::class);
    }
}
