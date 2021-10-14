<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExperimentPresentiment1Controller extends ExperimentPresentimentController
{
    public function show()
    {
        return view('mylab.experiments.presentiment.1');
    }
}
