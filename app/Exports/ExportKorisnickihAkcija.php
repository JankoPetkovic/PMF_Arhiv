<?php

namespace App\Exports;

use App\Models\KorisnickaAkcija;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ExportKorisnickihAkcija implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    public function collection()
    {
        return KorisnickaAkcija::with(['korisnik', 'tipKorisnickeAkcije'])
            ->orderBy('vreme_akcije', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Korisnik',
            'Tip akcije',
            'Poruka',
            'Vreme akcije',
        ];
    }

    public function map($akcija): array
    {
        return [
            $akcija->id,
            $akcija->korisnik ? $akcija->korisnik->ime . ' ' . $akcija->korisnik->prezime : 'Nepoznato',
            $akcija->tipKorisnickeAkcije ? $akcija->tipKorisnickeAkcije->naziv : 'Nepoznato',
            $akcija->poruka,
            $akcija->vreme_akcije->format('d.m.Y H:i:s'),
        ];
    }
}
