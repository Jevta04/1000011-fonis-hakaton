<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVoznja extends Model
{
    use HasFactory;

    protected $table = 'user_voznja';

    protected $fillable = [
        'user_id',
        'voznja_id',
        'uloga',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function voznja()
    {
        return $this->belongsTo(Voznja::class);
    }
}
