<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kompanija_id'  => ['required', 'integer', 'exists:kompanije,id'],
            'ime'           => 'required|string|max:50',
            'prezime'       => 'required|string|max:50',
            'email'         => 'required|string|email|max:255|unique:users,email',
            'password'      => 'required|string|min:6|confirmed',
            'broj_telefona' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $user = User::create([
            'kompanija_id' => $data['kompanija_id'],
            'ime'          => $data['ime'],
            'prezime'      => $data['prezime'],
            'email'        => $data['email'],
            'password'     => $data['password'],
            'uloga'        => 'zaposleni',
            'brojTelefona' => $data['broj_telefona'],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'      => $user->id,
                'name'    => $user->ime . ' ' . $user->prezime,
                'email'   => $user->email,
                'role'    => $user->uloga,
                'company' => $user->kompanija?->naziv,
            ],
        ], 201);
    }
}
