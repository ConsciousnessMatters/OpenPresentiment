<?php

use Illuminate\Support\Facades\Route;

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
});

Route::get('/opengsr', function () {
    return view('opengsr');
});

Route::get('/mylab', function () {
    return view('mylab');
})->middleware(['auth','verified'])->name('mylab');

require __DIR__.'/auth.php';
