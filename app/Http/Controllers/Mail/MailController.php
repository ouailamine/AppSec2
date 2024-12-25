<?php

namespace App\Http\Controllers\Mail;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Mail\ManagerPlanningMail;
use App\Mail\GuardPlanningMail;
use Illuminate\Support\Facades\Mail;
use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class MailController extends Controller
{
     // Méthode pour envoyer un message
     public function sendManagerMail(Request $request): RedirectResponse
     {
         try {

            $planningId = $request->planningId;
            dd($planningId);
             
             // Préparer les données à envoyer
             $data = [
                 
             ];
 
             // Envoyer l'e-mail
             Mail::to('ouailamin84@gmail.com')->send(new ManagerPlanningMail($data));

         } catch (ValidationException $e) {
             // Collecter et afficher les erreurs de validation
             $errorMessages = collect($e->errors())->flatten()->all();
             return redirect('/accueil#map')->with('echec', 'Votre message n\'a pas été envoyé!. Causes : ' . implode(', ', $errorMessages));
         } catch (Exception $e) {
             // Gérer les autres exceptions
             return redirect('/accueil#map')->with('echec', 'Votre message n\'a pas été envoyé!. Cause : ' . $e->getMessage());
         }
 
         // Rediriger avec un message de succès
         return redirect('/accueil#map')->with('success', 'Votre message a été envoyé, Merci');
     }

     // Méthode pour envoyer un message
     public function sendGuardMail(Request $request): RedirectResponse
     {
         try {
             
             // Préparer les données à envoyer
             $data = [
                 
             ];
 
             // Envoyer l'e-mail
             Mail::to('ouailamin84@gmail.com')->send(new GuardPlanningMail($data));

         } catch (ValidationException $e) {
             // Collecter et afficher les erreurs de validation
             $errorMessages = collect($e->errors())->flatten()->all();
             return redirect('/accueil#map')->with('echec', 'Votre message n\'a pas été envoyé!. Causes : ' . implode(', ', $errorMessages));
         } catch (Exception $e) {
             // Gérer les autres exceptions
             return redirect('/accueil#map')->with('echec', 'Votre message n\'a pas été envoyé!. Cause : ' . $e->getMessage());
         }
 
         // Rediriger avec un message de succès
         return redirect('/accueil#map')->with('success', 'Votre message a été envoyé, Merci');
     }
}
