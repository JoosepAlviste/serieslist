<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Episode.
 *
 * @property int id
 * @property string title
 * @property Season season
 *
 * @package App\Models
 */
class Episode extends Model
{
    protected $fillable = ['title'];

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
}
