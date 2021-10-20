<?php

namespace App\Http\Controllers;

use App\Models\Trial;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ExperimentPresentiment1Controller extends ExperimentPresentimentController
{
    public function show(): View
    {
        return view('mylab.experiments.presentiment.1', [
            'bodyClass' => 'mylab experiment experiment-1',
        ]);
    }

    public function getImages()
    {
        $emotionalImagePath = public_path('images/emotional_images/');
        $peacefulImagePath = public_path('images/peaceful_images/');

        $emotionalImagePool = glob($emotionalImagePath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
        $peacefulImagePool = glob($peacefulImagePath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);

        $emotionalImageUrl = asset($emotionalImagePool[array_rand($emotionalImagePool)]);
        $peacefulImageUrl = asset($peacefulImagePool[array_rand($peacefulImagePool)]);

        return response()->json([
            'emotionalImageUrl' => $emotionalImageUrl,
            'peacefulImageUrl' => $peacefulImageUrl,
        ]);
    }

    public function storeTrial(Request $request): Response
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
