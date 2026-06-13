<?php

namespace Tests\Feature;

use App\Http\Controllers\KontrolerDriveImporta;
use App\Models\Korisnik;
use App\Models\Materijal;
use App\Models\Predmet;
use App\Models\Smer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KontrolerDriveImportaTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Veže testabilnu verziju kontrolera koja ne dira pravi Google Drive,
     * već vraća unapred zadatu listu fajlova.
     *
     * @param array<int, array{id:string,naziv:string,velicina:int,putanja:string}> $fajlovi
     */
    private function vezi(array $fajlovi): void
    {
        $this->app->bind(KontrolerDriveImporta::class, function () use ($fajlovi) {
            return new class($fajlovi) extends KontrolerDriveImporta {
                public function __construct(private array $fajlovi) {}

                protected function napraviDriveKlijent(): \Google\Service\Drive
                {
                    // Vraćamo prazan objekat bez ikakvih mrežnih poziva;
                    // listaFajlova ga ionako ignoriše.
                    return (new \ReflectionClass(\Google\Service\Drive::class))
                        ->newInstanceWithoutConstructor();
                }

                protected function listaFajlova(\Google\Service\Drive $drive, string $folderId, string $putanja = ''): array
                {
                    return $this->fajlovi;
                }
            };
        });
    }

    public function test_vraca_403_za_ne_admina(): void
    {
        $gost = Korisnik::factory()->gost()->create();

        $this->vezi([]);

        $odgovor = $this->actingAs($gost)->getJson('/admin/drive/fajlovi?folder_id=abc');

        $odgovor->assertStatus(403);
    }

    public function test_vec_postoji_true_samo_uz_isto_ime_i_isti_predmet(): void
    {
        $admin = Korisnik::factory()->admin()->create();

        // Dva predmeta na istom smeru, ista godina, slični nazivi da se "pogodi" pravi.
        $smer = Smer::factory()->create();
        $analiza = Predmet::factory()->create([
            'naziv'   => 'Analiza',
            'godina'  => 1,
            'smer_id' => $smer->smer_id,
        ]);
        $algebra = Predmet::factory()->create([
            'naziv'   => 'Algebra',
            'godina'  => 1,
            'smer_id' => $smer->smer_id,
        ]);

        // Postojeći materijal: ime "skripta.pdf" vezan za predmet Analiza.
        Materijal::factory()->create([
            'naziv'      => 'skripta.pdf',
            'predmet_id' => $analiza->predmet_id,
        ]);

        // Fajl iz foldera čiji put sugeriše predmet "Analiza" -> isti predmet i isto ime => duplikat.
        // Fajl koji se zove isto ali bi se pogodio drugi predmet -> nije duplikat.
        $this->vezi([
            ['id' => 'f1', 'naziv' => 'skripta.pdf', 'velicina' => 10, 'putanja' => '1. godina/Analiza'],
            ['id' => 'f2', 'naziv' => 'skripta.pdf', 'velicina' => 10, 'putanja' => '1. godina/Algebra'],
        ]);

        $odgovor = $this->actingAs($admin)->getJson('/admin/drive/fajlovi?folder_id=root');

        $odgovor->assertOk();
        $podaci = $odgovor->json();

        $poId = collect($podaci['fajlovi'])->keyBy('drive_id');

        // f1 pogađa Analizu (isti predmet i isto ime) -> vec_postoji = true
        $this->assertSame($analiza->predmet_id, $poId['f1']['predlozen_predmet']['predmet_id']);
        $this->assertTrue($poId['f1']['vec_postoji']);

        // f2 pogađa Algebru -> drugi predmet, pa nije duplikat
        $this->assertSame($algebra->predmet_id, $poId['f2']['predlozen_predmet']['predmet_id']);
        $this->assertFalse($poId['f2']['vec_postoji']);
    }

    public function test_smer_id_ogranicava_predmete_i_pogadanje(): void
    {
        $admin = Korisnik::factory()->admin()->create();

        $smerA = Smer::factory()->create();
        $smerB = Smer::factory()->create();

        // Isti naziv predmeta na oba smera.
        $predmetA = Predmet::factory()->create([
            'naziv'   => 'Analiza',
            'godina'  => 1,
            'smer_id' => $smerA->smer_id,
        ]);
        Predmet::factory()->create([
            'naziv'   => 'Analiza',
            'godina'  => 1,
            'smer_id' => $smerB->smer_id,
        ]);

        $this->vezi([
            ['id' => 'f1', 'naziv' => 'gradivo.pdf', 'velicina' => 5, 'putanja' => '1. godina/Analiza'],
        ]);

        $odgovor = $this->actingAs($admin)->getJson('/admin/drive/fajlovi?folder_id=root&smer_id=' . $smerA->smer_id);

        $odgovor->assertOk();
        $podaci = $odgovor->json();

        // Svi vraćeni predmeti pripadaju traženom smeru.
        $smeroviPredmeta = collect($podaci['predmeti'])->pluck('smer_id')->unique()->values()->all();
        $this->assertSame([$smerA->smer_id], $smeroviPredmeta);

        // Pogađanje je ograničeno na smer A.
        $this->assertSame(
            $predmetA->predmet_id,
            $podaci['fajlovi'][0]['predlozen_predmet']['predmet_id']
        );
    }
}
