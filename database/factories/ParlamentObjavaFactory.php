<?php

namespace Database\Factories;

use App\Models\ParlamentObjava;
use App\Models\Korisnik;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ParlamentObjava>
 */
class ParlamentObjavaFactory extends Factory
{
    protected $model = ParlamentObjava::class;

    public function definition(): array
    {
        return [
            'naslov'      => fake()->sentence(3),
            'sadrzaj'     => fake()->paragraph(),
            'slika'       => null,
            'link'        => null,
            'korisnik_id' => Korisnik::factory(),
        ];
    }
}
