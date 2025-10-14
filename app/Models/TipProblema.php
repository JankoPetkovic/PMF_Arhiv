<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Problem;

class TipProblema extends Model
{
    protected $table = 'tip_problema';

    protected $primaryKey = 'id';

    public $timestamps = false;
    
    protected $fillable = ['naziv',];

    public function problemi()
    {
        return $this->hasMany(Problem::class, 'tip_problema_id');
    }
}
