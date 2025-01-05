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
use App\Mail\PasswordResetMail;


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

        $email = $request->input('email');
        $actor = $request->input('actor'); // Determine if it's a 'customer' or 'user'

        // Handle logic for customer or user based on 'actor'
        if ($actor == 'customer') {
            // Check if the customer exists
            $customer = DB::table('customers')->where('email', $email)->first();
            if (!$customer) {
                throw ValidationException::withMessages([
                    'email' => [trans('Aucun client trouvé avec cette adresse e-mail.')],
                ]);
            }
        } else {
            // Check if the user exists
            $user = DB::table('users')->where('email', $email)->first();
            if (!$user) {
                throw ValidationException::withMessages([
                    'email' => [trans('Aucun utilisateur trouvé avec cette adresse e-mail.')],
                ]);
            }
        }

        // Generate a temporary password
        $temporaryPassword = Str::random(10);

        // Hash the temporary password
        $hashedPassword = Hash::make($temporaryPassword);

        // Update the password for the correct table
        if ($actor === 'customer') {

            $person = DB::table('customers')->where('email', $email)->get();
            $person = $person->first();

         
            // Update the customer’s password
         DB::table('customers')->where('email', $email)->update([
                'password' => $hashedPassword,
            ]);
        } else {

            $person  = DB::table('customers')->where('email', $email)->get();
            $person = $person->first();

            dd($person->email);
            // Update the user's password
            DB::table('users')->where('email', $email)->update([
                'password' => $hashedPassword,
            ]);
        }

    
       
        try {

            $personEmail = $person->email;
            Mail::to('ouailamin84@gmail.com')->send(new PasswordResetMail($temporaryPassword,$person));
            return Inertia::render('Auth/Login', [
                'message' => 'Un mot de passe temporaire a été envoyé à votre adresse e-mail.',
                'personEmail' => $personEmail,  // Adding the email to the Inertia response
            ]);
        } catch (\Exception $e) {
            
            return back()->withErrors(['message' => 'Failed to send emails: ' . $e->getMessage()]);
        }

        
    }
}
