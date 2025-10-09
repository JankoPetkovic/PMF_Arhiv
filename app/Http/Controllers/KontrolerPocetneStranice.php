<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
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

        $podaci = $departmani->map(function ($departman) {
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
        $filteri = [
            'poStranici' => 30,
            'kolonaSortiranja' => 'datum_dodavanja',
            'pravacSortiranja' => 'desc',
        ];

        if (Auth::check()) {
            $korisnik = Auth::user();
            $filteri['smer_id'] = $korisnik->smerovi->pluck('smer_id')->toArray();
        }

        $materijali = Materijal::filtriraj($filteri);

        return Inertia::render('Home', [
            'smerovi' => $podaci, 
            'dostupniDepartmani' => $departmani,
            'dostupniNivoiStudija' => $nivoiStudija,
            'dostupniTipoviMaterijala' => $tipoviMaterijala,
            'dostupniMaterijali' => $materijali, 
        ]);
    }

    
}
