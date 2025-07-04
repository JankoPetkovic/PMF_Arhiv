<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;


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
            'fajl' => ['required', 'file', 'mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,text/plain,application/vnd.oasis.opendocument.text,image/png,image/jpeg', 'max:10240'],// max 10MB
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

        if (
            $korisnik->datum_verifikacije && 
            $korisnik->datum_verifikacije->gt(now()->subMonths(env('VERIFIKACIJA_TRAJANJE_MESECI', 1)))
        ){
            $putanjaKreiranogMaterijala = Materijal::kreirajMaterijal(
                $fajl, $departman, $nivoStudija, $smer, $godina, $predmet, $tipMaterijala, $podTipMaterijala, $akademskaGodina, $korisnik->korisnik_id
            );

            return response()->json([
                'message' => 'Fajl uspešno sačuvan.',
                'putanja' => $putanjaKreiranogMaterijala,
            ], 200);
        } else if (!$korisnik) {
            $korisnik = Korisnik::create([
                'email' => $korisnickiMejl
            ]);
           $korisnik->verifikuj();

           $putanjaFajla = $fajl->storeAs('temp', $fajl->getClientOriginalName());
           Cache::put('materijal_cekaj_' . $korisnik->korisnik_id, [
                'putanja_fajla' => $putanjaFajla,
                'departman' => $departman,
                'nivoStudija' => $nivoStudija,
                'smer' => $smer,
                'godina' => $godina,
                'predmet' => $predmet,
                'tipMaterijala' => $tipMaterijala,
                'podTipMaterijala' => $podTipMaterijala,
                'akademskaGodina' => $akademskaGodina,
            ], now()->addMinutes(30));

            return response()->json(['message' => 'Potvrdi mejl da bi se fajl objavio.'], 200);
        } else {
            $korisnik->verifikuj();
            $putanjaFajla = $fajl->storeAs('temp', $fajl->getClientOriginalName());
            Cache::put('materijal_cekaj_' . $korisnik->korisnik_id, [
                'putanja_fajla' => $putanjaFajla,
                'departman' => $departman,
                'nivoStudija' => $nivoStudija,
                'smer' => $smer,
                'godina' => $godina,
                'predmet' => $predmet,
                'tipMaterijala' => $tipMaterijala,
                'podTipMaterijala' => $podTipMaterijala,
                'akademskaGodina' => $akademskaGodina,
            ], now()->addMinutes(30));

            return response()->json(['message' => 'Potvrdi mejl da bi se fajl objavio.'], 200);
        }
    }

}
