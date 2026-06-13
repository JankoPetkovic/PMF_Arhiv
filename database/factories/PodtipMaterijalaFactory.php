<?php

namespace Database\Factories;

use App\Models\PodtipMaterijala;
use App\Models\TipMaterijala;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PodtipMaterijala>
 */
class PodtipMaterijalaFactory extends Factory
{
    protected $model = PodtipMaterijala::class;

    public function definition(): array
    {
        return [
            'naziv'             => fake()->unique()->word(),
            'tip_materijala_id' => TipMaterijala::factory(),
        ];
    }
}
