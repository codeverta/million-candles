<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use LaravelJsonApi\Core\Exceptions\JsonApiException;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Core\Responses\MetaResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\MailableUser;

class AuthController extends Controller
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

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data.attributes.email' => 'required|email',
            'data.attributes.password' => 'required|min:8',
            'data.meta.device_name' => 'required',
        ]);

        if ($validator->fails()) {
            return app(\LaravelJsonApi\Validation\Factory::class)
                ->createErrors($validator);
        }

        $user = User::where('email', $request->input('data.attributes.email'))->first();

        if (!$user || !Hash::check($request->input('data.attributes.password'), $user->password)) {
            throw JsonApiException::error([
                'status' => 400,
                'detail' => 'Email atau password salah.',
            ]);
        }
        return response()->json([
            'token' => $user->createToken('login')->plainTextToken,
            'me' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getPermissionNames()
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'me' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getPermissionNames()
        ]);
    }

    public function register(Request $request)
    {
        $name = "Rabih";
        
        Mail::to('rabihutomo11@gmail.com')->send(new MailableUser($name));

    }

    public function forgot(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data.attributes.email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return app(\LaravelJsonApi\Validation\Factory::class)
                ->createErrors($validator);
        }

        if ($user = User::where('email', $request->input('data.attributes.email'))->first()) {
            $token = Password::createToken($user);
            $user->sendPasswordResetNotification($token);
        }

        return response()->json([
            'jsonapi' => [
                'version' => '1.0',
            ],
        ])->header('Content-Type', 'application/vnd.api+json');
    }

    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data.attributes.email' => 'required|email',
            'data.attributes.password' => 'required|min:8',
            'data.meta.device_name' => 'required',
        ]);

        if ($validator->fails()) {
            return app(\LaravelJsonApi\Validation\Factory::class)
                ->createErrors($validator);
        }

        $status = Password::reset(
            [
                'email' => $request->input('data.attributes.email'),
                'password' => $request->input('data.attributes.password'),
                'token' => $request->bearerToken(),
            ],
            function ($user, $password) {
                $user->update(['password' => Hash::make($password)]);
                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw JsonApiException::error([
                'status' => 400,
                'detail' => 'The provided credentials are incorrect.',
            ]);
        }

        $user = User::where('email', $request->input('data.attributes.email'))->first();

        return DataResponse::make($user)->withServer('v1');
    }
}
