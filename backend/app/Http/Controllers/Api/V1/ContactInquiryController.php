<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\ContactInquiryMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactInquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $inquiry = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:254'],
            'phone' => ['nullable', 'string', 'max:30'],
            'segment' => ['required', 'in:shop,church'],
            'subject' => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:2000'],
            'website' => ['prohibited'],
        ]);

        $inquiry['name'] = trim(str_replace(["\r", "\n"], ' ', $inquiry['name']));
        $inquiry['email'] = trim($inquiry['email']);
        $inquiry['phone'] = isset($inquiry['phone'])
            ? trim(str_replace(["\r", "\n"], ' ', $inquiry['phone']))
            : '';
        $inquiry['subject'] = trim(str_replace(["\r", "\n"], ' ', $inquiry['subject']));
        $inquiry['message'] = trim($inquiry['message']);
        $recipient = config('mail.contact_recipient');

        if (! is_string($recipient) || trim($recipient) === '') {
            report(new \RuntimeException('Contact form recipient is not configured.'));

            return response()->json([
                'message' => 'We could not send your inquiry. Please try again or contact us on WhatsApp.',
            ], 503);
        }

        if (in_array(config('mail.default'), ['log', 'array'], true)) {
            report(new \RuntimeException('Contact form mailer does not deliver email.'));

            return response()->json([
                'message' => 'We could not send your inquiry. Please retry or contact us on WhatsApp.',
            ], 503);
        }

        try {
            Mail::to($recipient)
                ->send(new ContactInquiryMail($inquiry));
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'We could not send your inquiry. Please try again or contact us on WhatsApp.',
            ], 503);
        }

        return response()->json([
            'message' => 'Your inquiry was accepted by the mail server.',
        ], 202);
    }
}
