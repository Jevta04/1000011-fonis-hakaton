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
            'phone'   => $user->brojTelefona,
            'company' => [
                'id'   => $user->kompanija?->id,
                'name' => $user->kompanija?->naziv,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'phone' => 'nullable|string|max:30',
        ]);

        if (array_key_exists('phone', $data)) {
            $user->brojTelefona = $data['phone'];
        }
        $user->save();

        return response()->json(['phone' => $user->brojTelefona]);
    }

    public function rides(Request $request)
    {
        $user  = $request->user();
        $now   = now();

        $voznje = $user->voznje()->with(['vozac'])->get()->map(function ($voznja) use ($user, $now) {
            $pivot  = $voznja->pivot;
            $vozac  = $voznja->vozac->first();
            $isPast = $voznja->datumVreme && $voznja->datumVreme->lt($now);

            return [
                'id'          => $voznja->id,
                'mestoOd'     => $voznja->mestoOd,
                'mestoDo'     => $voznja->mestoDo,
                'datumVreme'  => $voznja->datumVreme?->format('Y-m-d H:i'),
                'seats'       => $voznja->seats,
                'smoking'     => $voznja->smoking,
                'music'       => $voznja->muzika,
                'airCondition'=> $voznja->klima,
                'vehicle'     => $voznja->marka,
                'boja'        => $voznja->boja,
                'brojTablica' => $voznja->brojTablica,
                'driver'       => $vozac ? trim("{$vozac->ime} {$vozac->prezime}") : null,
                'driverId'     => $vozac?->id,
                'avatar'       => $vozac ? strtoupper(substr($vozac->ime ?? '?', 0, 1)) : '?',
                'driver_phone' => $vozac?->brojTelefona,
                'role'         => $pivot->uloga === 'vozac' ? 'driver' : 'passenger',
                'isPast'       => $isPast,
            ];
        });

        return response()->json(['data' => $voznje]);
    }
}
