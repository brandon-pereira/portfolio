---
id: 'wingscheap'
title: 'Wings.cheap'
date: '2017-02-01T00:00:00.000Z'
languages: 'NodeJS, MongoDB, Javascript (ES6+), HTML, A11Y, SEO, CSS'
description: "I built a web app for finding cheap wings near you. It allows you to sort by city, price, distance, or by the best wings. Give it a shot the next time you're looking for a cheap eat!"
type: 'Internal'
status: 'Live'
images:
  [
    {
      'title': 'Mobile view of landing screen',
      'description': 'Mobile view of landing screen',
      'url': '../../assets/projects/wingscheap/0.png',
      'contentType': 'image/png'
    },
    {
      'title': 'Desktop view of landing screen',
      'description': 'Desktop view of landing screen',
      'url': '../../assets/projects/wingscheap/1.png',
      'contentType': 'image/png'
    },
    {
      'title': 'Mobile view of results screen',
      'description': 'Mobile view of results screen',
      'url': '../../assets/projects/wingscheap/2.png',
      'contentType': 'image/png'
    }
  ]
link: 'https://branclon.com/wings-cheap'
gitUrl: 'https://github.com/brandon-pereira/wings-cheap'
color: '#0572f6'
---

I built a web app for finding cheap wings near you. It allows you to sort by city, price, distance, or by the best wings. Give it a shot the next time you're looking for a cheap eat!

Under the hood, I'm using AngularJS and SCSS to render the front-end. It goes through GulpJS to create production (minified) files as well as enabling live reload on both front-end and back-end (running on the same instance). The back-end is written in NodeJS (using Express to handle server portion) and utilizes a REST API. For a database, I decided to use MongoDB.

The hosting is being provided by DigitalOcean. For this project, I created a basic Linux server and manually implemented NodeJS, Mongo, Git, and NGINX. This allowed me to test my bash skills and learn how a server is set up at a lower level.

The main objectives of this application were to learn AngularJS as well as to dabble with writing NodeJS.
