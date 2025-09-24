<?php

namespace App\Policies;

use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductTranslationPolicy
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


    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User|null  $user
     * @param  \App\Models\ProductVariant  $ProductVariant
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, ProductVariant $ProductVariant)
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProductVariant  $ProductVariant
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, ProductVariant $ProductVariant)
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProductVariant  $ProductVariant
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, ProductVariant $ProductVariant)
    {
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProductVariant  $ProductVariant
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, ProductVariant $ProductVariant)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProductVariant  $ProductVariant
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, ProductVariant $ProductVariant)
    {
        //
    }

    public function viewDestinationUsers(User $user)
    {
        return true;
    }
}
