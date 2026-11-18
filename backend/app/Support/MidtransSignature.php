<?php

namespace App\Support;

/**
 * Verifikasi signature notifikasi HTTP Midtrans:
 * signature_key = SHA512(order_id + status_code + gross_amount + server_key).
 * https://docs.midtrans.com/docs/https-notification-webhooks
 */
class MidtransSignature
{
    public static function isValid(array $payload, ?string $serverKey = null): bool
    {
        $serverKey = (string) ($serverKey ?? config('midtrans.MIDTRANS_SERVER_KEY'));
        if ($serverKey === '') {
            return false; // tanpa server key tidak ada yang bisa diverifikasi: tolak
        }

        $signature = $payload['signature_key'] ?? null;
        if (! is_string($signature) || $signature === '') {
            return false;
        }

        $parts = [];
        foreach (['order_id', 'status_code', 'gross_amount'] as $key) {
            $value = $payload[$key] ?? null;
            if (! is_scalar($value)) {
                return false;
            }
            $parts[] = (string) $value;
        }

        $expected = hash('sha512', implode('', $parts) . $serverKey);

        return hash_equals($expected, strtolower($signature));
    }
}
