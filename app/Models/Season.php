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
 *
 * @package App\Models
 */
class Season extends Model
{
    protected $fillable = ['number'];

    /**
     * Many to one relationship where a series has many seasons..
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function series()
    {
        return $this->belongsTo(Series::class);
    }

    public function path()
    {
        return "/series/{$this->series->id}/seasons/{$this->number}";
    }
}
