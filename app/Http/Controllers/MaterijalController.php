<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Predmet;
use App\Models\Materijal;
use App\Models\Tip_materijala;
use App\Models\Smer;

class MaterijalController extends Controller
{
    public function get_predmeti($id){
        $predmeti = Predmet::where('smer_id', $id)->get();
        $tipovi_materijala = Tip_materijala::all();
        $siroviSmer = Smer::with('departman', 'nivoStudija')->findOrFail($id);

        $smer = [
            'departman' => $siroviSmer->departman->naziv,
            'naziv_smera' => $siroviSmer->naziv_smera,
            'nivo_studija' => $siroviSmer->nivoStudija->nivo_studija,
        ];

        return Inertia::render('Materijal', [
            'smer' => $smer,
            'predmeti' => $predmeti,
            'tipovi_materijala' => $tipovi_materijala
        ]);
    }

    public function get_materijal(Request $request){
        $predmeti = $request->predmeti;
        $tipovi_materijala = $request->tipovi;

        $materijali = [];
         foreach($predmeti as $predmet)
            {   
                $naziv_predmeta = Predmet::getNazivPredmeta($predmet);
                $materijali[$naziv_predmeta] = Materijal::getMaterijalPoTipu($predmet,$tipovi_materijala);
            }

        return response()->json($materijali);
    }

   public function storeMaterijal(Request $request){
        $request->validate([
            'fajl' => 'required|file|max:10240',
            'predmet' => 'required',
            'podTipMaterijala' => 'required',
            'korisnickiMejl' => 'required|email',
            'skolskaGodina' => 'required',
        ]);

        // $fajlPath = $request->file('fajl')->store('uploads', 'public');

        // return response()->json([
        //     'message' => 'Fajl uspešno sačuvan',
        //     'putanja' => $fajlPath,
        // ]);
    }

}
