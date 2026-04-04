<?php

namespace App\Http\Controllers;

use App\Models\Kompanija;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        return response()->json(Kompanija::select('id', 'naziv', 'pib')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'naziv' => 'required|string|max:255',
            'pib'   => 'required|string|max:50|unique:kompanije,pib',
        ]);

        $company = Kompanija::create($validated);

        return response()->json($company, 201);
    }
}
