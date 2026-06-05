<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $activeTab = $request->query('tab', 'account');

        return Inertia::render('Settings/Index', [
            'auth' => [
                'user' => $request->user(),
            ],
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'activeTab' => $activeTab,
            'status' => session('status'),
        ]);
    }
}
