<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Series.
 *
 * @property string title
 * @property string description
 * @property int start_year
 * @property int end_year
 *
 * @package App\Models
 */
class Series extends Model
{
    protected $fillable = ['title', 'description', 'start_year', 'end_year'];
}
