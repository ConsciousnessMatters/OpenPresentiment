<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ExperimentPresentiment2Controller extends ExperimentPresentimentController
{
    public function show(): View
    {
        return view('mylab.experiments.presentiment.2', [
            'bodyClass' => 'mylab experiment experiment-2',
            'user'      => $user = Auth::user(),
        ]);
    }
}
