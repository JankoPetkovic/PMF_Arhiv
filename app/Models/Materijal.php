<?php

namespace App\Models;
use App\Models\Korisnik;
use App\Models\PodtipMaterijala;
use App\Models\Predmet;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class Materijal extends Model
{
    use SoftDeletes;

    protected $table = 'materijal';

    protected $primaryKey = 'materijal_id';

    public $timestamps = true;
    const CREATED_AT = 'datum_dodavanja';
    const UPDATED_AT = NULL;
    const DELETED_AT = 'datum_brisanja';

    protected $fillable = ['naziv', 'predmet_id','podtip_materijala_id', 'skolska_godina', 'korisnik_id', 'datum_dodavanja'];

    public function podtipMaterijala(){
        return $this->belongsTo(PodTipMaterijala::class, 'podtip_materijala_id', 'podtip_materijala_id');
    }

    public function predmet(){
        return $this->belongsTo(Predmet::class, 'predmet_id', 'predmet_id');
    }

    public function korisnik(){
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }

    public function vratiPutanju(){
        $putanja = $this->predmet->smer->departman->naziv . '/'. 
                   $this->predmet->smer->nivoStudija->nivo_studija . '/'. 
                   $this->predmet->smer->naziv_smera .'/'. 
                   $this->predmet->godina .'._godina/'. 
                   $this->predmet->naziv .'/'. 
                   $this->podtipMaterijala->tip->naziv .'/'. 
                   $this->podtipMaterijala->naziv .'/'.
                   $this->skolska_godina .'/'.
                   $this->materijal_id .'_';
        $putanja = strtolower(str_replace(' ', '_', $putanja));
        $putanja = $putanja . $this->naziv;
        return $putanja;
    }

    public static function filtriraj(array $filteri){
        $upit = self::with([
            'predmet.smer.departman',
            'predmet.smer.nivoStudija',
            'podtipMaterijala.tip',
            'korisnik'
        ]);
        if (!empty($filteri['smer_id'])) {
            $upit->whereHas('predmet', function ($podupit) use ($filteri) {
                $smerovi = is_array($filteri['smer_id'])
                    ? $filteri['smer_id']
                    : [$filteri['smer_id']];

                $podupit->whereIn('smer_id', $smerovi);
            });
        }
        if (!empty($filteri['korisnik_id'])) {
            $upit->where('korisnik_id', $filteri['korisnik_id']);
        }

        if (!empty($filteri['godina'])) {
            $upit->whereHas('predmet', function ($podupit) use ($filteri) {
                $podupit->where('godina', $filteri['godina']);
            });
        }

        if (!empty($filteri['podtip_materijala_id'])) {
            $upit->where('podtip_materijala_id', $filteri['podtip_materijala_id']);
        }

        if (!empty($filteri['tip_materijala_id'])) {
            $upit->whereHas('podtipMaterijala', function ($podupit) use ($filteri) {
                $podupit->where('tip_materijala_id', $filteri['tip_materijala_id']);
            });
        }

        if (!empty($filteri['predmet_id']) && $filteri['predmet_id'] != 0) {
            $upit->where('predmet_id', $filteri['predmet_id']);
        }

        if (!empty($filteri['skolska_godina'])) {
            if (!preg_match('/^\d{4}\/\d{2}$/', $filteri['skolska_godina'])) {
                throw new \InvalidArgumentException("Format školske godine nije validan (očekivan: npr. 2023/2024).");
            }
            $skolskaGodina = str_replace('/', '-', $filteri['skolska_godina']);
            $upit->where('skolska_godina', $skolskaGodina);
        }

        if (!empty($filteri['pretraga'])) {
            $upit->where('naziv', 'like', '%' . $filteri['pretraga'] . '%');
        }

        $kolonaSortiranja = $filteri['kolonaSortiranja'] ?? 'materijal_id';
        $pravacSortiranja = $filteri['pravacSortiranja'] ?? 'desc';
        $poStranici = $filteri['poStranici'] ?? 10;

        if (!in_array($kolonaSortiranja, ['naziv', 'datum_dodavanja', 'materijal_id']) || !in_array($pravacSortiranja, ['asc', 'desc'])) {
            throw new \InvalidArgumentException("Nevalidan parametar za sortiranje.");
        }

        $rezultat = $upit->orderBy($kolonaSortiranja, $pravacSortiranja)->paginate($poStranici);

        $rezultat->getCollection()->transform(function ($materijal) {
            return [
                'materijal_id' => $materijal->materijal_id,
                'naziv' => $materijal->naziv,
                'putanja_fajla' => $materijal->vratiPutanju(),
                'skolska_godina' => $materijal->skolska_godina,
                'datum_dodavanja' => Carbon::parse($materijal->datum_dodavanja)->format('d.m.Y'),
                'predmet' => $materijal->predmet->naziv ?? null,
                'smer' => $materijal->predmet->smer ?? null,
                'departman' => $materijal->predmet->smer->departman->naziv ?? null,
                'nivo_studija' => $materijal->predmet->smer->nivoStudija->nivo_studija ?? null,
                'tip' => $materijal->podtipMaterijala->tip->naziv ?? null,
                'podtip' => $materijal->podtipMaterijala->naziv ?? null,
                'korisnik' => $materijal->korisnik->email ?? null,
            ];
        });

        return $rezultat;
    }



    public static function kreirajMaterijal($fajl, $departman, $nivoStudija, $smer, $godina, $predmet, $tipMaterijala, $podtipMaterijala, $akademskaGodina, $korisnikId){
        $nazivFajla = $fajl->getClientOriginalName();
        $putanja = "{$departman['naziv']}/{$nivoStudija['nivo_studija']}/{$smer['naziv_smera']}/{$godina['naziv']}/{$predmet['naziv']}/{$tipMaterijala['naziv']}/{$podtipMaterijala['naziv']}/{$akademskaGodina}";
        $putanja = strtolower(preg_replace('/\s+/', '_', $putanja));

        if (!Storage::disk('public')->exists($putanja)) {
            Storage::disk('public')->makeDirectory($putanja);
        }

        $materijal = self::create([
            'naziv' => $nazivFajla,
            'predmet_id' => $predmet['predmet_id'],
            'podtip_materijala_id' => $podtipMaterijala['podtip_materijala_id'],
            'skolska_godina' => $akademskaGodina,
            'korisnik_id' => $korisnikId,
        ]);

        $imeFajla = $materijal->materijal_id . '_' . $nazivFajla;

        Storage::disk('public')->putFileAs($putanja, $fajl, $imeFajla);

        $materijal->save();

        return $materijal->vratiPutanju();
    }

    public static function sacuvajMaterijala($korisnickiMejl, $departman, $nivoStudija, $smer, $godina, $predmet, $tipMaterijala, $podtipMaterijala, $akademskaGodina, $fajl){
        $korisnik = Korisnik::where('email', $korisnickiMejl)->first();

        if (
            $korisnik->datum_verifikacije && 
            $korisnik->datum_verifikacije->gt(now()->subMonths(env('VERIFIKACIJA_TRAJANJE_MESECI', 1)))
        ){
            $putanjaKreiranogMaterijala = Materijal::kreirajMaterijal(
                $fajl, $departman, $nivoStudija, $smer, $godina, $predmet, $tipMaterijala, $podtipMaterijala, $akademskaGodina, $korisnik->korisnik_id
            );

            return response()->json([
                'message' => 'Fajl uspešno sačuvan.',
                'putanja' => $putanjaKreiranogMaterijala,
            ], 200);
        } else if (!$korisnik) {
            $korisnik = Korisnik::create([
                'email' => $korisnickiMejl
            ]);
           $korisnik->verifikuj();

           $putanjaFajla = $fajl->storeAs('temp', $fajl->getClientOriginalName());
           Cache::put('materijal_cekaj_' . $korisnik->korisnik_id, [
                'putanja_fajla' => $putanjaFajla,
                'departman' => $departman,
                'nivoStudija' => $nivoStudija,
                'smer' => $smer,
                'godina' => $godina,
                'predmet' => $predmet,
                'tipMaterijala' => $tipMaterijala,
                'podtipMaterijala' => $podtipMaterijala,
                'akademskaGodina' => $akademskaGodina,
            ], now()->addMinutes(30));

            return response()->json(['message' => 'Potvrdi mejl da bi se fajl objavio.'], 200);
        } else {
            $korisnik->verifikuj();
            $putanjaFajla = $fajl->storeAs('temp', $fajl->getClientOriginalName());
            Cache::put('materijal_cekaj_' . $korisnik->korisnik_id, [
                'putanja_fajla' => $putanjaFajla,
                'departman' => $departman,
                'nivoStudija' => $nivoStudija,
                'smer' => $smer,
                'godina' => $godina,
                'predmet' => $predmet,
                'tipMaterijala' => $tipMaterijala,
                'podtipMaterijala' => $podtipMaterijala,
                'akademskaGodina' => $akademskaGodina,
            ], now()->addMinutes(30));

            return response()->json(['message' => 'Potvrdi mejl da bi se fajl objavio.'], 200);
        }
    }



   
}
