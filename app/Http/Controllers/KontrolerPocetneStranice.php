<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

use App\Models\Departman;
use App\Models\NivoStudija;
use App\Models\TipMaterijala;
use App\Models\Materijal;

class KontrolerPocetneStranice extends Controller
{
    public function index()
    {
        $departmani = Departman::with(['smerovi.nivoStudija'])->get();

        $data = $departmani->map(function ($departman) {
            $nivoGrouped = [];
        
            foreach ($departman->smerovi as $smer) {
                $nivo = $smer->nivoStudija->nivo_studija;
        
                if (!isset($nivoGrouped[$nivo])) {
                    $nivoGrouped[$nivo] = [];
                }
        
                $nivoGrouped[$nivo][] = [
                    'id' => $smer->smer_id,
                    'naziv' => $smer->naziv_smera,
                ];
            }
        
            return [
                'departman_naziv' => $departman->naziv,
                'departman_id' => $departman->departman_id,
                'nivo_studija' => $nivoGrouped
            ];
        });

        $departmani = Departman::all();
        $nivoiStudija = NivoStudija::all();
        $tipoviMaterijala = TipMaterijala::all();
        $materijali = Materijal::with(['predmet.smer.departman', 'predmet.smer.nivoStudija','podtipMaterijala.tip', 'korisnik'])
        ->orderBy('materijal_id', 'desc')
        ->take(30)
        ->get()
        ->map(function ($materijal) {
            return [
                'materijal_id' => $materijal->materijal_id,
                'naziv' => $materijal->naziv,
                'putanja_fajla' => $materijal->putanja_fajla,
                'skolska_godina' => $materijal->skolska_godina,
                'datum_dodavanja' => Carbon::parse($materijal->datum_dodavanja)->format('d.m.Y'),
                'predmet' => $materijal->predmet->naziv ?? null,
                'smer' => $materijal->predmet->smer ?? null,
                'departman' => $materijal->predmet->smer->departman->naziv ?? null,
                'nivo_studija' => $materijal->predmet->smer->nivoStudija->nivo_studija ?? null,
                'tip' => $materijal->podtipMaterijala->tip->naziv ?? null,
                'podtip' => $materijal->podtipMaterijala->naziv ?? null,
                'korisnik' => $materijal->korisnik->email ?? null,
            ];
        });


        return Inertia::render('Home', [
            'smerovi' => $data, 
            'dostupniDepartmani' => $departmani,
            'dostupniNivoiStudija' => $nivoiStudija,
            'dostupniTipoviMaterijala' => $tipoviMaterijala,
            'dostupniMaterijali' => $materijali, 
        ]);
    }

    
}
