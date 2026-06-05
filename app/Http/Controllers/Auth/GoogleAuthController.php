<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        // Menyimpan URL asal agar user kembali ke halaman sebelumnya
        if (!session()->has('url.intended')) {
            session(['url.intended' => url()->previous()]);
        }

        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            // Mengambil data user dari Google
            $googleUser = Socialite::driver('google')->user();

            // Debugging: Jika kamu ingin memastikan data google masuk,
            // kamu bisa hapus komentar baris di bawah ini untuk cek manual:
            // dd($googleUser->getAvatar());

            // Gunakan updateOrCreate untuk memastikan data ID dan Avatar masuk
            $user = User::updateOrCreate([
                'email' => $googleUser->getEmail(),
            ], [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(), // Pastikan kolom ini ada di Migration
                'email_verified_at' => now(),
                // Password hanya diisi jika user baru, jika user lama tidak akan berubah
                'password' => Hash::make(Str::random(24)),
            ]);

            // Paksa simpan jika updateOrCreate terasa "lewat" begitu saja
            $user->google_id = $googleUser->getId();
            $user->avatar = $googleUser->getAvatar();
            $user->save();

            Auth::login($user, true);

            return redirect()->intended('/profile');
        } catch (\Exception $e) {
            Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Gagal login via Google.');
        }
    }
}
 