---
id: 'our-wedding'
title: 'Our Wedding'
date: '2021-09-01T00:00:00.000Z'
languages: 'NodeJS, CSS, HTML, A11Y, SEO, React, Javascript (ES6+), MongoDB'
description: "I built my now Wife and I's Wedding website from scratch. I wanted our guests to RSVP, list dietary restrictions, and learn about our big. I thought it might be helpful to build an admin panel to manage guests and message guests."
type: 'Internal'
status: 'Unavailable'
media:
  [
    {
      title: 'Our Site Logo',
      url: '../../assets/projects/our-wedding/0.png',
      contentType: 'image/png'
    },
    {
      title: 'Our Rescheduling Message',
      url: '../../assets/projects/our-wedding/1.png',
      contentType: 'image/png'
    },
    {
      title: 'Admin Panel',
      url: '../../assets/projects/our-wedding/2.png',
      contentType: 'image/png'
    }
  ]
gitUrl: 'https://github.com/brandon-pereira/hitched'
color: '#fcc510'
---

I built my now Wife and I's Wedding website from scratch. I wanted our guests to RSVP, list dietary restrictions, and learn about our big. I thought it might be helpful to build an admin panel to manage guests, message guests, and provide a quick, glanceable current guest list count.

One fun feature I had to build was the ability to change a wedding date. We had to add this because of the COVID-19 pandemic, which forced us to re-send invitations. During re-coding this, I thought it might be helpful to build an admin panel to manage guests which led me down the building and re-building of an email feature. Originally, I built it using nodemailer through Gmail but that was going into guests' spam folders frequently. I decided to then switch to using Amazon SES which worked much better.

I later modularized the whole wedding backend and published it to NPM. I figured it may be helpful to share this with others who plan to get married in the future.
