<?php

namespace Database\Factories;

use App\Models\Smer;
use App\Models\Departman;
use App\Models\NivoStudija;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Smer>
 */
class SmerFactory extends Factory
{
    protected $model = Smer::class;

    public function definition(): array
    {
        return [
            'naziv_smera'     => fake()->unique()->words(2, true),
            'departman_id'    => Departman::factory(),
            'nivo_studija_id' => NivoStudija::factory(),
        ];
    }
}
