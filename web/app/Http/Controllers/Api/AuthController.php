<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        //validación de los datos
        $request->validate([
            'username' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required'
        ]);

        //alta del usuario
        $user = new User();
        $user->username = $request->email;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response($user, Response::HTTP_CREATED);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60 * 24);
            $user->token = $token;
            return response($user, Response::HTTP_OK)->withoutCookie($cookie);
        } else {
            $user = 0;
            return response($user, Response::HTTP_UNAUTHORIZED);
        }
    }

    public function userProfile(Request $request)
    {
        return response()->json([
            "message" => "userProfile OK",
            "userData" => auth()->user()
        ], Response::HTTP_OK);
    }

    public function logout()
    {
        $cookie = Cookie::forget('cookie_token');
        return response(["message" => "Cierre de sesión OK"], Response::HTTP_OK)->withCookie($cookie);
    }

    public function allUsers()
    {
        $users = User::all();
        return response()->json([
            "users" => $users
        ]);
    }
}
