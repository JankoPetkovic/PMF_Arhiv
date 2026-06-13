<?php

namespace Database\Factories;

use App\Models\TipMaterijala;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TipMaterijala>
 */
class TipMaterijalaFactory extends Factory
{
    protected $model = TipMaterijala::class;

    public function definition(): array
    {
        return [
            'naziv' => fake()->unique()->word(),
        ];
    }
}
