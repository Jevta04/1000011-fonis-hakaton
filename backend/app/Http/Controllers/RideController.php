<?php

namespace App\Http\Controllers;

use App\Models\Voznja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RideController extends Controller
{
    /** GET /rides — lista dostupnih vožnji */
    public function index(Request $request)
    {
        $query = Voznja::with(['vozac'])
            ->where('datumVreme', '>=', now())
            ->where('seats', '>', 0)
            ->orderBy('datumVreme');

        if ($request->filled('mestoOd')) {
            $query->where('mestoOd', 'ilike', '%' . $request->mestoOd . '%');
        }
        if ($request->filled('mestoDo')) {
            $query->where('mestoDo', 'ilike', '%' . $request->mestoDo . '%');
        }
        if ($request->filled('date')) {
            $query->whereDate('datumVreme', $request->date);
        }

        $limit = min((int) ($request->limit ?? 20), 50);
        $rides = $query->limit($limit)->get();

        return response()->json($rides->map(fn($r) => $this->format($r)));
    }

    /** POST /rides — kreiranje vožnje */
    public function store(Request $request)
    {
        $data = $request->validate([
            'mestoOd'          => 'required|string|max:255',
            'mestoDo'          => 'required|string|max:255',
            'datumVreme'       => 'required|date|after:now',
            'smoking'          => 'boolean',
            'music'            => 'boolean',
            'airCondition'     => 'boolean',
            'seats'            => 'integer|min:1|max:8',
            'vozilo.broj_tablica' => 'required|string|max:20',
            'vozilo.marka'     => 'required|string|max:100',
            'vozilo.boja'      => 'nullable|string|max:50',
        ]);

        $vozilo = $data['vozilo'];

        $voznja = Voznja::create([
            'mestoOd'     => $data['mestoOd'],
            'mestoDo'     => $data['mestoDo'],
            'datumVreme'  => $data['datumVreme'],
            'smoking'     => $data['smoking']      ?? false,
            'muzika'      => $data['music']        ?? false,
            'klima'       => $data['airCondition'] ?? false,
            'seats'       => $data['seats']        ?? 4,
            'brojTablica' => $vozilo['broj_tablica'],
            'marka'       => $vozilo['marka'],
            'boja'        => $vozilo['boja'] ?? null,
        ]);

        // Dodaj vozača u pivot tabelu
        $voznja->users()->attach(Auth::id(), ['uloga' => 'vozac']);

        $voznja->load('vozac');

        return response()->json($this->format($voznja), 201);
    }

    /** GET /rides/:id */
    public function show(int $id)
    {
        $voznja = Voznja::with(['vozac', 'putnici'])->findOrFail($id);
        return response()->json($this->format($voznja, true));
    }

    /** POST /rides/:id/join */
    public function join(int $id)
    {
        $voznja = Voznja::findOrFail($id);

        if ($voznja->seats <= 0) {
            return response()->json(['message' => 'Vožnja je popunjena.'], 422);
        }

        $userId = Auth::id();

        // Vozač ne može biti putnik u sopstvenoj vožnji
        if ($voznja->vozac()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Ne možete se priključiti sopstvenoj vožnji.'], 422);
        }

        // Proveri da li je već u vožnji
        if ($voznja->users()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Već ste u ovoj vožnji.'], 422);
        }

        $voznja->users()->attach($userId, ['uloga' => 'putnik']);
        $voznja->decrement('seats');

        return response()->json(['message' => 'Uspešno ste se priključili vožnji.']);
    }

    /** POST /rides/:id/leave */
    public function leave(int $id)
    {
        $voznja = Voznja::findOrFail($id);
        $userId = Auth::id();

        $pivot = $voznja->users()->where('user_id', $userId)->first();

        if (!$pivot || $pivot->pivot->uloga === 'vozac') {
            return response()->json(['message' => 'Ne možete napustiti ovu vožnju.'], 422);
        }

        $voznja->users()->detach($userId);
        $voznja->increment('seats');

        return response()->json(['message' => 'Uspešno ste napustili vožnju.']);
    }

    /** DELETE /rides/:id — brisanje (samo vozač) */
    public function destroy(int $id)
    {
        $voznja = Voznja::findOrFail($id);

        $isDriver = $voznja->vozac()
            ->where('user_id', Auth::id())
            ->exists();

        if (!$isDriver) {
            return response()->json(['message' => 'Nemate dozvolu.'], 403);
        }

        $voznja->delete();
        return response()->json(['message' => 'Vožnja obrisana.']);
    }

    /** Mapira Voznja na format koji frontend očekuje */
    private function format(Voznja $v, bool $withPassengers = false): array
    {
        $vozac = $v->vozac->first();

        $result = [
            'id'          => $v->id,
            'mestoOd'     => $v->mestoOd,
            'mestoDo'     => $v->mestoDo,
            'datumVreme'  => $v->datumVreme?->toISOString(),
            'seats'       => $v->seats,
            'smoking'     => $v->smoking,
            'music'       => $v->muzika,
            'airCondition'=> $v->klima,
            'vehicle'     => $v->marka,
            'driver'      => $vozac ? trim("{$vozac->ime} {$vozac->prezime}") : null,
            'driverId'    => $vozac?->id,
            'avatar'      => $vozac ? strtoupper(substr($vozac->ime ?? '?', 0, 1)) : '?',
        ];

        if ($withPassengers) {
            $result['passengers'] = $v->putnici->map(fn($u) => [
                'id'     => $u->id,
                'name'   => trim("{$u->ime} {$u->prezime}"),
                'avatar' => strtoupper(substr($u->ime ?? '?', 0, 1)),
            ]);
        }

        return $result;
    }
}
