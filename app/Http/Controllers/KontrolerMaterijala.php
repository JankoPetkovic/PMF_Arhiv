<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;


use App\Models\Materijal;
use App\Models\OcenaMaterijala;
use App\Models\Korisnik;
use App\Mail\PrijaviMaterijal;
use Inertia\Inertia;

class KontrolerMaterijala extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $zahtev){
        try {
            if ($zahtev->has('stranica')) {
                $zahtev->merge(['page' => $zahtev->get('stranica')]);
            }

            $validiraniPodaci = $zahtev->validate([
                'podtip_materijala_id' => 'sometimes',
                'tip_materijala_id'    => 'sometimes',
                'predmet_id'           => 'sometimes',
                'smer_id'              => 'sometimes',
                'godina'               => 'sometimes',
                'korisnik_id'          => 'sometimes',
                'skolska_godina'       => 'sometimes|string|max:20',
                'pretraga'             => 'sometimes|string|max:255',
                'kolonaSortiranja'     => 'sometimes|in:naziv,datum_dodavanja',
                'pravacSortiranja'     => 'sometimes|in:asc,desc',
                'poStranici'           => 'sometimes|integer|min:1|max:100',
            ]);

            $materijali = Materijal::filtriraj($validiraniPodaci);

            return response()->json($materijali);

        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'error' => 'Nevalidan unos.',
                'detalji' => $ve->errors()
            ], 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $mnfe) {
            return response()->json([
                'error' => 'Neki entitet nije pronađen u bazi.',
            ], 404);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Došlo je do nepredviđene greške.',
                'detalji' => $e->getMessage(),
            ], 500);
        }
    }


    // Pomoćna: očisti segment putanje/naziva za bezbedan unos u ZIP.
    private function ocistiZaPutanju(string $tekst): string
    {
        $tekst = str_replace(['/', '\\'], '-', $tekst);
        return trim($tekst) ?: 'nepoznato';
    }

    /**
     * Eksport SVIH materijala koji odgovaraju filterima kao ZIP arhiva.
     */
    public function eksportujMaterijale(Request $zahtev)
    {
        $validiraniPodaci = $zahtev->validate([
            'podtip_materijala_id' => 'sometimes',
            'tip_materijala_id'    => 'sometimes',
            'predmet_id'           => 'sometimes',
            'smer_id'              => 'sometimes',
            'godina'               => 'sometimes',
            'korisnik_id'          => 'sometimes',
            'skolska_godina'       => 'sometimes|string|max:20',
            'pretraga'             => 'sometimes|string|max:255',
        ]);

        if (!\class_exists(\ZipArchive::class)) {
            return response()->json(['message' => 'ZIP nije podržan na serveru (php-zip ekstenzija).'], 500);
        }

        try {
            $materijali = Materijal::zaEksport($validiraniPodaci);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        if ($materijali->isEmpty()) {
            return response()->json(['message' => 'Nema materijala za izabrane filtere.'], 404);
        }

        set_time_limit(300);

        $tmp = tempnam(sys_get_temp_dir(), 'mat_zip_');
        $zip = new \ZipArchive();
        if ($zip->open($tmp, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            @unlink($tmp);
            return response()->json(['message' => 'Greška pri kreiranju arhive.'], 500);
        }

        $dodato = 0;
        foreach ($materijali as $m) {
            $putanja = $m->vratiPutanju();
            if (!Storage::disk('public')->exists($putanja)) {
                continue;
            }

            $predmet = $this->ocistiZaPutanju($m->predmet->naziv ?? 'Bez predmeta');
            $tip     = $this->ocistiZaPutanju($m->podtipMaterijala->tip->naziv ?? 'Ostalo');
            $podtip  = $this->ocistiZaPutanju($m->podtipMaterijala->naziv ?? '');

            $folder  = $predmet . '/' . $tip . ($podtip !== 'nepoznato' ? ' - ' . $podtip : '');
            $imeUZipu = $folder . '/' . $m->materijal_id . '_' . $m->naziv;

            $zip->addFile(Storage::disk('public')->path($putanja), $imeUZipu);
            $dodato++;
        }

        $zip->close();

        if ($dodato === 0) {
            @unlink($tmp);
            return response()->json(['message' => 'Nijedan fajl nije dostupan za eksport.'], 404);
        }

        $imeArhive = 'materijali_' . date('Ymd_His') . '.zip';

        return response()->download($tmp, $imeArhive, [
            'Content-Type' => 'application/zip',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $zahtev){
       try {
            $validiraniPodaci = $zahtev->validate([
                'departman' => ['required'],
                'nivoStudija' => ['required'],
                'smer' => ['required'],
                'godina' => ['required'],
                'predmet' => ['required'],
                'tipMaterijala' => ['required'],
                'podtipMaterijala' => ['required'],
                'akademskaGodina' => ['required'],
                'fajl' => ['required', 'file', 'mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,text/plain,application/vnd.oasis.opendocument.text,image/png,image/jpeg', 'max:51200'],
            ]);

            $departman = json_decode($zahtev->input('departman'), true);
            $nivoStudija = json_decode($zahtev->input('nivoStudija'), true);
            $smer = json_decode($zahtev->input('smer'), true);
            $godina = json_decode($zahtev->input('godina'), true);
            $predmet = json_decode($zahtev->input('predmet'), true);
            $tipMaterijala = json_decode($zahtev->input('tipMaterijala'), true);
            $podtipMaterijala = json_decode($zahtev->input('podtipMaterijala'), true);
            $akademskaGodina = str_replace('/', '-', $zahtev->input('akademskaGodina'));
            $korisnickiMejl = $zahtev->input('korisnickiMejl');
            $fajl = $zahtev->file('fajl');

            if(Auth::check()){
                /** @var \App\Models\Korisnik $prijavljenKorisnik */
                $prijavljenKorisnik = Auth::user();
            } else{
                return response()->json([
                    'message' => 'Korisnik mora biti prijavljen',
                ], 401);
            }
            
            
            $verifikacijaKorisnika = $prijavljenKorisnik->statusVerifikacije();

            if(($korisnickiMejl != $prijavljenKorisnik->email) || (!$verifikacijaKorisnika['verifikovan'])){
                return response()->json([
                    'message' => 'Neovlašćeni korisnik',
                ], 401);
            }

            return Materijal::sacuvajMaterijala(
                $korisnickiMejl,
                $departman,
                $nivoStudija,
                $smer,
                $godina,
                $predmet,
                $tipMaterijala,
                $podtipMaterijala,
                $akademskaGodina,
                $fajl
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Neispravni podaci.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\JsonException | \ErrorException $e) {
            return response()->json([
                'message' => 'Greška u obradi podataka. Proveri format vrednosti.',
            ], 400);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Došlo je do interne greške. Pokušaj ponovo kasnije.',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id){
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Korisnik nije prijavljen'], 401);
        }

        $materijal = Materijal::findOrFail($id);
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();

        if ($materijal->korisnik_id != $prijavljenKorisnik->korisnik_id && $prijavljenKorisnik->uloga == "Gost") {
            return response()->json(['message' => 'Neovlašćeni korisnik'], 403);
        }

        return response()->json($materijal);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $zahtev, string $id)
    {
        try {
            $validiraniPodaci = $zahtev->validate([
                'naziv'        => ['required', 'string', 'max:255'],
                'predmet_id'   => ['required', 'integer'],
                'podtipMaterijala'              => ['required', 'array'],
                'podtipMaterijala.podtip_materijala_id' => ['required', 'integer'],
                'skolskaGodina' => ['required', 'string', 'max:20'],
            ]);

            if (!Auth::check()) {
                return response()->json([
                    'message' => 'Korisnik mora biti prijavljen',
                ], 401);
            }

            $materijal = Materijal::findOrFail($id);

            /** @var \App\Models\Korisnik $prijavljenKorisnik */
            $prijavljenKorisnik = Auth::user();

            if ($materijal->korisnik_id != $prijavljenKorisnik->korisnik_id
                && $prijavljenKorisnik->uloga == "Gost") {

                return response()->json([
                    'message' => 'Neovlašćeni korisnik',
                ], 403);
            }

            // Putanja fajla pre izmene (zavisi od predmeta, podtipa, naziva i školske godine).
            $staraPutanja = $materijal->vratiPutanju();

            $materijal->naziv               = $validiraniPodaci['naziv'];
            $materijal->predmet_id          = $validiraniPodaci['predmet_id'];
            $materijal->podtip_materijala_id = $validiraniPodaci['podtipMaterijala']['podtip_materijala_id'];
            $materijal->skolska_godina      = $validiraniPodaci['skolskaGodina'];

            $materijal->save();

            // Posle izmene metapodataka fajl mora da pređe na novu lokaciju koja
            // odgovara novom predmetu/podtipu/nazivu, da bi se poklapao sa vratiPutanju().
            $materijal->premestiFajlNaNovuPutanju($staraPutanja);

            $prijavljenKorisnik->zabeleziAkcijuKorisnika('Ažuriranje', "Izmenjen materijal: {$materijal->materijal_id}");

            return response()->json([
                'message' => 'Uspešno ažurirano.',
                'materijal' => $materijal
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Neispravni podaci.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\JsonException | \ErrorException $e) {
            return response()->json([
                'message' => 'Greška u obradi podataka. Proveri format vrednosti.',
            ], 400);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Došlo je do interne greške. Pokušaj ponovo kasnije.',
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if(Auth::check()){
            $materijal = Materijal::findOrFail($id);
            /** @var \App\Models\Korisnik $prijavljenKorisnik */
            $prijavljenKorisnik = Auth::user();
            if($materijal->korisnik_id != $prijavljenKorisnik->korisnik_id && $prijavljenKorisnik->uloga == "Gost"){
                return response()->json([
                    'message' => 'Neovlašćeni korisnik',
                ], 401); 
            }

            $materijal->delete();
            $prijavljenKorisnik->zabeleziAkcijuKorisnika("Brisanje", "Korisnik je obrisao materijal: ". $materijal->materijal_id);
            return response()->json([
                'message' => 'Materijal obrisan',
            ], 204); 
        } else {
            return response()->json([
                'message' => 'Korisnik nije prijavljen',
            ], 401); 
        }
        
    }

    /**
     * Kratak link za deljenje materijala.
     * Ruta: GET /m/{id}/{slug?} (ime: materijali.deli).
     * Slug je samo kozmetički (radi SEO/čitljivosti URL-a) i ne utiče na rezultat.
     * Servira fajl materijala sa public diska.
     */
    public function deli(string $id, ?string $slug = null)
    {
        $materijal = Materijal::findOrFail($id);

        $putanja = $materijal->vratiPutanju();

        if (!Storage::disk('public')->exists($putanja)) {
            abort(404);
        }

        return Storage::disk('public')->response($putanja, $materijal->naziv);
    }

    /**
     * Ocenjivanje materijala (1–5). Jedan korisnik = jedna ocena (upsert).
     */
    public function oceni(Request $zahtev, string $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Korisnik mora biti prijavljen'], 401);
        }

        $validirano = $zahtev->validate([
            'ocena' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        $materijal = Materijal::find($id);
        if (!$materijal) {
            return response()->json(['message' => 'Materijal nije pronađen'], 404);
        }

        OcenaMaterijala::updateOrCreate(
            ['materijal_id' => $materijal->materijal_id, 'korisnik_id' => Auth::id()],
            ['ocena' => $validirano['ocena'], 'datum' => now()]
        );

        $prosek = OcenaMaterijala::where('materijal_id', $materijal->materijal_id)->avg('ocena');
        $broj   = OcenaMaterijala::where('materijal_id', $materijal->materijal_id)->count();

        return response()->json([
            'prosecna_ocena' => $prosek !== null ? round((float) $prosek, 2) : 0,
            'broj_ocena'     => $broj,
            'moja_ocena'     => (int) $validirano['ocena'],
        ], 200);
    }

    /**
     * Šalje mejl administratorima da provere prijavu.
     */
    public function prijaviMaterijal(Request $zahtev){
        if(Auth::check()){
            $prijavljenKorisnik = Auth::user();
            $materijalId = $zahtev->input('materijalId');
            $opisPrijave = $zahtev->input('opisPrijave');

            Mail::to('jankopetkovic@pmf-arhiv.com')->send(new PrijaviMaterijal($prijavljenKorisnik->email, $materijalId, $opisPrijave));

            return response()->json(['message' => 'Mejl uspešno poslat!']);
        } else {
            return response()->json([
                'message' => 'Korisnik nije prijavljen',
            ], 401);
        }
    }

}
