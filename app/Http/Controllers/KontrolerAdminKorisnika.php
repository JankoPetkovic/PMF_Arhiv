<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\ServisIzvestaja;
use App\Exports\ExportProblema;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

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
        $prijavljenKorisnik->zabeleziAkcijuKorisnika('Eksport', 'Eksport problema');
        return $this->servisIzvestaja->generisiIzvestajProblema();
    }

    public function exportStrukturaFakulteta(){
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();
        $prijavljenKorisnik->zabeleziAkcijuKorisnika('Eksport', 'Eksport strukture fakulteta');
        return $this->servisIzvestaja->generisiIzvestajFakulteta();
    }
}
