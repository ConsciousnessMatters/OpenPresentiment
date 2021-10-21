<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Trial;
use Illuminate\Database\Eloquent\Builder;
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
        $emotionalImageRelativePath = Image::whereHas('type', function (Builder $query) {
                $query->where('name', 'Emotional');
            })
            ->inRandomOrder()
            ->first();

        $peacefulImageRelativePath = Image::whereHas('type', function (Builder $query) {
                $query->where('name', 'Peaceful');
            })
            ->inRandomOrder()
            ->first();

        $emotionalImageUrl = asset($emotionalImageRelativePath->path);
        $peacefulImageUrl = asset($peacefulImageRelativePath->path);

        return response()->json([
            'emotionalImageUrl' => $emotionalImageUrl,
            'peacefulImageUrl' => $peacefulImageUrl,
            'emotionalImageId' => $emotionalImageRelativePath->id,
            'peacefulImageId' => $peacefulImageRelativePath->id,
        ]);
    }

    public function storeTrial(Request $request): JsonResponse
    {
        $gsrData = $request->input('gsrData');
        $eventData = $request->input('eventData');
        $imageId = $request->input('imageId');

        $trial = new Trial();
        $trial->experiment_id = 1;
        $trial->gsr_data = $gsrData;
        $trial->event_data = $eventData;
        $trial->image_id = $imageId;
        $success = $trial->save();

        return response()->json([
            'success' => $success,
        ]);
    }
}
