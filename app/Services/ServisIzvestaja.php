<?php

namespace App\Services;

use App\Exports\ExportProblema;
use App\Exports\ExportKorisnickihAkcija;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

use App\Models\Departman;

class ServisIzvestaja
{
    public function generisiIzvestajProblema(array $filteri = [])
    {
        $export = new ExportProblema($filteri);
        return Excel::download($export, 'problemi.xlsx');
    }

    public function generisiIzvestajFakulteta()
    {
        $departmani = Departman::with([
            'smerovi.predmeti',
            'smerovi.nivoStudija'
        ])->get();

        $pdfPodaci = $departmani->map(function ($departman) {

            $smeroviPoNivou = $departman->smerovi
                ->groupBy(fn($smer) => $smer->nivoStudija->nivo_studija ?? 'Nepoznato')
                ->map(function ($smeroviNaIstomNivou) {

                    return $smeroviNaIstomNivou->map(function ($smer) {
                        return [
                            'naziv' => $smer->naziv_smera,
                            'predmeti' => $smer->predmeti
                                ->sortBy('godina')
                                ->groupBy(fn($predmet) => $predmet->godina)
                        ];
                    });
                });

            return [
                'naziv' => $departman->naziv,
                'smerovi' => $smeroviPoNivou
            ];
        });

        $pdf = Pdf::loadView('pdf.izvestaj_departmani', [
            'departmani' => $pdfPodaci
        ]);

        return $pdf->download('izvestaj_departmani.pdf');
    }

    public function generisiIzvestajKorisnickihAkcija()
    {
        $nazivFajla = 'korisnicke_akcije_' . now()->format('Y_m_d_H_i_s') . '.xlsx';
        return Excel::download(new ExportKorisnickihAkcija, $nazivFajla);
    }
}
