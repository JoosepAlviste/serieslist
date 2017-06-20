<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Series;
use Illuminate\Auth\Access\HandlesAuthorization;

class SeriesPolicy
{
    use HandlesAuthorization;

    public function before($user, $ability)
    {
        if ($user->is_admin) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view the series.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Series  $series
     * @return mixed
     */
    public function view(User $user, Series $series)
    {
        //
    }

    /**
     * Determine whether the user can create series.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can update the series.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Series  $series
     * @return mixed
     */
    public function update(User $user, Series $series)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can delete the series.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Series  $series
     * @return mixed
     */
    public function delete(User $user, Series $series)
    {
        return $user->is_admin;
    }
}
