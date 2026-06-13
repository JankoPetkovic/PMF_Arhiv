<?php

namespace Database\Factories;

use App\Models\Predmet;
use App\Models\Smer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Predmet>
 */
class PredmetFactory extends Factory
{
    protected $model = Predmet::class;

    public function definition(): array
    {
        return [
            'naziv'   => fake()->unique()->words(2, true),
            'godina'  => fake()->numberBetween(1, 4),
            'smer_id' => Smer::factory(),
        ];
    }
}
