<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\UserGameController;
use App\Http\Controllers\UserDataController;
use App\Http\Controllers\DemoGamesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('user-profile', [AuthController::class, 'userProfile']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::get('users', [AuthController::class, 'allUsers']);

Route::post('store-game', [GameController::class, 'store']);

Route::post('store-user', [UserGameController::class, 'storeUserGame']);

Route::post('search-game', [GameController::class, 'search']);

Route::post('user-data', [UserDataController::class, 'fetchUserGames']);

Route::get('search-top-scores', [GameController::class, 'topScores']);

Route::get('search-top-games', [GameController::class, 'topGames']);

Route::get('daily-game-info', [GameController::class, 'dailyGameInfo']);

Route::post('json-game', [GameController::class, 'jsonGame']);

Route::post('select-demo', [DemoGamesController::class, 'index']);