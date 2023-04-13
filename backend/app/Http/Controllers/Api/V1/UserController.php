<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\JsonApi\V1\Users\UserRequest;
use App\Models\User;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use App\Mail\RegisterEmail;
use Illuminate\Support\Facades\Mail;

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

    public function creating(UserRequest $userRequest)
    {
        $email = $userRequest->input('data.attributes.email');
        $name = $userRequest->input('data.attributes.name');
        $password = $userRequest->input('data.attributes.password');
        Mail::to($email)->send(new RegisterEmail([
            "email" => $email,
            "name" => $name,
            "password" => $password
        ]));
    }

    public function created(User $user)
    {
        $user->assignRole('buyer');
        $user->givePermissionTo(['orders:create', 'orders:update', 'orders:read', 'products:read']);

    }
}
