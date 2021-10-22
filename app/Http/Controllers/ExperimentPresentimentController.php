<?php

namespace App\Http\Controllers;

use App\Models\Experiment;
use App\Models\Image;
use App\Models\Trial;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

abstract class ExperimentPresentimentController extends ExperimentController
{
    public function show(): View
    {
        return view('mylab.experiments.presentiment.1', [
            'bodyClass' => 'mylab experiment experiment-1',
            'user'      => $user = Auth::user(),
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
            'peacefulImageUrl'  => $peacefulImageUrl,
            'emotionalImageId'  => $emotionalImageRelativePath->id,
            'peacefulImageId'   => $peacefulImageRelativePath->id,
        ]);
    }

    public function searchUser(Request $request)
    {
        $subjectEmail = $request->input('subject-email');
        $matchingUser = User::where('email', $subjectEmail)->first();

        return response()->json([
            'userId' => $matchingUser->id ?? null,
        ]);
    }

    public function storeTrial(Request $request): JsonResponse
    {
        $experimentId = $request->input('experimentId');
        $controlModeOn = $request->input('controlNumber') == '' ? false : true;

        if (empty($experimentId)) {
            $experiment = new Experiment();
            $experiment->experimenter_user_id = $request->input('userId');
            $experiment->subject_user_id = $request->input('subjectUserId');
            $experiment->subject_agreement = $request->input('subjectAgreement');
            $experiment->op_type_number = $controlModeOn ? 2 : 1;
            $experiment->save();
        } else {
            $experiment = Experiment::find($experimentId);
        }

        $trial = new Trial();
        $trial->experiment_id = $experiment->id;
        $trial->gsr_data = $request->input('gsrData');
        $trial->event_data = $request->input('eventData');
        $trial->image_id = $request->input('imageId');
        $trial->control_number = $request->input('controlNumber');
        $success = $trial->save();

        return response()->json([
            'success'       => $success,
            'experimentId'  => $experiment->id,
        ]);
    }
}
