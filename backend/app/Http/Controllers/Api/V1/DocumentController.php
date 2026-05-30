<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\Document;
use Illuminate\Support\Facades\Log;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        $file = $request->file('image');
        $fileName = Str::random(20) . '.' . $file->getClientOriginalExtension();
        $storagePath = $file->storeAs('images', $fileName, 'public');

        $document = Document::create([
            'documentable_id' => $request->documentable_id,
            'documentable_type' => $request->documentable_type,
            'filename' => $storagePath,
        ]);

        return response()->json($document);
    }

    public function deleting($request) 
    {
        try {
            $document = Document::findOrFail($request);
            $filename = $document->getRawOriginal('filename');

            if ($filename && ! Str::startsWith($filename, ['http://', 'https://']) && Storage::disk('public')->exists($filename)) {
                Storage::disk('public')->delete($filename);
            }

            $document->delete();
            return response()->json(["success" => "document successfully deleted"]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error("error deleting document");
            return response()->json(['error' => 'Dokumen tidak ditemukan'], 404);
        }
    }
}
