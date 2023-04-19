<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrdersNotification extends Notification
{
    use Queueable;
    public $order;

    /**
     * Create a new notification instance.
     *  params bisa
     *  App\Models\Order
     *  atau
     * {
        "transaction_type": "off-us",
        "transaction_time": "2023-04-16 11:58:47",
        "transaction_status": "settlement",
        "transaction_id": "af113759-42e5-4286-b2bc-ee4da6de625b",
        "status_message": "midtrans payment notification",
        "status_code": "200",
        "signature_key": "c30351d646fceecf890a4010d091c51aa9b9c9d1ad40a67b1ba147278f61b4760cd3fb8f27572f65753e8026feb74f343a51ee94619254e72bd03d9401741731",
        "settlement_time": "2023-04-16 11:59:24",
        "payment_type": "qris",
        "order_id": "12",
        "merchant_id": "G025200197",
        "issuer": "Mandiri",
        "gross_amount": "11000.00",
        "fraud_status": "accept",
        "expiry_time": "2023-04-16 12:13:47",
        "currency": "IDR",
        "acquirer": "gopay"
        }
     * 
     * @return void
     */
    public function __construct($order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        if(!isset($this->order->code)) {
            return [
                'data' => $this->order,
            ];
        }
        return [
            'code' => $this->order->code,
            'destination_user' => $this->order->destinationUser()->first(),
            'buyer_name' => $this->order->buyer_name,
        ];
    }
}
