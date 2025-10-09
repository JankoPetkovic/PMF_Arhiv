<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Predmet extends Model
{   

    protected $table = 'predmet';

    protected $primaryKey = 'predmet_id';

    public $timestamps = false;

    protected $fillable = ['naziv', 'godina', 'smer_id'];

    public function smer()
    {
        return $this->belongsTo(Smer::class, 'smer_id');
    }

    public function korisnici(){
        return $this->belongsToMany(Korisnik::class, 'predmeti_korisnika', 'predmet_id', 'korisnik_id');
    }

    public static function filtriraj(array $filteri){
        $upit = self::query();

        if(!empty($filteri['godina'])){
            $upit->where('godina', $filteri['godina']);
        }

        if(!empty($filteri['smer_id'])){
             if (is_array($filteri['smer_id'])) {
                $upit->whereIn('smer_id', $filteri['smer_id']);
            } else {
                $upit->where('smer_id', $filteri['smer_id']);
            }
        }

        $kolonaSortiranja = $filteri['kolonaSortiranja'] ?? 'godina';
        $pravacSortiranja = $filteri['pravacSortiranja'] ?? 'asc';
        $poStranici = $filteri['poStranici'] ?? 10;

        if(!in_array($kolonaSortiranja, ['naziv', 'godina']) || !in_array($pravacSortiranja, ['asc', 'desc'])){
            throw new \InvalidArgumentException("Nevalidan parametar za sortiranje.");
        }

        $rezultat = $upit->orderBy($kolonaSortiranja, $pravacSortiranja)->get();

        if($rezultat->isEmpty()) {
            throw new \RuntimeException("Nema pronađenih predmeta za zadate filtere.");
        }

        $rezultat->map(function ($p) {
            return [
                'predmet_id' => $p->predmet_id,
                'naziv' => $p->naziv,
                'godina' => $p->godina,
                'smer' => $p->smer->naziv_smera,
            ];
        });

        return $rezultat;
    }

}
