<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExperimentPresentiment1Controller;
use App\Http\Controllers\ExperimentPresentiment2Controller;
use App\Http\Controllers\MyLabController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\Experiments\DataAnalysisController;

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
        Route::get('/presentiment/1/data-acquisition', [ExperimentPresentiment1Controller::class, 'show'])->name('.presentiment.1');
        Route::get('/presentiment/1/getImages', [ExperimentPresentiment1Controller::class, 'getImages'])->name('.presentiment.1.getImages');
        Route::post('/presentiment/1/searchUser', [ExperimentPresentiment1Controller::class, 'searchUser'])->name('.presentiment.1.searchUser');
        Route::post('/presentiment/1/data-acquisition', [ExperimentPresentiment1Controller::class, 'storeTrial'])->name('.presentiment.1.storeTrial');

        Route::get('/presentiment/2/data-acquisition', [ExperimentPresentiment2Controller::class, 'show'])->name('.presentiment.2');
        Route::get('/presentiment/2/getImages', [ExperimentPresentiment2Controller::class, 'getImages'])->name('.presentiment.2.getImages');
        Route::post('/presentiment/2/searchUser', [ExperimentPresentiment2Controller::class, 'searchUser'])->name('.presentiment.2.searchUser');
        Route::post('/presentiment/2/data-acquisition', [ExperimentPresentiment2Controller::class, 'storeTrial'])->name('.presentiment.2.storeTrial');

        Route::get('/presentiment/1&2/data-analysis', [DataAnalysisController::class, 'show'])->name('.presentiment.1&2.dataAnalysis');
        Route::any('/presentiment/1&2/get-data', [DataAnalysisController::class, 'getData'])->name('.presentiment.1&2.getData');
        Route::any('/presentiment/1&2/get-experiment/{id}', [DataAnalysisController::class, 'getExperiment'])->name('.presentiment.1&2.getExperiment');
        Route::any('/presentiment/1&2/get-experiment-list', [DataAnalysisController::class, 'getExperimentList'])->name('.presentiment.1&2.getExperimentList');
    });
});

require __DIR__.'/auth.php';
