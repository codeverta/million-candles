<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\JsonApi\V1\Products\ProductCollectionQuery;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use App\JsonApi\V1\Products\ProductRequest;
use App\JsonApi\V1\Products\ProductQuery;
use LaravelJsonApi\Core\Responses\DataResponse;

class ProductController extends Controller
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

    public function searched($data, ProductCollectionQuery $query)
    {
        // e.g. dispatch a job.
        return DataResponse::make($data)->withServer('v1');
    }

    public function creating(ProductRequest $request, ProductQuery $query): void
    {
        // do something only on creating...
        // dd($request, $query);
    }

}
