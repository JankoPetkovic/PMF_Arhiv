<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetSifre extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        private string $mejlKorisnika,
        private string $resetUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Resetovanje šifre',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'reset-sifre',
            with: [
                'mejl' => $this->mejlKorisnika,
                'resetUrl' => $this->resetUrl,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
