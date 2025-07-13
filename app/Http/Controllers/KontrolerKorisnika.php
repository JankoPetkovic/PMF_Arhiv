<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Korisnik;

class KontrolerKorisnika extends Controller
{
    public function statusVerifikacije(Request $zahtev){
        $korisnickiMejl = $zahtev->get('mejl');
        $korisnik = Korisnik::where('email', $korisnickiMejl)->first();

        if($korisnik){
            return response()->json($korisnik->statusVerifikacije(), 200);
        } else {
            return response()->json([
                'verifikovan' => false,
                'statusVerifikacije' => "Korisnik se ne nalazi u bazi podataka",
            ], 200);
        }
    }

    public function posaljiVerifikaciju(Request $zahtev){
        $korisnickiMejl = $zahtev->input('mejl');
        $korisnik = Korisnik::where('email', $korisnickiMejl)->first();
        if($korisnik){
            $korisnik->posaljiVerifikaciju(); 
        } else {
            $noviKorisnik = new Korisnik();
            $noviKorisnik->email = $korisnickiMejl;
            $noviKorisnik->save();
            $noviKorisnik->posaljiVerifikaciju(); 
        }
        return response()->noContent();
    }

    public function obradiVerifikaciju($id){
        if (!request()->hasValidSignature()) {
            return redirect()->route('home')->with('error', 'Link nije validan ili je istekao.');
        }

        $korisnik = Korisnik::findOrFail($id);

        $korisnik->obradiVerifikaciju();

        $statusVerifikacije = $korisnik->statusVerifikacije();

        if($statusVerifikacije['verifikovan']){
            return redirect()->route('home')->with('success', "Korisnik uspesno verifikovan!");
        } else {
            return redirect()->route('home')->with('error', 'Greska pri verifikaciji');
        }
    }

}
