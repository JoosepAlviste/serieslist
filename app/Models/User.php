<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Collection;

/**
 * Class User.
 *
 * @property int id
 * @property string name
 * @property string email
 * @property bool is_admin
 * @property string password
 *
 * @method static User first()
 * @method static User create($params)
 *
 * @package App\Models
 */
class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Get the in progress series which this user watched an episode of.
     *
     * TODO: Does this need to exist?
     *
     * @return Series[]|Collection
     */
    public function inProgressSeries()
    {
        return Series::whereHas('seasons.episodes.seenEpisodes', function ($query) {
            $query->where('user_id', $this->id);
        })->get();
    }
}
