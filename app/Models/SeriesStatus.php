<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SeriesStatus.
 *
 * @property int id
 * @property int user_id
 * @property int series_id
 * @property int series_status_type_code
 *
 * @property User user
 * @property Series series
 * @property SeriesStatusType type
 *
 * @package App\App\Models
 */
class SeriesStatus extends Model
{
    protected $fillable = ['user_id', 'series_status_type_code'];

    /**
     * Define the relationship to the type of a series status.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function type()
    {
        return $this->belongsTo(SeriesStatusType::class, 'series_status_type_code');
    }

    /**
     * Define that the user has a series status set.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define that the series status points to a series.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function series()
    {
        return $this->belongsTo(Series::class);
    }
}
