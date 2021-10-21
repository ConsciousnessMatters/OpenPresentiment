<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MyLabController extends Controller
{
    public function show()
    {
        return view('mylab', ['bodyClass' => 'mylab']);
    }
}
