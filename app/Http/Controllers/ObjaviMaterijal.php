<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Departman;
use App\Models\Nivo_studija;
use App\Models\Smer;
use App\Models\Predmet;
use App\Models\Tip_materijala;
use App\Models\podTipMaterijala;

class ObjaviMaterijal extends Controller
{
    public function objaviMaterijalHome(){
        $departmani = Departman::all();
        $nivoStudija = Nivo_studija::all();
        $tipovi_materijala = Tip_materijala::all();

        return [
            'dostupniDepartmani' => $departmani,
            'dostupniNivoiStudija' => $nivoStudija,
            'dostupniTipoviMaterijala' => $tipovi_materijala
        ];
    }

    public function getSmerovi(Request $request){
        $departman = $request->input('departman');
        $nivoStudija = $request->input('nivoStudija');
        
        $smerovi = Smer::where('departman_id', $departman)
               ->where('nivo_studija_id', $nivoStudija)
               ->get();
        return response()->json($smerovi);
    }

    public function getPredmeti(Request $request){
        $smerID = $request->input('smerID');
        $godina = $request->input('godina');

        $predmeti = Predmet::where('smer_id', $smerID)
            ->where('godina', $godina)
            ->get();
        return response()->json($predmeti);
    }

    public function getPodTipoviMaterijala(Request $request){
        $tipMaterijala = $request->input('tipMaterijala');
        $podTipoviMaterijala = podTipMaterijala::vratiPodTipoveTipa($tipMaterijala);
        return response()->json($podTipoviMaterijala);
    }
}
