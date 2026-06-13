<?php

namespace Database\Factories;

use App\Models\Departman;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Departman>
 */
class DepartmanFactory extends Factory
{
    protected $model = Departman::class;

    public function definition(): array
    {
        return [
            'naziv' => fake()->unique()->word(),
        ];
    }
}
