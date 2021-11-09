<?php

namespace App\Http\Controllers\Experiments;

use App\Http\Controllers\Controller;
use App\Models\Experiment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DataAnalysisController extends Controller
{
    public function show(): View
    {
        return view('mylab.experiments.data-analysis', [
            'bodyClass' => 'mylab data-analysis',
            'user'      => $user = Auth::user(),
        ]);
    }

    public function getData()
    {
        $experimentalData = Experiment::with('trials.image.type')->get();

        return response()->json([
            'experimentalData' => $experimentalData,
        ]);
    }

    public function getExperiment($id)
    {
        $experimentalData = Experiment::with('trials.image.type')->where('id', $id)->get();

        return response()->json([
            'experimentalData' => $experimentalData,
        ]);
    }

    public function getExperimentList()
    {
        $experimentList = Experiment::with('trials:id,experiment_id,image_id,control_number,event_data', 'trials.image.type')->get();

        return response()->json([
            'experimentalData' => $experimentList,
        ]);
    }
}
