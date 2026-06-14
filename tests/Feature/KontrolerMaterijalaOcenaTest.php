<?php

namespace Tests\Feature;

use App\Models\Korisnik;
use App\Models\Materijal;
use App\Models\OcenaMaterijala;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KontrolerMaterijalaOcenaTest extends TestCase
{
    use RefreshDatabase;

    public function test_prijavljen_korisnik_moze_da_oceni(): void
    {
        $korisnik = Korisnik::factory()->gost()->create();
        $materijal = Materijal::factory()->create();

        $odgovor = $this->actingAs($korisnik)
            ->postJson("/materijali/{$materijal->materijal_id}/ocena", ['ocena' => 4]);

        $odgovor->assertOk()
            ->assertJson(['prosecna_ocena' => 4, 'broj_ocena' => 1, 'moja_ocena' => 4]);

        $this->assertDatabaseHas('ocena_materijala', [
            'materijal_id' => $materijal->materijal_id,
            'korisnik_id'  => $korisnik->korisnik_id,
            'ocena'        => 4,
        ]);
    }

    public function test_ponovna_ocena_azurira_a_ne_duplira(): void
    {
        $korisnik = Korisnik::factory()->gost()->create();
        $materijal = Materijal::factory()->create();

        $this->actingAs($korisnik)->postJson("/materijali/{$materijal->materijal_id}/ocena", ['ocena' => 5]);
        $this->actingAs($korisnik)->postJson("/materijali/{$materijal->materijal_id}/ocena", ['ocena' => 2])
            ->assertJson(['prosecna_ocena' => 2, 'broj_ocena' => 1, 'moja_ocena' => 2]);

        $this->assertEquals(1, OcenaMaterijala::where('materijal_id', $materijal->materijal_id)->count());
    }

    public function test_prosek_vise_korisnika(): void
    {
        $materijal = Materijal::factory()->create();
        $a = Korisnik::factory()->gost()->create();
        $b = Korisnik::factory()->gost()->create();

        $this->actingAs($a)->postJson("/materijali/{$materijal->materijal_id}/ocena", ['ocena' => 5]);
        $this->actingAs($b)->postJson("/materijali/{$materijal->materijal_id}/ocena", ['ocena' => 3])
            ->assertJson(['prosecna_ocena' => 4, 'broj_ocena' => 2]);
    }

    public function test_neulogovan_ne_moze_da_oceni(): void
    {
        $materijal = Materijal::factory()->create();

        $this->postJson("/materijali/{$materijal->materijal_id}/ocena", ['ocena' => 4])
            ->assertStatus(401);
    }

    public function test_nevalidna_ocena_je_422(): void
    {
        $korisnik = Korisnik::factory()->gost()->create();
        $materijal = Materijal::factory()->create();

        $this->actingAs($korisnik)
            ->postJson("/materijali/{$materijal->materijal_id}/ocena", ['ocena' => 6])
            ->assertStatus(422);
    }
}
