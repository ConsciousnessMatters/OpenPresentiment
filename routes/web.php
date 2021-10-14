<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExperimentPresentiment1Controller;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('root');
})->name('root');

Route::get('/opengsr', function () {
    return view('opengsr');
})->name('opengsr');

Route::prefix('mylab')->middleware(['auth','verified'])->name('mylab')->group(function () {

    Route::get('/', function () {
        return view('mylab');
    })->name('');

    Route::prefix('experiment')->name('.experiment')->group(function () {

        Route::get('/presentiment/1', [ExperimentPresentiment1Controller::class, 'show'])->name('.presentiment.1');

    });

});

require __DIR__.'/auth.php';
