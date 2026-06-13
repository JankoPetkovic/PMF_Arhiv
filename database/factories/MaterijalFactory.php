<?php

namespace Database\Factories;

use App\Models\Materijal;
use App\Models\Predmet;
use App\Models\PodtipMaterijala;
use App\Models\Korisnik;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Materijal>
 */
class MaterijalFactory extends Factory
{
    protected $model = Materijal::class;

    public function definition(): array
    {
        return [
            'naziv'               => fake()->unique()->word() . '.pdf',
            'predmet_id'          => Predmet::factory(),
            'podtip_materijala_id' => PodtipMaterijala::factory(),
            'skolska_godina'      => '2023-2024',
            'korisnik_id'         => Korisnik::factory(),
            'datum_dodavanja'     => now(),
        ];
    }
}
