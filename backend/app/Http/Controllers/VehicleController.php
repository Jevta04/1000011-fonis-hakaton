<?php

namespace App\Http\Controllers;

use App\Models\Vozilo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VehicleController extends Controller
{
    private function formatVehicle(Vozilo $v): array
    {
        return [
            'id'                         => $v->id,
            'marka'                      => $v->marka,
            'broj_tablica'               => $v->brojTablica,
            'boja'                       => $v->boja,
            'fuel_consumption_per_100km' => $v->fuel_consumption_per_100km,
        ];
    }

    /** GET /vehicles — moja vozila */
    public function index()
    {
        $vehicles = Vozilo::where('user_id', Auth::id())->get();
        return response()->json($vehicles->map(fn($v) => $this->formatVehicle($v)));
    }

    /** POST /vehicles */
    public function store(Request $request)
    {
        $data = $request->validate([
            'marka'                      => 'required|string|max:100',
            'broj_tablica'               => 'required|string|max:20',
            'boja'                       => 'nullable|string|max:50',
            'fuel_consumption_per_100km' => 'nullable|numeric|min:1|max:50',
        ]);

        $vehicle = Vozilo::create([
            'marka'                      => $data['marka'],
            'brojTablica'                => $data['broj_tablica'],
            'boja'                       => $data['boja'] ?? null,
            'fuel_consumption_per_100km' => $data['fuel_consumption_per_100km'] ?? null,
            'user_id'                    => Auth::id(),
        ]);

        return response()->json($this->formatVehicle($vehicle), 201);
    }

    /** PUT /vehicles/{id} */
    public function update(Request $request, int $id)
    {
        $vehicle = Vozilo::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $data = $request->validate([
            'marka'                      => 'sometimes|string|max:100',
            'broj_tablica'               => 'sometimes|string|max:20',
            'boja'                       => 'nullable|string|max:50',
            'fuel_consumption_per_100km' => 'nullable|numeric|min:1|max:50',
        ]);

        if (isset($data['broj_tablica'])) {
            $data['brojTablica'] = $data['broj_tablica'];
            unset($data['broj_tablica']);
        }

        $vehicle->update($data);

        return response()->json($this->formatVehicle($vehicle));
    }

    /** DELETE /vehicles/{id} */
    public function destroy(int $id)
    {
        $vehicle = Vozilo::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $vehicle->delete();
        return response()->json(['message' => 'Vozilo obrisano.']);
    }
}
