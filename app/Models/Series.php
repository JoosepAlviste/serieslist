<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Series.
 *
 * @property int id
 * @property string title
 * @property string description
 * @property int start_year
 * @property int end_year
 * @property Season[] seasons
 *
 * @package App\Models
 */
class Series extends Model
{
    protected $fillable = ['title', 'description', 'start_year', 'end_year'];

    /**
     * Many to one relationship where a series has many seasons..
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function seasons()
    {
        return $this->hasMany(Season::class);
    }

    public function path()
    {
        return "/series/{$this->id}";
    }
}
