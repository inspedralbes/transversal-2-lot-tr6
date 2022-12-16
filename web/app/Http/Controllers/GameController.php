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
        $game = new Game();
        $game->category = $request->category;
        $game->difficulty = $request->difficulty;
        $game->table_name = $request->table_name;
        $game->play_count = 1;
        $game->save();
        return response($game, Response::HTTP_CREATED);
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
}
