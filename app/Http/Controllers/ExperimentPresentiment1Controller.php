<?php

namespace App\Http\Controllers;

use App\Models\Trial;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
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
        $blankPublicPath = public_path('');

        $emotionalImagePool = glob($emotionalImagePath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
        $peacefulImagePool = glob($peacefulImagePath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);

        $emotionalRelativePath = str_replace($blankPublicPath, '', $emotionalImagePool[array_rand($emotionalImagePool)]);
        $peacefulRelativePath = str_replace($blankPublicPath, '', $peacefulImagePool[array_rand($peacefulImagePool)]);

        $emotionalImageUrl = asset($emotionalRelativePath);
        $peacefulImageUrl = asset($peacefulRelativePath);

        return response()->json([
            'emotionalImageUrl' => $emotionalImageUrl,
            'peacefulImageUrl' => $peacefulImageUrl,
        ]);
    }

    public function storeTrial(Request $request): JsonResponse
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
