<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Predmet;
use App\Models\Materijal;
use App\Models\Tip_materijala;
use App\Models\Smer;
use App\Models\Korisnik;

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
        $validated = $request->validate([
            'departman' => ['required', 'string', 'max:100'],
            'nivoStudija' => ['required', 'string', 'max:100'],
            'smer' => ['required', 'string', 'max:100'],
            'godina' => ['required'],
            'predmet' => ['required', 'string', 'max:150'],
            'tipMaterijala' => ['required', 'string', 'max:100'],
            'podTipMaterijala' => ['required', 'string', 'max:100'],
            'akademskaGodina' => ['required', 'string'],
            'korisnickiMejl' => ['required', 'email', 'max:255'],
            'fajl' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx,zip', 'max:10240'], // max 10MB
        ]);

        $departman = json_decode($request->input('departman'), true);
        $nivoStudija = json_decode($request->input('nivoStudija'), true);
        $smer = json_decode($request->input('smer'), true);
        $godina = json_decode($request->input('godina'), true);
        $predmet = json_decode($request->input('predmet'), true);
        $tipMaterijala = json_decode($request->input('tipMaterijala'), true);
        $podTipMaterijala = json_decode($request->input('podTipMaterijala'), true);
        $akademskaGodina = $request->input('akademskaGodina');
        $korisnickiMejl = $request->input('korisnickiMejl');
        $fajl = $request->file('fajl');

        $korisnik = Korisnik::where('email', $korisnickiMejl)->first();
        
        if(!$korisnik){
            Korisnik::create([
                'email' => $korisnickiMejl
            ]);
        }
        // else if(!$korisnik->verifikovan){
        //     // treba da se verifukije pa ubaci u bazu
        // }
        else{
            $kreiranMaterijal = Materijal::kreirajMaterijal($fajl->getClientOriginalName(), $predmet['predmet_id'], $podTipMaterijala['podtip_materijala_id'],  $akademskaGodina, $korisnik->korisnik_id);
        }

        dd($kreiranMaterijal);
        // $fajlPath = $request->file('fajl')->store('uploads', 'public');

        // return response()->json([
        //     'message' => 'Fajl uspešno sačuvan',
        //     'putanja' => $fajlPath,
        // ]);
    }

}
