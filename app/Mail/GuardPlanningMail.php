<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GuardPlanningMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $userEmails;
    public $monthNames;
    public $year;
    public $isValidedPlanning;
    public $isValidatePlanning;

    /**
     * Create a new message instance.
     */
    public function __construct($userEmails, $monthNames, $year, $isValidatePlanning)
    {
        $this->userEmails = $userEmails;
        $this->monthNames = $monthNames;
        $this->year = $year;
        $this->isValidatePlanning = $isValidatePlanning;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Planning' . ' ' . $this->monthNames[0] . ' ' . $this->year,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'Mail.guard_planning',
            with: [
                'userEmails' => $this->userEmails,
                'monthNames' => $this->monthNames,
                'year' => $this->year,
                'isValidatePlanning' => $this->isValidatePlanning


            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
