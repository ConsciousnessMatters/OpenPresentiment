<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ExperimentPresentiment1Controller extends ExperimentPresentimentController
{
    public function show(): View
    {
        return view('mylab.experiments.presentiment.1', [
            'bodyClass' => 'mylab experiment experiment-1',
            'user'      => $user = Auth::user(),
        ]);
    }
}
