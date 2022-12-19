<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function store(Request $request)
    {
        
        if($request -> id_game != -1){
            $result = DB::update('UPDATE games SET play_count = play_count+1 WHERE id = '.$request->id_game);
            return response($result, Response::HTTP_CREATED);
        }else{
            $game = new Game();
            $game->category = $request->category;
            $game->difficulty = $request->difficulty;
            $game->JSONQuestions = $request->JSONQuestions;
            $game->play_count = 1;
            $game->save();
            return response($game, Response::HTTP_CREATED);
        }
    }

    public function search(Request $request)
    {
        $result = DB::table('games')->select('id')->where('table_name', $request->table_name)->get();

        if (count($result) === 0) {
            return response(json_encode("EMPTY"));
        } else {
            $playcount = DB::table('games')->select('play_count')->where('table_name', $request->table_name)->first();
            $playcount = json_encode($playcount);
            $playcount = ((int) $playcount[14]) + 1;
            DB::table('games')->select('id')->where('table_name', $request->table_name)->update(['play_count' => $playcount]);

            return response(1);
        }
    }

    public function topScores()
    {
        $result = DB::table('user_games')->select('*')->get();
        $i = 0;

        foreach ($result as $game) {
            $resultName = DB::table('users')->select('username')->where('id', $game->id_user)->get();
            $result[$i]->name = $resultName[0]->username;
            $i++;
        }

        return $result;
    }

    public function topGames()
    {
        $result = DB::select('SELECT * FROM games ORDER BY play_count DESC LIMIT 10');

        return $result;
    }

    public function jsonGame(Request $request)
    {
        $result = DB::select('SELECT JSONQuestions FROM games WHERE id = '.$request -> id_game);

        return $result;
    }
}