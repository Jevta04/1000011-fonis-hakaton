<?php

namespace App\Http\Controllers;

use App\Models\Kompanija;

class CompanyController extends Controller
{
    public function index()
    {
        return response()->json(Kompanija::select('id', 'naziv', 'pib')->get());
    }
}
