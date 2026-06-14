<?php

namespace Tests\Feature;

use App\Models\Korisnik;
use App\Models\ParlamentObjava;
use App\Models\Anketa;
use App\Models\AnketaPitanje;
use App\Models\AnketaOpcija;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KontrolerAnketeTest extends TestCase
{
    use RefreshDatabase;

    /** Kreira anketu sa jednim jednostrukim pitanjem (preko modela, za setup). */
    private function napraviAnketu(?string $rok = null, bool $dozvoliVise = false): array
    {
        $objava = ParlamentObjava::factory()->create();
        $anketa = Anketa::create([
            'parlament_objava_id' => $objava->parlament_objava_id,
            'naslov'              => 'Test anketa',
            'rok_trajanja'        => $rok,
            'dozvoli_vise'        => $dozvoliVise,
        ]);
        $pitanje = AnketaPitanje::create([
            'anketa_id' => $anketa->anketa_id,
            'tekst'     => 'Da li podržavaš?',
            'tip'       => 'jednostruki',
            'obavezno'  => true,
            'redosled'  => 0,
        ]);
        $opcija = AnketaOpcija::create(['pitanje_id' => $pitanje->pitanje_id, 'tekst' => 'Da', 'redosled' => 0]);

        return compact('objava', 'anketa', 'pitanje', 'opcija');
    }

    private function validanOdgovor(int $pitanjeId, int $opcijaId, string $email = 'student@example.com'): array
    {
        return [
            'ime'          => 'Pera',
            'prezime'      => 'Perić',
            'email'        => $email,
            'broj_indeksa' => '123/2020',
            'odgovori'     => [
                ['pitanje_id' => $pitanjeId, 'opcija_ids' => [$opcijaId], 'slobodan_tekst' => ''],
            ],
        ];
    }

    public function test_predstavnik_kreira_anketu_na_objavi(): void
    {
        $predstavnik = Korisnik::factory()->predstavnik()->create();
        $objava = ParlamentObjava::factory()->create();

        $this->actingAs($predstavnik)->postJson("/parlament/{$objava->parlament_objava_id}/anketa", [
            'naslov'  => 'Anketa',
            'pitanja' => [
                ['tekst' => 'Pitanje 1', 'tip' => 'jednostruki', 'obavezno' => true,
                 'opcije' => [['tekst' => 'A'], ['tekst' => 'B']]],
            ],
        ])->assertStatus(201);

        $this->assertDatabaseHas('anketa', ['parlament_objava_id' => $objava->parlament_objava_id]);
        $this->assertDatabaseHas('anketa_pitanje', ['tekst' => 'Pitanje 1']);
        $this->assertDatabaseHas('anketa_opcija', ['tekst' => 'A']);
    }

    public function test_nepredstavnik_ne_moze_kreirati_anketu(): void
    {
        $gost = Korisnik::factory()->gost()->create();
        $objava = ParlamentObjava::factory()->create();

        $this->actingAs($gost)->postJson("/parlament/{$objava->parlament_objava_id}/anketa", [
            'pitanja' => [['tekst' => 'X', 'tip' => 'slobodan']],
        ])->assertStatus(403);
    }

    public function test_kreiranje_sa_rokom_u_proslosti_je_422(): void
    {
        $predstavnik = Korisnik::factory()->predstavnik()->create();
        $objava = ParlamentObjava::factory()->create();

        $this->actingAs($predstavnik)->postJson("/parlament/{$objava->parlament_objava_id}/anketa", [
            'rok_trajanja' => now()->subDay()->toDateTimeString(),
            'pitanja'      => [['tekst' => 'X', 'tip' => 'slobodan']],
        ])->assertStatus(422);
    }

    public function test_javno_slanje_validnog_odgovora(): void
    {
        ['anketa' => $a, 'pitanje' => $p, 'opcija' => $o] = $this->napraviAnketu();

        $this->postJson("/anketa/{$a->anketa_id}/odgovor", $this->validanOdgovor($p->pitanje_id, $o->opcija_id))
            ->assertStatus(201);

        $this->assertDatabaseHas('anketa_odgovor', ['anketa_id' => $a->anketa_id, 'email' => 'student@example.com']);
        $this->assertDatabaseHas('anketa_odgovor_stavka', ['pitanje_id' => $p->pitanje_id, 'opcija_id' => $o->opcija_id]);
    }

    public function test_slanje_na_isteklu_anketu_je_422(): void
    {
        ['anketa' => $a, 'pitanje' => $p, 'opcija' => $o] = $this->napraviAnketu(now()->subDay()->toDateTimeString());

        $this->postJson("/anketa/{$a->anketa_id}/odgovor", $this->validanOdgovor($p->pitanje_id, $o->opcija_id))
            ->assertStatus(422);
    }

    public function test_dupli_email_vraca_409(): void
    {
        ['anketa' => $a, 'pitanje' => $p, 'opcija' => $o] = $this->napraviAnketu();

        $this->postJson("/anketa/{$a->anketa_id}/odgovor", $this->validanOdgovor($p->pitanje_id, $o->opcija_id))
            ->assertStatus(201);

        $this->postJson("/anketa/{$a->anketa_id}/odgovor", $this->validanOdgovor($p->pitanje_id, $o->opcija_id))
            ->assertStatus(409);
    }

    public function test_dozvoli_vise_dozvoljava_vise_popunjavanja_istim_emailom(): void
    {
        ['anketa' => $a, 'pitanje' => $p, 'opcija' => $o] = $this->napraviAnketu(null, true);

        $this->postJson("/anketa/{$a->anketa_id}/odgovor", $this->validanOdgovor($p->pitanje_id, $o->opcija_id))
            ->assertStatus(201);
        // Drugi put istim emailom — sada prolazi jer je dozvoljeno više puta.
        $this->postJson("/anketa/{$a->anketa_id}/odgovor", $this->validanOdgovor($p->pitanje_id, $o->opcija_id))
            ->assertStatus(201);

        $this->assertEquals(2, \App\Models\AnketaOdgovor::where('anketa_id', $a->anketa_id)->count());
    }

    public function test_obavezno_pitanje_bez_odgovora_je_422(): void
    {
        ['anketa' => $a, 'pitanje' => $p] = $this->napraviAnketu();

        $this->postJson("/anketa/{$a->anketa_id}/odgovor", [
            'ime' => 'Pera', 'prezime' => 'Perić', 'email' => 's@example.com', 'broj_indeksa' => '1/2',
            'odgovori' => [['pitanje_id' => $p->pitanje_id, 'opcija_ids' => [], 'slobodan_tekst' => '']],
        ])->assertStatus(422);
    }

    public function test_eksport_rezultata_radi_za_predstavnika(): void
    {
        ['anketa' => $a, 'pitanje' => $p, 'opcija' => $o] = $this->napraviAnketu();
        $this->postJson("/anketa/{$a->anketa_id}/odgovor", $this->validanOdgovor($p->pitanje_id, $o->opcija_id));

        $predstavnik = Korisnik::factory()->predstavnik()->create();
        $this->actingAs($predstavnik)->get("/anketa/{$a->anketa_id}/rezultati")
            ->assertStatus(200)
            ->assertDownload();
    }

    public function test_eksport_nepredstavnik_je_403(): void
    {
        ['anketa' => $a] = $this->napraviAnketu();
        $gost = Korisnik::factory()->gost()->create();

        $this->actingAs($gost)->get("/anketa/{$a->anketa_id}/rezultati")->assertStatus(403);
    }
}
