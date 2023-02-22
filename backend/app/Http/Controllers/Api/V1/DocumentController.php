<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\Document;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;

class DocumentController extends Controller
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

    public function upload(StoreDocumentRequest $request)
    {
        $image_path = $request->file('image')->store('image', 'public');

        $document = Document::create([
            'documentable_id' => $request->documentable_id,
            'documentable_type' => $request->documentable_type,
            'filename' => $image_path,
        ]);

        return response()->json($document);
    }
}
