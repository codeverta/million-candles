<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'code' => Str::upper(Str::random(4)),
            'description' => $this->faker->text(),
            'price' => $this->faker->randomDigit() * 10000,
            'stock' => $this->faker->randomDigit() * 10,
        ];
    }
}
