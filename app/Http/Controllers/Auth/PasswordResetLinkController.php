<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;


class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');

        // Vérifiez si l'utilisateur existe
        $user = DB::table('users')->where('email', $email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => [trans('validation.user_not_found')],
            ]);
        }

        // Générer un mot de passe temporaire
        $temporaryPassword = Str::random(10);

        // Hasher le mot de passe
        $hashedPassword = Hash::make($temporaryPassword);

        // Mettre à jour le mot de passe de l'utilisateur dans la base de données
        DB::table('users')->where('email', $email)->update([
            'password' => $hashedPassword,
        ]);

        // Envoyer un e-mail avec le mot de passe temporaire
        Mail::send('emails.password-reset', ['password' => $temporaryPassword], function ($message) use ($email) {
            $message->to($email);
            $message->subject('Votre mot de passe temporaire');
        });

        // Répondre avec un message de succès et rediriger vers la page de connexion
        return Inertia::render('Auth/Login', [
            'status' => __('Un mot de passe temporaire a été envoyé à votre adresse e-mail. Veuillez l’utiliser pour vous connecter et changer votre mot de passe.'),
        ]);
    }
}
