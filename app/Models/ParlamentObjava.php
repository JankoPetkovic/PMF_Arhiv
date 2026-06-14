<?php

namespace App\Models;

use App\Models\Korisnik;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ParlamentObjava extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'parlament_objava';

    protected $primaryKey = 'parlament_objava_id';

    public $timestamps = true;
    const CREATED_AT = 'datum_objave';
    const UPDATED_AT = 'datum_izmene';
    const DELETED_AT = 'datum_brisanja';

    protected $fillable = ['naslov', 'sadrzaj', 'slika', 'link', 'korisnik_id'];

    public function autor()
    {
        return $this->belongsTo(Korisnik::class, 'korisnik_id', 'korisnik_id');
    }

    public function anketa()
    {
        return $this->hasOne(Anketa::class, 'parlament_objava_id', 'parlament_objava_id');
    }

    /**
     * Sažet zapis objave za prikaz na frontendu (carousel, lista, izmena).
     */
    public function zaPrikaz(): array
    {
        return [
            'parlament_objava_id' => $this->parlament_objava_id,
            'naslov'              => $this->naslov,
            'sadrzaj'             => $this->sadrzaj,
            // Relativna /storage/ putanja (radi bez obzira na host/port, kao i materijali).
            'slika'               => $this->slika ? '/storage/' . $this->slika : null,
            'link'                => $this->link,
            'autor'               => $this->autor
                ? trim(($this->autor->ime ?? '') . ' ' . ($this->autor->prezime ?? '')) ?: $this->autor->email
                : null,
            'korisnik_id'         => $this->korisnik_id,
            'datum_objave'        => $this->datum_objave
                ? Carbon::parse($this->datum_objave)->format('d.m.Y')
                : null,
            'anketa'              => $this->anketa ? $this->anketa->zaPrikaz() : null,
        ];
    }
}
