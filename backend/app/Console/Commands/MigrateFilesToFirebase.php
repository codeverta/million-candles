<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Kreait\Firebase\Factory;
use Illuminate\Support\Str;
use App\Models\Document;

class MigrateFilesToFirebase extends Command
{
    protected $signature = 'migrate:files-to-firebase';
    protected $description = 'Migrate existing local storage files to Firebase Storage';

    public function handle()
    {
        // Initialize Firebase
        $firebase = (new Factory)
            ->withServiceAccount(config('app.firebase_credentials'));

        $storage = $firebase->createStorage();
        $bucket = $storage->getBucket(config('app.firebase_storage_bucket'));

        // Get all files from the local storage (Adjust the path if necessary)
        $files = Storage::disk('public')->files('image'); 

        if (empty($files)) {
            $this->info("No files found in local storage.");
            return;
        }

        foreach ($files as $filePath) {
            $fullPath = storage_path("app/public/$filePath");

            if (!file_exists($fullPath)) {
                $this->error("File not found: $filePath");
                continue;
            }

            // Generate a new Firebase Storage filename
            $fileName = 'images/' . basename($filePath);

            // Upload file to Firebase
            $bucket->upload(
                file_get_contents($fullPath),
                ['name' => $fileName]
            );

            // Generate Firebase Storage URL
            $storagePath = "https://firebasestorage.googleapis.com/v0/b/" 
                . config('app.firebase_storage_bucket') 
                . "/o/" . urlencode($fileName) . "?alt=media";

            // Update the database record to point to Firebase Storage
            Document::where('filename', $filePath)->update([
                'filename' => $storagePath,
            ]);

            $this->info("Migrated: $filePath → $storagePath");
        }

        $this->info("Migration complete!");
    }
}
