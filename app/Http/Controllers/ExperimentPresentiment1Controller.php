<?php

namespace App\Http\Controllers;

use App\Models\Trial;
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

        $trial = new Trial();
        $trial->experiment_id = 1;
        $trial->gsr_data = $gsrData;
        $trial->event_data = $eventData;
        $success = $trial->save();

        return response()->json([
            'success' => $success,
        ]);
    }
}
