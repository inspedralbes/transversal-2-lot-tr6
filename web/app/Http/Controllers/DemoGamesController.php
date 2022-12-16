<?php

namespace App\Http\Controllers;

use App\Models\demo_games;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DemoGamesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $demo_games = DB::table('demo_games')
        //     ->where('difficulty', '=', 1)
        //     ->get();
 
        // return view('user.index', ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\demo_games  $demo_games
     * @return \Illuminate\Http\Response
     */
    public function show(demo_games $demo_games)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\demo_games  $demo_games
     * @return \Illuminate\Http\Response
     */
    public function edit(demo_games $demo_games)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\demo_games  $demo_games
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, demo_games $demo_games)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\demo_games  $demo_games
     * @return \Illuminate\Http\Response
     */
    public function destroy(demo_games $demo_games)
    {
        //
    }
}
