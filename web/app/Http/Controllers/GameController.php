<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;
use Symfony\Component\HttpFoundation\Response;

class GameController extends Controller
{
    public function store(Request $request)
    {
        $game = new Game();
        $game->category = $request->category;
        $game->difficulty = $request->difficulty;
        $game->score = $request->score;
        $game->save();
        return response($game, Response::HTTP_CREATED);
    }
}
