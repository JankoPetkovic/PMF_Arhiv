<?php

namespace Tests\Feature;

use App\Models\Korisnik;
use App\Models\Materijal;
use App\Models\PodtipMaterijala;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KontrolerMaterijalaUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_vraca_422_kada_nedostaje_podtip_materijala_id(): void
    {
        $vlasnik = Korisnik::factory()->gost()->create();
        $materijal = Materijal::factory()->create(['korisnik_id' => $vlasnik->korisnik_id]);

        $odgovor = $this->actingAs($vlasnik)->putJson(
            route('materijali.update', ['materijali' => $materijal->materijal_id]),
            [
                'naziv'         => 'Novi naziv',
                'predmet_id'    => $materijal->predmet_id,
                // podtipMaterijala objekat BEZ podtip_materijala_id -> bag koji testiramo
                'podtipMaterijala' => ['naziv' => 'Neki podtip'],
                'skolskaGodina' => '2023/2024',
            ]
        );

        $odgovor->assertStatus(422);
        $odgovor->assertJsonValidationErrors('podtipMaterijala.podtip_materijala_id');
    }

    public function test_update_uspesno_menja_naziv_uz_validan_podtip(): void
    {
        $vlasnik = Korisnik::factory()->gost()->create();
        $materijal = Materijal::factory()->create(['korisnik_id' => $vlasnik->korisnik_id]);
        $podtip = PodtipMaterijala::factory()->create();

        $odgovor = $this->actingAs($vlasnik)->putJson(
            route('materijali.update', ['materijali' => $materijal->materijal_id]),
            [
                'naziv'         => 'Izmenjeni naziv',
                'predmet_id'    => $materijal->predmet_id,
                'podtipMaterijala' => ['podtip_materijala_id' => $podtip->podtip_materijala_id],
                'skolskaGodina' => '2024/2025',
            ]
        );

        $odgovor->assertOk();

        $this->assertDatabaseHas('materijal', [
            'materijal_id'        => $materijal->materijal_id,
            'naziv'               => 'Izmenjeni naziv',
            'podtip_materijala_id' => $podtip->podtip_materijala_id,
            'skolska_godina'      => '2024/2025',
        ]);
    }

    public function test_update_vraca_403_za_gosta_koji_nije_vlasnik(): void
    {
        $vlasnik = Korisnik::factory()->gost()->create();
        $drugiGost = Korisnik::factory()->gost()->create();
        $materijal = Materijal::factory()->create(['korisnik_id' => $vlasnik->korisnik_id]);
        $podtip = PodtipMaterijala::factory()->create();

        $odgovor = $this->actingAs($drugiGost)->putJson(
            route('materijali.update', ['materijali' => $materijal->materijal_id]),
            [
                'naziv'         => 'Pokusaj izmene',
                'predmet_id'    => $materijal->predmet_id,
                'podtipMaterijala' => ['podtip_materijala_id' => $podtip->podtip_materijala_id],
                'skolskaGodina' => '2024/2025',
            ]
        );

        $odgovor->assertStatus(403);

        // Naziv u bazi nije promenjen
        $this->assertDatabaseMissing('materijal', [
            'materijal_id' => $materijal->materijal_id,
            'naziv'        => 'Pokusaj izmene',
        ]);
    }
}
