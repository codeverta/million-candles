<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\Document;
use Illuminate\Support\Facades\Log;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use Storage;
use Kreait\Firebase\Factory;
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
        // Initialize Firebase
        $firebase = (new Factory)
            ->withServiceAccount(config('app.firebase_credentials'));

        $storage = $firebase->createStorage();
        $bucket = $storage->getBucket();

        // Get the uploaded file
        $file = $request->file('image');
        $fileName = 'images/' . Str::random(20) . '.' . $file->getClientOriginalExtension();
        
        // Upload to Firebase Storage
        $bucket->upload(
            file_get_contents($file->getRealPath()),
            ['name' => $fileName]
        );

        // Generate Firebase Storage public URL
        $storagePath = "https://firebasestorage.googleapis.com/v0/b/" . config('app.firebase_storage_bucket') . "/o/" . urlencode($fileName) . "?alt=media";

        // Save document details in the database
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
            // Delete the file from storage
            if ($document->filename && Storage::exists($document->filename)) {
                Storage::delete($document->filename);
            }
            $document->delete();
            return response()->json(["success" => "document successfully deleted"]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error("error deleting document");
            return response()->json(['error' => 'Dokumen tidak ditemukan'], 404);
        }
    }
}
