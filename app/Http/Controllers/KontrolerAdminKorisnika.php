<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\ServisIzvestaja;

class KontrolerAdminKorisnika extends Controller
{
    protected $servisIzvestaja;

    public function __construct(ServisIzvestaja $servisIzvestaja)
    {
        $this->servisIzvestaja = $servisIzvestaja;
    }

    public function exportProblema(){
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();

        if($prijavljenKorisnik->tipUloge->naziv === "Admin"){
            $prijavljenKorisnik->zabeleziAkcijuKorisnika('Eksport', 'Eksport problema');
            return $this->servisIzvestaja->generisiIzvestajProblema();
        } else {
            return response()->json([
                'message' => 'Korisnik nema Admin privilegije',
            ], 401);
        }
    }

    public function exportStrukturaFakulteta(){
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();

        if($prijavljenKorisnik->tipUloge->naziv === "Admin"){
            $prijavljenKorisnik->zabeleziAkcijuKorisnika('Eksport', 'Eksport strukture fakulteta');
            return $this->servisIzvestaja->generisiIzvestajFakulteta();
        } else {
            return response()->json([
                'message' => 'Korisnik nema Admin privilegije',
            ], 401);
        }
    }

    public function exportKorisnickihAkcija(){
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();

        if($prijavljenKorisnik->tipUloge->naziv === "Admin"){
            $prijavljenKorisnik->zabeleziAkcijuKorisnika('Eksport', 'Eksport korisnickih akcija');
            return $this->servisIzvestaja->generisiIzvestajKorisnickihAkcija();
        } else {
            return response()->json([
                'message' => 'Korisnik nema Admin privilegije',
            ], 401);
        }
    }
}
