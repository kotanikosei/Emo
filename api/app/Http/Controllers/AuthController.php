<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * ユーザーログイン
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // ユーザーを検索（emailまたはIDで検索）
        $user = User::where('email', $request->email)
            ->orWhere('id', $request->email)
            ->first();

        // パスワードチェック（ハッシュ化されていない場合は直接比較）
        if (!$user || !Hash::check($request->password, $user->password)) {
            // 開発用：ID/パスワードが "000" の場合も許可
            if ($request->email === '000' && $request->password === '000') {
                // デフォルトユーザーを作成または取得
                $user = User::firstOrCreate(
                    ['email' => 'demo@emocal.com'],
                    [
                        'name' => 'デモユーザー',
                        'password' => Hash::make('000'),
                        'is_admin' => false,
                    ]
                );
            } else {
                throw ValidationException::withMessages([
                    'email' => ['IDまたはパスワードが正しくありません。'],
                ]);
            }
        }

        // 管理者チェック
        $isAdmin = $request->has('is_admin') && $request->is_admin === true;
        if ($isAdmin && !$user->is_admin) {
            throw ValidationException::withMessages([
                'email' => ['管理者権限がありません。'],
            ]);
        }

        // トークンを作成
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
            ],
            'token' => $token,
        ]);
    }

    /**
     * ユーザーログアウト
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'ログアウトしました。',
        ]);
    }

    /**
     * 現在のユーザー情報を取得
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'is_admin' => $request->user()->is_admin,
            ],
        ]);
    }
}
