<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ManagerPlanningMail extends Mailable
{
    use Queueable, SerializesModels;

    public $siteDetails;
    public $monthNames;
    public $year;
    public $isValidatePlanning;

    /**
     * Create a new message instance.
     */
    public function __construct($siteDetails, $monthNames, $year, $isValidatePlanning)
    {
        // Initialisation des propriétés
        $this->siteDetails = $siteDetails;
        $this->monthNames = $monthNames;
        $this->year = $year;
        $this->isValidatePlanning = $isValidatePlanning;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // Retourner l'enveloppe du message
        return new Envelope(
            subject: 'Planning générale de' . ' ' . $this->siteDetails[1]['name'] . ' ' . $this->monthNames[0] . ' ' . $this->year,
            replyTo: [$this->siteDetails['email'] ?? 'default@example.com'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {

        // Retourner le contenu du message
        return new Content(
            view: 'Mail.manager_planning',
            with: [
                'siteDetails' => $this->siteDetails,
                'monthNames' => $this->monthNames,
                'year' => $this->year,
                'isValidatePlanning' => $this->isValidatePlanning,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        // Si vous avez des fichiers à ajouter, vous pouvez les retourner ici
        return [];
    }
}
