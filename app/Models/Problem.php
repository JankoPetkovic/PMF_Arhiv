<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\TipProblema;
use App\Models\KorisnickaAkcija;

class Problem extends Model
{
    protected $table = 'problemi';

    protected $primaryKey = 'id';

    public $timestamps = true;

    const CREATED_AT = 'vreme_upisa';
    const UPDATED_AT = null;

    protected $fillable = [
        'korisnik_id',
        'tip_problema_id',
        'poruka',
        'vreme_upisa',
    ];

    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }

    public function tipProblema()
    {
        return $this->belongsTo(TipProblema::class, 'tip_problema_id');
    }

    public static function zabeleziProblem($korisnikId, $tipProblema, $poruka = null){
        $tip = TipProblema::where('naziv', $tipProblema)->first();

        if(!$tip){
            return null;
        }

        $problem = self::create([
            'korisnik_id' => $korisnikId,
            'tip_problema_id' => $tip->id,
            'poruka' => $poruka,
        ]);

        $porukaAkcije = "Korisnik sa ID-em: {$korisnikId} je prijavio problem (#{$problem->id}) sa porukom: {$poruka}";
        KorisnickaAkcija::zabeleziAkciju($korisnikId, "Prijava problema", $porukaAkcije);
    }
}
