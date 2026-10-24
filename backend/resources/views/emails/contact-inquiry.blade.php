A new website inquiry was received.

Buyer segment: {{ $inquiry['segment'] === 'shop' ? 'Religious-supply shop' : 'Church' }}
Name: {{ $inquiry['name'] }}
Email: {{ $inquiry['email'] }}
Phone: {{ ($inquiry['phone'] ?? '') ?: 'Not provided' }}
Subject: {{ $inquiry['subject'] }}

Message:
{{ $inquiry['message'] }}
