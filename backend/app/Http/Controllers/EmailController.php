<?php

namespace App\Http\Controllers;

use App\Mail\RegisterEmail;
use Illuminate\Http\Request;


use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function index()
    {

        // $result = Mail::to("rabihutomo11@icloud.com")->send(new RegisterEmail());

        // dd($result);
        return "Email telah dikirim";
    }
}
