<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class AddSlugCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'zcustom:slug';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menambahkan slug ke dalam products';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $products = Product::all();

        foreach ($products as $product) {
            $product->slug = Str::slug($product->name); // Assuming you want to use the title for the slug
            $product->save();
        }
        return Command::SUCCESS;
    }
}
