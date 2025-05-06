<?php

namespace App\JsonApi\V1\Users;

use Illuminate\Http\Request;
use LaravelJsonApi\Core\Resources\JsonApiResource;

class UserResource extends JsonApiResource
{

    /**
     * Get the resource's attributes.
     *
     * @param Request|null $request
     * @return iterable
     */
    public function attributes($request): iterable
    {
        $roles = $this->getRoleNames();
        return [
            'roles' => implode('', $roles->toArray()),
            'is_active' => (bool) $this->is_active,
            'email' => $this->email,
            'name' => $this->name,
            'address' => $this->address,
            'phone_number' => $this->phone_number,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
        ];
    }

    /**
     * Get the resource's relationships.
     *
     * @param Request|null $request
     * @return iterable
     */
    public function relationships($request): iterable
    {
        return [
            // @TODO
        ];
    }

}
