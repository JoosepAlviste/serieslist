<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SeriesStatusType.
 *
 * @property int code
 * @property string status
 *
 * @method static SeriesStatusType create(array $params)
 * @method static SeriesStatusType first()
 *
 * @package App\App\Models
 */
class SeriesStatusType extends Model
{
    public $timestamps = false;

    protected $fillable = ['code', 'status'];

    protected $primaryKey = 'code';

    public $incrementing = false;

    protected $appends = ['pretty'];

    /**
     * Prettify the slug of the status type. For example, 'in-progress' turns to
     * 'In progress'. This can be shown to the user.
     *
     * @return string
     */
    public function getPrettyAttribute()
    {
        return __('seriesStatus.' . $this->status);
    }
}
