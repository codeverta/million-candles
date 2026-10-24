<?php

namespace Tests\Feature;

use App\Mail\ContactInquiryMail;
use Illuminate\Support\Facades\Mail;
use RuntimeException;
use Tests\TestCase;

class ContactInquiryTest extends TestCase
{
    public function test_valid_inquiry_is_accepted_by_mailer_and_sent_to_business(): void
    {
        config(['mail.contact_recipient' => 'contact@souvenirlilin.id']);
        Mail::fake();

        $this->postJson('/api/v1/contact-inquiries', $this->validInquiry())
            ->assertAccepted()
            ->assertJsonPath('message', 'Your inquiry was accepted by the mail server.');

        Mail::assertSent(ContactInquiryMail::class, function (ContactInquiryMail $mail) {
            return $mail->to[0]['address'] === 'contact@souvenirlilin.id'
                && $mail->replyTo[0]['address'] === 'buyer@example.com'
                && $mail->inquiry['segment'] === 'church';
        });
    }

    public function test_invalid_inquiry_is_rejected_without_sending_email(): void
    {
        Mail::fake();

        $this->postJson('/api/v1/contact-inquiries', [
            'name' => 'Buyer',
            'email' => 'not-an-email',
            'message' => 'Please contact me.',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'segment', 'subject']);

        Mail::assertNothingSent();
    }

    public function test_honeypot_field_rejects_automated_submission(): void
    {
        Mail::fake();

        $this->postJson('/api/v1/contact-inquiries', array_merge(
            $this->validInquiry(),
            ['website' => 'spam.example']
        ))->assertUnprocessable()
            ->assertJsonValidationErrors(['website']);

        Mail::assertNothingSent();
    }

    public function test_mailer_failure_returns_recoverable_service_error(): void
    {
        Mail::shouldReceive('to')
            ->once()
            ->with('contact@souvenirlilin.id')
            ->andThrow(new RuntimeException('SMTP unavailable'));

        $this->postJson('/api/v1/contact-inquiries', $this->validInquiry())
            ->assertStatus(503)
            ->assertJsonPath(
                'message',
                'We could not send your inquiry. Please try again or contact us on WhatsApp.'
            );
    }

    public function test_log_mailer_never_claims_the_inquiry_was_delivered(): void
    {
        config([
            'mail.contact_recipient' => 'contact@souvenirlilin.id',
            'mail.default' => 'log',
        ]);
        Mail::fake();

        $this->postJson('/api/v1/contact-inquiries', $this->validInquiry())
            ->assertStatus(503)
            ->assertJsonPath(
                'message',
                'We could not send your inquiry. Please retry or contact us on WhatsApp.'
            );

        Mail::assertNothingSent();
    }

    private function validInquiry(): array
    {
        return [
            'name' => 'Buyer Name',
            'email' => 'buyer@example.com',
            'phone' => '+62 812-3456-7890',
            'segment' => 'church',
            'subject' => 'Altar candles',
            'message' => 'Please share product information.',
            'website' => '',
        ];
    }
}
