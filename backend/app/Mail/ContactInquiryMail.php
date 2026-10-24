<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactInquiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $inquiry)
    {
    }

    public function build(): self
    {
        return $this
            ->replyTo($this->inquiry['email'], $this->inquiry['name'])
            ->subject('Website inquiry: ' . $this->inquiry['subject'])
            ->text('emails.contact-inquiry')
            ->with(['inquiry' => $this->inquiry]);
    }
}
