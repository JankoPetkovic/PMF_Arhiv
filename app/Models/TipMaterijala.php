<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipMaterijala extends Model
{
    protected $table = 'tip_materijala';

    protected $primaryKey = 'tip_materijala_id';

    public $timestamps = false;

    protected $fillable = ['naziv'];

    public static function getTipMaterijala()
    {
        return self::all();
    }

    public function podTipovi(){
        return $this->hasMany(PodTipMaterijala::class, 'tip_materijala_id', 'tip_materijala_id');
    }
}
