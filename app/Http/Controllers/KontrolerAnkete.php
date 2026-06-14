<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ParlamentObjava;
use App\Models\Anketa;
use App\Models\AnketaPitanje;
use App\Models\AnketaOpcija;
use App\Models\AnketaOdgovor;
use App\Models\AnketaOdgovorStavka;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class KontrolerAnkete extends Controller
{
    private function jePredstavnik(): bool
    {
        /** @var \App\Models\Korisnik|null $k */
        $k = Auth::user();
        // Admin je superuser — može sve što i predstavnik parlamenta.
        return $k && $k->tipUloge
            && in_array($k->tipUloge->naziv, ['Predstavnik parlamenta', 'Admin'], true);
    }

    /**
     * Kreira ili zamenjuje anketu na datoj objavi (samo predstavnik).
     */
    public function sacuvaj(Request $zahtev, string $objavaId)
    {
        if (!$this->jePredstavnik()) {
            return response()->json(['message' => 'Samo predstavnik parlamenta može da kreira ankete'], 403);
        }

        $objava = ParlamentObjava::find($objavaId);
        if (!$objava) {
            return response()->json(['message' => 'Objava nije pronađena'], 404);
        }

        $podaci = $zahtev->validate([
            'naslov'                    => ['nullable', 'string', 'max:255'],
            'rok_trajanja'              => ['nullable', 'date', 'after:now'],
            'dozvoli_vise'              => ['sometimes', 'boolean'],
            'pitanja'                   => ['required', 'array', 'min:1'],
            'pitanja.*.tekst'           => ['required', 'string', 'max:500'],
            'pitanja.*.tip'             => ['required', 'in:jednostruki,visestruki,slobodan'],
            'pitanja.*.dozvoli_drugo'   => ['sometimes', 'boolean'],
            'pitanja.*.obavezno'        => ['sometimes', 'boolean'],
            'pitanja.*.opcije'          => ['array'],
            'pitanja.*.opcije.*.tekst'  => ['required_with:pitanja.*.opcije', 'string', 'max:255'],
        ]);

        // Choice pitanja moraju imati bar jednu opciju.
        foreach ($podaci['pitanja'] as $i => $p) {
            if ($p['tip'] !== 'slobodan' && empty($p['opcije'])) {
                return response()->json([
                    'message' => "Pitanje #" . ($i + 1) . " mora imati bar jednu opciju.",
                ], 422);
            }
        }

        DB::transaction(function () use ($objava, $podaci) {
            // Zameni postojeću anketu (cascade briše pitanja/opcije/odgovore).
            Anketa::where('parlament_objava_id', $objava->parlament_objava_id)->delete();

            $anketa = Anketa::create([
                'parlament_objava_id' => $objava->parlament_objava_id,
                'naslov'              => $podaci['naslov'] ?? null,
                'rok_trajanja'        => $podaci['rok_trajanja'] ?? null,
                'dozvoli_vise'        => $podaci['dozvoli_vise'] ?? false,
            ]);

            foreach ($podaci['pitanja'] as $iP => $p) {
                $pitanje = AnketaPitanje::create([
                    'anketa_id'     => $anketa->anketa_id,
                    'tekst'         => $p['tekst'],
                    'tip'           => $p['tip'],
                    'dozvoli_drugo' => $p['dozvoli_drugo'] ?? false,
                    'obavezno'      => $p['obavezno'] ?? true,
                    'redosled'      => $iP,
                ]);

                if ($p['tip'] !== 'slobodan') {
                    foreach (($p['opcije'] ?? []) as $iO => $o) {
                        AnketaOpcija::create([
                            'pitanje_id' => $pitanje->pitanje_id,
                            'tekst'      => $o['tekst'],
                            'redosled'   => $iO,
                        ]);
                    }
                }
            }
        });

        /** @var \App\Models\Korisnik $k */
        $k = Auth::user();
        $k->zabeleziAkcijuKorisnika('Kreiranje', "Kreirana anketa na objavi: {$objava->parlament_objava_id}");

        $objava->load('anketa.pitanja.opcije');
        return response()->json(['message' => 'Anketa sačuvana', 'anketa' => $objava->anketa->zaPrikaz()], 201);
    }

    public function obrisi(string $objavaId)
    {
        if (!$this->jePredstavnik()) {
            return response()->json(['message' => 'Samo predstavnik parlamenta može da briše ankete'], 403);
        }

        Anketa::where('parlament_objava_id', $objavaId)->delete();
        return response()->json(['message' => 'Anketa obrisana'], 200);
    }

    /**
     * Slanje odgovora na anketu (javno dostupno svim studentima).
     */
    public function posaljiOdgovor(Request $zahtev, string $anketaId)
    {
        $anketa = Anketa::with('pitanja.opcije')->find($anketaId);
        if (!$anketa) {
            return response()->json(['message' => 'Anketa nije pronađena'], 404);
        }
        if ($anketa->jeIstekla()) {
            return response()->json(['message' => 'Rok za popunjavanje ankete je istekao.'], 422);
        }

        // Ako nije dozvoljeno više popunjavanja — proveri da li je već glasao
        // (po emailu iz forme ili po nalogu ako je ulogovan).
        if (!$anketa->dozvoli_vise) {
            $email = $zahtev->input('email');
            $vec = AnketaOdgovor::where('anketa_id', $anketa->anketa_id)
                ->where(function ($q) use ($email) {
                    $q->where('email', $email);
                    if (Auth::check()) $q->orWhere('korisnik_id', Auth::id());
                })->exists();
            if ($vec) {
                return response()->json(['message' => 'Već ste popunili ovu anketu.'], 409);
            }
        }

        $podaci = $zahtev->validate([
            'ime'                   => ['required', 'string', 'max:100'],
            'prezime'               => ['required', 'string', 'max:100'],
            'email'                 => ['required', 'email', 'max:150'],
            'broj_indeksa'          => ['required', 'string', 'max:50'],
            'odgovori'              => ['required', 'array'],
            'odgovori.*.pitanje_id' => ['required', 'integer'],
            'odgovori.*.opcija_ids' => ['array'],
            'odgovori.*.opcija_ids.*' => ['integer'],
            'odgovori.*.slobodan_tekst' => ['nullable', 'string', 'max:2000'],
        ]);

        // Indeksiraj poslate odgovore po pitanju.
        $poPitanju = [];
        foreach ($podaci['odgovori'] as $o) {
            $poPitanju[$o['pitanje_id']] = $o;
        }

        // Validni opcija_id-evi po pitanju (da se ne podmetne tuđa opcija).
        $validneOpcije = [];
        foreach ($anketa->pitanja as $p) {
            $validneOpcije[$p->pitanje_id] = $p->opcije->pluck('opcija_id')->all();
        }

        // Provera obaveznih pitanja.
        foreach ($anketa->pitanja as $p) {
            if (!$p->obavezno) continue;
            $o = $poPitanju[$p->pitanje_id] ?? null;
            $imaIzbor = $o && !empty($o['opcija_ids']);
            $imaTekst = $o && trim($o['slobodan_tekst'] ?? '') !== '';
            if (!$imaIzbor && !$imaTekst) {
                return response()->json(['message' => "Pitanje '{$p->tekst}' je obavezno."], 422);
            }
        }

        try {
            DB::transaction(function () use ($anketa, $podaci, $poPitanju, $validneOpcije) {
                $odgovor = AnketaOdgovor::create([
                    'anketa_id'    => $anketa->anketa_id,
                    'korisnik_id'  => Auth::id(),
                    'ime'          => $podaci['ime'],
                    'prezime'      => $podaci['prezime'],
                    'email'        => $podaci['email'],
                    'broj_indeksa' => $podaci['broj_indeksa'],
                ]);

                foreach ($anketa->pitanja as $p) {
                    $o = $poPitanju[$p->pitanje_id] ?? null;
                    if (!$o) continue;

                    if ($p->tip !== 'slobodan') {
                        foreach (($o['opcija_ids'] ?? []) as $opcijaId) {
                            if (!in_array($opcijaId, $validneOpcije[$p->pitanje_id], true)) continue;
                            AnketaOdgovorStavka::create([
                                'odgovor_id' => $odgovor->odgovor_id,
                                'pitanje_id' => $p->pitanje_id,
                                'opcija_id'  => $opcijaId,
                            ]);
                        }
                    }

                    // Slobodan tekst (za 'slobodan' tip ili "Drugo" uz opcije).
                    $tekst = trim($o['slobodan_tekst'] ?? '');
                    if ($tekst !== '') {
                        AnketaOdgovorStavka::create([
                            'odgovor_id'     => $odgovor->odgovor_id,
                            'pitanje_id'     => $p->pitanje_id,
                            'slobodan_tekst' => $tekst,
                        ]);
                    }
                }
            });
        } catch (\Illuminate\Database\QueryException $e) {
            // Prekršen unique(anketa_id, email) — već je glasao.
            if ($e->getCode() === '23000') {
                return response()->json(['message' => 'Već ste popunili ovu anketu sa ovim emailom.'], 409);
            }
            throw $e;
        }

        return response()->json(['message' => 'Hvala! Vaš odgovor je zabeležen.'], 201);
    }

    /**
     * Zbirni rezultati ankete (broj po opciji + slobodni odgovori) — samo predstavnik.
     */
    public function rezime(string $anketaId)
    {
        if (!$this->jePredstavnik()) {
            return response()->json(['message' => 'Nedovoljna prava pristupa'], 403);
        }

        $anketa = Anketa::with(['pitanja.opcije', 'odgovori.stavke'])->find($anketaId);
        if (!$anketa) {
            return response()->json(['message' => 'Anketa nije pronađena'], 404);
        }

        // Prebroj izbore po opciji i sakupi slobodne odgovore po pitanju.
        $brojPoOpciji = [];
        $slobodniPoPitanju = [];
        foreach ($anketa->odgovori as $odg) {
            foreach ($odg->stavke as $st) {
                if ($st->opcija_id) {
                    $brojPoOpciji[$st->opcija_id] = ($brojPoOpciji[$st->opcija_id] ?? 0) + 1;
                } elseif (trim((string) $st->slobodan_tekst) !== '') {
                    $slobodniPoPitanju[$st->pitanje_id][] = $st->slobodan_tekst;
                }
            }
        }

        $pitanja = $anketa->pitanja->map(fn($p) => [
            'pitanje_id' => $p->pitanje_id,
            'tekst'      => $p->tekst,
            'tip'        => $p->tip,
            'opcije'     => $p->opcije->map(fn($o) => [
                'opcija_id' => $o->opcija_id,
                'tekst'     => $o->tekst,
                'broj'      => $brojPoOpciji[$o->opcija_id] ?? 0,
            ])->values(),
            'slobodni'   => array_slice($slobodniPoPitanju[$p->pitanje_id] ?? [], 0, 100),
        ])->values();

        return response()->json([
            'broj_odgovora' => $anketa->odgovori->count(),
            'pitanja'       => $pitanja,
        ]);
    }

    /**
     * Eksport rezultata ankete kao CSV (samo predstavnik).
     */
    public function eksport(string $anketaId)
    {
        if (!$this->jePredstavnik()) {
            return response()->json(['message' => 'Samo predstavnik parlamenta može da preuzme rezultate'], 403);
        }

        $anketa = Anketa::with(['pitanja.opcije', 'odgovori.stavke'])->find($anketaId);
        if (!$anketa) {
            return response()->json(['message' => 'Anketa nije pronađena'], 404);
        }

        // Mapa opcija_id -> tekst (za čitljiv izlaz).
        $tekstOpcije = [];
        foreach ($anketa->pitanja as $p) {
            foreach ($p->opcije as $o) {
                $tekstOpcije[$o->opcija_id] = $o->tekst;
            }
        }

        $tmp = tempnam(sys_get_temp_dir(), 'anketa_');
        $fp = fopen($tmp, 'w');
        fprintf($fp, "\xEF\xBB\xBF"); // UTF-8 BOM za Excel

        // Zaglavlje: identitet + po jedna kolona za svako pitanje.
        $zaglavlje = ['Ime', 'Prezime', 'Email', 'Broj indeksa', 'Vreme'];
        foreach ($anketa->pitanja as $p) {
            $zaglavlje[] = $p->tekst;
        }
        fputcsv($fp, $zaglavlje);

        foreach ($anketa->odgovori as $odg) {
            // Grupiši stavke po pitanju.
            $poP = [];
            foreach ($odg->stavke as $st) {
                $vrednost = $st->opcija_id ? ($tekstOpcije[$st->opcija_id] ?? '?') : ($st->slobodan_tekst ?? '');
                $poP[$st->pitanje_id][] = $vrednost;
            }

            $red = [
                $odg->ime,
                $odg->prezime,
                $odg->email,
                $odg->broj_indeksa,
                $odg->vreme_odgovora ? Carbon::parse($odg->vreme_odgovora)->format('d.m.Y H:i') : '',
            ];
            foreach ($anketa->pitanja as $p) {
                $red[] = isset($poP[$p->pitanje_id]) ? implode(' | ', $poP[$p->pitanje_id]) : '';
            }
            fputcsv($fp, $red);
        }

        fclose($fp);

        $ime = 'rezultati_ankete_' . $anketa->anketa_id . '_' . date('Ymd_His') . '.csv';
        return response()->download($tmp, $ime, ['Content-Type' => 'text/csv; charset=UTF-8'])
            ->deleteFileAfterSend(true);
    }
}
