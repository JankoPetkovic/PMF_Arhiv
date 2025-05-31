<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class podTipMaterijala extends Model
{
    protected $table = 'podtip_materijala';
    protected $primaryKey = 'podtip_materijala_id';
    public $timestamps = false;
    protected $fillable = ['naziv'];

    public static function vratiPodTipoveTipa($tipMaterijala){
        return self::where('tip_materijala_id', $tipMaterijala)->get();
    }
}
