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
    public function get_predmeti($id)
    {
        $predmeti = Predmet::where('smer_id', $id)->get();
        $tipovi_materijala = Tip_materijala::all();
        $smer = Smer::where('smer_id', $id)->get();

        return Inertia::render('Materijal', [
            'smer' => $smer,
            'predmeti' => $predmeti,
            'tipovi_materijala' => $tipovi_materijala
        ]);
    }

    public function get_materijal(Request $request)
    {
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
}
