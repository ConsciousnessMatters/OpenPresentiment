<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExperimentPresentiment1Controller;
use App\Http\Controllers\MyLabController;
use App\Http\Controllers\SetupController;

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
    return view('root', ['bodyClass' => 'root']);
})->name('root');

Route::get('/opengsr', function () {
    return view('opengsr', ['bodyClass' => 'open-gsr']);
})->name('opengsr');

Route::prefix('mylab')->middleware(['auth','verified'])->name('mylab')->group(function () {
    Route::get('/', [MyLabController::class, 'show'])->name('');

    Route::prefix('setup')->name('.setup')->group(function () {
        Route::get('/', [SetupController::class, 'show'])->name('');
        Route::get('/importImages', [SetupController::class, 'importImages'])->name('.importImages');
    });

    Route::prefix('experiment')->name('.experiment')->group(function () {
        Route::get('/presentiment/1', [ExperimentPresentiment1Controller::class, 'show'])->name('.presentiment.1');
        Route::get('/presentiment/1/getImages', [ExperimentPresentiment1Controller::class, 'getImages'])->name('.presentiment.1.getImages');
        Route::post('/presentiment/1', [ExperimentPresentiment1Controller::class, 'storeTrial'])->name('.presentiment.1.storeTrial');
    });
});

require __DIR__.'/auth.php';
