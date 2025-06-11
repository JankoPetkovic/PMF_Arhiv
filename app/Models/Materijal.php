<?php

namespace App\Models;
use App\Models\Korisnik;
use App\Models\podTipMaterijala;
use App\Models\Predmet;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Materijal extends Model
{
    /**
     * Tabela koja predstavalja model
     * 
     * @var string
     */
    protected $table = 'materijal';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'materijal_id';


    /**
     * Kontrola created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = true;
    const CREATED_AT = 'datum_dodavanja';
    const UPDATED_AT = NULL;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['naziv', 'predmet_id','podtip_materijala_id', 'skolska_godina', 'korisnik_id', 'datum_dodavanja', 'putanja_fajla'];

    public function podTipMaterijala(){
        return $this->belongsTo(PodTipMaterijala::class, 'podtip_materijala_id', 'podtip_materijala_id');
    }

    public function predmet(){
        return $this->belongsTo(Predmet::class, 'predmet_id', 'predmet_id');
    }

    public function korisnik(){
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }

    /**
     * Vraca sve materijale iz tabele Materijal
     */
    public static function getMaterijalPoPodTipu($predmet,$podtipoviMaterijala)
    {
        $query = self::with(['korisnik', 'predmet'])
        ->where('predmet_id', $predmet);

        if (!empty($podtipoviMaterijala)) {
        $query->whereIn('podtip_materijala_id', $podtipoviMaterijala);
        }

       $materijali = $query->get();
        return $materijali->map(function ($m) {
        return [
            'materijal_id' => $m->materijal_id,
            'naziv' => $m->naziv,
            'tip_materijala' => $m->podTipMaterijala->naziv ?? null,
            'email' => $m->korisnik->email ?? null,
            'predmet_id' => $m->predmet->naziv,
            'datumDodavanja' => $m->datum_dodavanja,
            'skolskaGodina' => $m->skolska_godina,
            'putanja'=>$m->putanja_fajla,
            ];
        });
    }

    public static function kreirajMaterijal($fajl, $departman, $nivoStudija, $smer, $godina, $predmet, $tipMaterijala, $podTipMaterijala, $akademskaGodina, $korisnikId){
        $nazivFajla = $fajl->getClientOriginalName();
        $putanja = "{$departman['naziv']}/{$nivoStudija['nivo_studija']}/{$smer['naziv_smera']}/{$godina['naziv']}/{$predmet['naziv']}/{$tipMaterijala['naziv']}/{$podTipMaterijala['naziv']}/{$akademskaGodina}";
        $putanja = strtolower(preg_replace('/\s+/', '_', $putanja));

        if (!Storage::disk('public')->exists($putanja)) {
            Storage::disk('public')->makeDirectory($putanja, 0755, true);
        }

        $materijal = self::create([
            'naziv' => $nazivFajla,
            'predmet_id' => $predmet['predmet_id'],
            'podtip_materijala_id' => $podTipMaterijala['podtip_materijala_id'],
            'skolska_godina' => $akademskaGodina,
            'korisnik_id' => $korisnikId,
            'putanja_fajla' => ''
        ]);

        $imeFajla = $materijal->materijal_id . '_' . $nazivFajla;

        $putanjaFajla = Storage::disk('public')->putFileAs($putanja, $fajl, $imeFajla);

        $materijal->putanja_fajla = $putanjaFajla;
        $materijal->save();

        return $putanjaFajla;
    }



   
}
