---
title: Domain Email
date: 2025-05-03
lang: en
duration: 5min
tags: [tutorial, smtp, email]
---

Saw a [post from Antfu](https://antfu.me/posts/domain-email), about setting up his own domain for receiving emails. Yesterday, I've spend sometime to set up my domain email, and went further from there - using my own domain to both receive and sending emails.

Prerequisites:

- A email service provider (recommend Gmail)
- A email routing service (Cloudflare or Forward Email)
- A SMTP service provider (Resend)

## Overview

This set up is free of charge, with a limitation on numbers of email you can send with Resend's free plan (I remember they have recently increased to 3000 emails per month, which is good enough for my usage). If you have more volume, I recommend you to subscribe to Google Workspace for simplicity and peace of mind.

I will briefly go through the role of each components in this setup:

- Email routing service forwards all inbound email sent to `you@yourdomain.com` to your Gmail.
- SMTP service ito ensure the outbound email you send originate from `you@yourdomain.com`.
- Lastly, the Gmail serves as the mailbox warehouse and UI for you to view and manage all the emails.

## Email Routing

In Antfu's post, Forward Email is mentioned as a free and open-source option. But if you are using Cloudflare for your domain DNS, the good news is that Cloudflare has a native email routing support. To me, Cloudflare also has much more credibility, so why not?

The setup process is simple, just go to the domain in Cloudflare, and look for Email Routing setting. Add the email you want to forward, i.e. `hi@yourdomain.com` amd the destination to forward i.e. your gmail.

And you are done for email routing.

## SMTP Server

A SMTP server is basically a way for you to send email. While I was working on [my previous project](https://bicheng.me/posts/baking-my-personal-blog), I learn about Resend from [Cali's post](https://cali.so/blog/guide-for-cloning-my-site#f6ecf0edede3). It provides free tier for startup companies, and is definitely good enough for personal use.

Let's head over to the Resend dashboard now to create and get our API key:

1. Go to the Resend official website
2. Sign up or Log in
3. Click on "Add an API Key"
4. Verify your domain

It's that simple! Let's copy the API key - we'll need it later when configuring Gmail.

## Configure Gmail

Gmail basically uses it's own SMTP server to send your email, and now you need to tell it to use Resend's SMTP server which is bind to your domain to send the emails.

To achieve this, you need to go to setting -> Accounts and Imports -> Send email as, and configure the SMTP Credentials as follows:

```plain
Host: smtp.resend.com
Port: 25, 465, 587, 2465, or 2587 (recommend to use 465)
Username: resend
Password: YOUR_API_KEY
```

Click on save and you are done.

And now, you can say hi to me at [hi@bicheng.me](mailto:hi@bicheng.me)!
