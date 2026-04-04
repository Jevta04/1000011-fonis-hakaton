<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vozilo extends Model
{
    use HasFactory;
    protected $table='vozila';
    protected $fillable = [
        'user_id',
        'brojTablica',
        'marka',
        'boja'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
