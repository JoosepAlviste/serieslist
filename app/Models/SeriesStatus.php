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
 * @package App\App\Models
 */
class SeriesStatus extends Model
{
    protected $fillable = ['user_id', 'series_status_type_code'];
}
