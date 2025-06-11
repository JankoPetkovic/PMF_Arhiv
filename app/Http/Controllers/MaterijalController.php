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
            'nivo_studija_id' => $siroviSmer->nivoStudija->nivo_studija_id,
        ];
        
        return Inertia::render('Materijal', [
            'smer' => $smer,
            'predmeti' => $predmeti,
            'tipovi_materijala' => $tipovi_materijala
        ]);
    }

    public function get_materijal(Request $zahtev){
        $predmet = $zahtev->predmeti;
        $podTipoviMaterijala = $zahtev->podTipovi;
        $materijali = Materijal::getMaterijalPoPodTipu($predmet['predmet_id'],$podTipoviMaterijala);
        return response()->json($materijali, 200);
    }

   public function storeMaterijal(Request $zahtev){
        $validated = $zahtev->validate([
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

        $departman = json_decode($zahtev->input('departman'), true);
        $nivoStudija = json_decode($zahtev->input('nivoStudija'), true);
        $smer = json_decode($zahtev->input('smer'), true);
        $godina = json_decode($zahtev->input('godina'), true);
        $predmet = json_decode($zahtev->input('predmet'), true);
        $tipMaterijala = json_decode($zahtev->input('tipMaterijala'), true);
        $podTipMaterijala = json_decode($zahtev->input('podTipMaterijala'), true);
        $akademskaGodina = $zahtev->input('akademskaGodina');
        $akademskaGodina = str_replace('/', '-',$akademskaGodina);
        $korisnickiMejl = $zahtev->input('korisnickiMejl');
        $fajl = $zahtev->file('fajl');

        $korisnik = Korisnik::where('email', $korisnickiMejl)->first();
        
        if(!$korisnik){
            Korisnik::create([
                'email' => $korisnickiMejl
            ]);

            //pa treba da se posalje mejl verifikacije i onda funkcija za kreiranje odozdo
        }
        // else if(!$korisnik->verifikovan){
        //     // treba da se posalje mejl verifikacije i onda funkcija za kreiranje odozdo
        // }
        else{
            $putanjaKreiranogMaterijala = Materijal::kreirajMaterijal(
                $fajl,$departman, $nivoStudija, $smer, $godina, $predmet, $tipMaterijala, $podTipMaterijala, $akademskaGodina, $korisnik->korisnik_id);
            return response()->json([
                'message' => 'Fajl uspešno sačuvan.',
                'putanja' => $putanjaKreiranogMaterijala,
                
            ], 200);
        }

        

        
       
        


        
    }

}
