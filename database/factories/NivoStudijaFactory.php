<?php

namespace Database\Factories;

use App\Models\NivoStudija;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NivoStudija>
 */
class NivoStudijaFactory extends Factory
{
    protected $model = NivoStudija::class;

    public function definition(): array
    {
        return [
            'nivo_studija' => fake()->randomElement(['Osnovne', 'Master', 'Doktorske']) . ' ' . fake()->unique()->numberBetween(1, 100000),
        ];
    }
}
