<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;

class UserController extends Controller
{

    use Actions\FetchMany;
    use Actions\FetchOne;
    use Actions\Store;
    use Actions\Update;
    use Actions\Destroy;
    use Actions\FetchRelated;
    use Actions\FetchRelationship;
    use Actions\UpdateRelationship;
    use Actions\AttachRelationship;
    use Actions\DetachRelationship;

    // public function creating(UserRequest $userRequest)
    // {
    //     dd(Role::sear()->pluck('name'));
    // }

    public function created(User $user)
    {
        $user->assignRole('buyer');
        $user->givePermissionTo(['orders:create', 'orders:update', 'orders:read', 'products:read']);
    }
}
