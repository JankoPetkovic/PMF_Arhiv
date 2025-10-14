<?php

namespace App\Exports;

use App\Models\Problem;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ExportProblema implements FromCollection, WithHeadings, WithMapping
{
    protected $filteri;

    public function __construct(array $filteri = [])
    {
        $this->filteri = $filteri;
    }

    public function collection()
    {
        $query = Problem::with(['korisnik', 'tipProblema']);

        if (!empty($this->filteri['korisnik_id'])) {
            $query->where('korisnik_id', $this->filteri['korisnik_id']);
        }

        if (!empty($this->filteri['tip_problema_id'])) {
            $query->where('tip_problema_id', $this->filteri['tip_problema_id']);
        }

        if (!empty($this->filteri['od']) && !empty($this->filteri['do'])) {
            $query->whereBetween('vreme_upisa', [$this->filteri['od'], $this->filteri['do']]);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return ['ID', 'Korisnik', 'Tip problema', 'Poruka', 'Datum prijave'];
    }

    public function map($problem): array
    {
        return [
            $problem->id,
            $problem->korisnik?->ime ?? 'Nepoznato',
            $problem->tipProblema?->naziv ?? 'Nepoznat tip',
            $problem->poruka,
            $problem->vreme_upisa,
        ];
    }
}
