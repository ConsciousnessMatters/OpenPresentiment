<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExperimentPresentiment1Controller extends ExperimentPresentimentController
{
    public function show()
    {
        return view('mylab.experiments.presentiment.1', [
            'bodyClass' => 'mylab experiment experiment-1',
        ]);
    }

    public function storeTrial(Request $request)
    {
        $gsrData = $request->input('gsrData');
        $eventData = $request->input('eventData');

        return response()->json([
            'gsrData' => $gsrData,
            'eventData' => $eventData,
        ]);
    }
}
