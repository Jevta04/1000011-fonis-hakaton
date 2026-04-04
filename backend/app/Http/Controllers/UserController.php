<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        $user = $request->user()->load('kompanija');

        return response()->json([
            'id'      => $user->id,
            'name'    => $user->ime . ' ' . $user->prezime,
            'email'   => $user->email,
            'role'    => $user->uloga,
            'company' => [
                'id'   => $user->kompanija?->id,
                'name' => $user->kompanija?->naziv,
            ],
        ]);
    }

    public function rides(Request $request)
    {
        $user = $request->user();

        $voznje = $user->voznje()->with(['vozac'])->get()->map(function ($voznja) use ($user) {
            $pivot = $voznja->pivot;
            return [
                'id'         => $voznja->id,
                'mestoOd'    => $voznja->mestoOd,
                'mestoDo'    => $voznja->mestoDo,
                'datumVreme' => $voznja->datumVreme,
                'role'       => $pivot->uloga === 'vozac' ? 'driver' : 'passenger',
            ];
        });

        return response()->json(['data' => $voznje]);
    }
}
