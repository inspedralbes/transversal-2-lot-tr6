<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserDataController extends Controller
{
    public function fetchUserGames(Request $request)
    {
        $userdata = DB::select("SELECT user_games.id, user_games.id_user, user_games.id_game, user_games.score, games.category, games.difficulty, games.play_count FROM user_games INNER JOIN games ON user_games.id_game = games.id WHERE user_games.id_user =" .$request->id_user ." ORDER BY user_games.playcount ASC");

        return $userdata;
    }
}
