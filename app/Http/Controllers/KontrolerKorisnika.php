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

    public function verifikujKorisnika(Request $zahtev){
        $korisnickiMejl = $zahtev->input('mejl');
        $korisnik = Korisnik::where('email', $korisnickiMejl)->first();
        $korisnik->verifikuj(); 

        return response()->noContent();
    }
}
