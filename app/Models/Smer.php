<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Predmet;
use App\Models\Departman;
use App\Models\NivoStudija;

class Smer extends Model
{
    /**
     * Tabela koja predstavlja model
     * 
     * @var string
     */
    protected $table = 'smer';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'smer_id';


    /**
     * Iskljucivanje created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = false;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['naziv_smera', 'departman_id', 'nivo_studija_id'];

    public function predmeti(){
        return $this->hasMany(Predmet::class, 'smer_id');
    }

    public function departman()
    {
        return $this->belongsTo(Departman::class, 'departman_id');
    }

    public function nivoStudija()
    {
        return $this->belongsTo(NivoStudija::class, 'nivo_studija_id');
    }

    public static function filtriraj(array $filteri){
        $upit = self::with(['departman', 'nivoStudija']);
        
        if(!empty($filteri['departman_id'])){
            $upit->where('departman_id', $filteri['departman_id']);
        }

        if(!empty($filteri['nivo_studija_id'])){
            $upit->where('nivo_studija_id', $filteri['nivo_studija_id']);
        }

        $kolonaSortiranja = $filteri['kolonaSortiranja'] ?? 'smer_id';
        $pravacSortiranja = $filteri['pravacSortiranja'] ?? 'asc';
        $poStranici = $filteri['poStranici'] ?? 10;

        if(!in_array($kolonaSortiranja, ['naziv_smera', 'smer_id']) || !in_array($pravacSortiranja, ['asc', 'desc'])){
            throw new \InvalidArgumentException("Nevalidan parametar za sortiranje.");
        }

        $rezultat = $upit->orderBy($kolonaSortiranja, $pravacSortiranja)->get();

        if($rezultat->isEmpty()) {
            throw new \RuntimeException("Nema pronađenih materijala za zadate filtere.");
        }

        $rezultat = $rezultat->map(function ($s) {
            return [
                'smer_id' => $s->smer_id,
                'naziv_smera' => $s->naziv_smera,
                'departman' => $s->departman->naziv,
                // 'nivo_studija' => $s->nivoStudija->nivo_studija,
            ];
        });

        return $rezultat;
    }

    public static function prikaziSmer($id){
        $siroviSmer = Smer::with(['departman', 'nivoStudija', 'predmeti'])->findOrFail($id);
        $tipoviMaterijala = TipMaterijala::all();

        $smer = [
            'departman' => $siroviSmer->departman->naziv,
            'naziv_smera' => $siroviSmer->naziv_smera,
            'nivo_studija' => $siroviSmer->nivoStudija->nivo_studija,
            'nivo_studija_id' => $siroviSmer->nivoStudija->nivo_studija_id,
        ];

        $podaci = [
            'smer' => $smer,
            'predmeti' => $siroviSmer['predmeti'],
            'tipoviMaterijala' => $tipoviMaterijala
        ];

        return $podaci;
    }
}
