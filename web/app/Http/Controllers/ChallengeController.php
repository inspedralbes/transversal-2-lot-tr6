<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class ChallengeController extends Controller
{
    public function store(Request $request)
    {
        DB::table('challenges')->insert(
            array(
                'id_user' => $request->id_user,
                'id_user_challenged' => $request->id_user_challenged,
                'id_game' => $request->id_game
            )
        );

        return "OK";
    }

    public function get(Request $request)
    {
        $result = DB::table('challenges')->select('*')->where('id_user_challenged', $request->id_user_challenged)->get();
        for ($i=0; $i < count($result); $i++) {
            $resultNameUser = DB::table('users')->select('username')->where('id', $result[$i]->id_user)->get();
            $result[$i]->username = $resultNameUser[0]->username;
        }

        return $result;
    }
}
