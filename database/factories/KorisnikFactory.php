<?php

namespace Database\Factories;

use App\Models\Korisnik;
use App\Models\TipUlogeKorisnika;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Korisnik>
 */
class KorisnikFactory extends Factory
{
    protected $model = Korisnik::class;

    public function definition(): array
    {
        return [
            'ime'                    => fake()->firstName(),
            'prezime'                => fake()->lastName(),
            'broj_indeksa'           => fake()->unique()->numerify('##/####'),
            'email'                  => fake()->unique()->numerify('k####@example.com'),
            'datum_verifikacije'     => now(),
            'sifra'                  => Hash::make('lozinka123'),
            'godina'                 => fake()->numberBetween(1, 4),
            'tip_uloge_korisnika_id' => self::ulogaId('Gost'),
        ];
    }

    /**
     * Korisnik sa ulogom Admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'tip_uloge_korisnika_id' => self::ulogaId('Admin'),
        ]);
    }

    /**
     * Korisnik sa ulogom Gost.
     */
    public function gost(): static
    {
        return $this->state(fn (array $attributes) => [
            'tip_uloge_korisnika_id' => self::ulogaId('Gost'),
        ]);
    }

    /**
     * Korisnik sa ulogom Predstavnik parlamenta.
     */
    public function predstavnik(): static
    {
        return $this->state(fn (array $attributes) => [
            'tip_uloge_korisnika_id' => self::ulogaId('Predstavnik parlamenta'),
        ]);
    }

    /**
     * Neverifikovan korisnik.
     */
    public function neverifikovan(): static
    {
        return $this->state(fn (array $attributes) => [
            'datum_verifikacije' => null,
        ]);
    }

    /**
     * Vraća (i po potrebi kreira) id tipa uloge sa datim nazivom.
     */
    protected static function ulogaId(string $naziv): int
    {
        return TipUlogeKorisnika::firstOrCreate(['naziv' => $naziv])->id;
    }
}
