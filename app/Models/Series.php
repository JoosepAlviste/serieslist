<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Series extends Model
{
    protected $fillable = ['title', 'description', 'start_year', 'end_year'];
}
