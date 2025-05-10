<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class prijaviMaterijal extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct($posiljaoc,$idMaterijala ,$opisPrijave)
    {
        $this->posiljaoc = $posiljaoc;
        $this->idMaterijala = $idMaterijala;
        $this->opisPrijave = $opisPrijave;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Prijava Materijala ID:' . $this->idMaterijala,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'prijavaMaterijala',
            with: [
                'posiljaoc' => $this->posiljaoc,
                'idMaterijala' => $this->idMaterijala,
                'opisPrijave' => $this->opisPrijave,
            ]);
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
