<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class podtipMaterijala extends Model
{
    protected $table = 'podtip_materijala';
    protected $primaryKey = 'podtip_materijala_id';
    public $timestamps = false;
    protected $fillable = ['naziv'];

    public static function vratiPodTipoveTipa($tipMaterijala){
        return self::where('tip_materijala_id', $tipMaterijala)->get();
    }

    public function tip(){
        return $this->belongsTo(TipMaterijala::class, 'tip_materijala_id', 'tip_materijala_id');
    }

    public function materijali(){
        return $this->hasMany(Materijal::class, 'podtip_materijala_id', 'podtip_materijala_id');
    }

    public static function filtriraj(array $filteri){
        $upit = self::query();

        if(!empty($filteri['tip_materijala_id'])){
            $upit->where('tip_materijala_id', $filteri['tip_materijala_id']);
        }

        $kolonaSortiranja = $filteri['kolonaSortiranja'] ?? 'podtip_materijala_id';
        $pravacSortiranja = $filteri['pravacSortiranja'] ?? 'asc';
        $poStranici = $filteri['poStranici'] ?? 10;

        if(!in_array($kolonaSortiranja, ['podtip_materijala_id']) || !in_array($pravacSortiranja, ['asc', 'desc'])){
            throw new \InvalidArgumentException("Nevalidan parametar za sortiranje.");
        }

        $rezultat = $upit->orderBy($kolonaSortiranja, $pravacSortiranja)->get();

        if($rezultat->isEmpty()) {
            throw new \RuntimeException("Nema pronađenih predmeta za zadate filtere.");
        }

        $rezultat->map(function ($p) {
            return [
                'podtip_materijala_id' => $p->podtip_materijala_id,
                'naziv' => $p->naziv,
                'tip_materijala' => $p->tip->naziv,
            ];
        });

        return $rezultat;
    }

}
