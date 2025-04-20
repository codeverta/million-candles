<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VariantCombinationPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function view(User $user)
    {
        return true;
    }

    public function viewAny(User $user)
    {
        // todo ganti ini
        return true || $user->can('users:*');
    }

    public function update(User $user)
    {
        return true;
    }

    public function create(User $user)
    {
        return true;
    }
}
