<?php

namespace Tests\Feature;

use App\Events\OrderCreated;
use App\Support\MidtransSignature;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class MidtransWebhookTest extends TestCase
{
    private const SERVER_KEY = 'SB-Mid-server-test-key';

    protected function setUp(): void
    {
        parent::setUp();
        config(['midtrans.MIDTRANS_SERVER_KEY' => self::SERVER_KEY, 'services.discord.midtrans_webhook' => null]);
    }

    private function payload(array $overrides = []): array
    {
        $base = ['order_id' => '42', 'status_code' => '200', 'gross_amount' => '150000.00', 'transaction_status' => 'settlement'];
        $base['signature_key'] = hash('sha512', $base['order_id'] . $base['status_code'] . $base['gross_amount'] . self::SERVER_KEY);

        return array_merge($base, $overrides);
    }

    public function test_signature_helper(): void
    {
        $this->assertTrue(MidtransSignature::isValid($this->payload()));
        $this->assertFalse(MidtransSignature::isValid($this->payload(['gross_amount' => '1.00'])));
        $this->assertFalse(MidtransSignature::isValid($this->payload(['signature_key' => ''])));
        $this->assertFalse(MidtransSignature::isValid(array_diff_key($this->payload(), ['signature_key' => 1])));
        $this->assertFalse(MidtransSignature::isValid($this->payload(['order_id' => ['x']])));
        $this->assertFalse(MidtransSignature::isValid($this->payload(), ''), 'server key kosong harus menolak');
    }

    public function test_actions_webhook_rejects_invalid_signature(): void
    {
        Event::fake([OrderCreated::class]);

        $this->postJson('/api/v1/-actions/midtransWebhook', $this->payload(['signature_key' => 'palsu']))
            ->assertStatus(403);
        $this->postJson('/api/v1/-actions/midtransWebhook', ['order_id' => 'x'])->assertStatus(403);

        Event::assertNotDispatched(OrderCreated::class);
    }

    public function test_actions_webhook_accepts_valid_signature(): void
    {
        Event::fake([OrderCreated::class]);

        $this->postJson('/api/v1/-actions/midtransWebhook', $this->payload())->assertOk();

        Event::assertDispatched(OrderCreated::class);
    }

    public function test_legacy_webhook_route_rejects_invalid_and_accepts_valid(): void
    {
        $this->postJson('/api/midtrans-webhook', $this->payload(['signature_key' => 'palsu']))->assertStatus(403);
        $this->postJson('/api/midtrans-webhook', $this->payload())->assertOk();
    }
}
