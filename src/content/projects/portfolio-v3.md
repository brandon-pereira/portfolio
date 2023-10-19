---
id: 'portfolio-v3'
title: 'Portfolio v3'
date: '2018-04-01T00:00:00.000Z'
languages: 'CSS, HTML, A11Y, SEO, Javascript (ES6+), NodeJS'
description: 'The third version of my portfolio was a complete rewrite. The rewrite was done to drastically improve load times, improve search engine rankings, and redesign a couple sections of the site.'
type: 'Internal'
status: 'Live'
images:
  [
    {
      title: 'The redesigned header',
      url: '../../assets/projects/portfolio-v3/0.png',
      contentType: 'image/png'
    },
    {
      title: 'The projects redesign',
      url: '../../assets/projects/portfolio-v3/1.png',
      contentType: 'image/png'
    },
    {
      title: 'The new apps section',
      url: '../../assets/projects/portfolio-v3/2.png',
      contentType: 'image/png'
    }
  ]
link: 'https://branclon.com'
gitUrl: 'https://github.com/brandon-pereira/portfolio/tree/release/v3'
color: '#c60b4c'
---

The third version of my portfolio was a complete rewrite. The rewrite was done to drastically improve load times, improve search engine rankings, and redesign a couple sections of the site.

This version of the app introduced a brand new header which had more eye-candy (yay), a redesigned projects section which was cleaner and more powerful, as well as an "Apps" section which allowed me to put a spotlight on some of my several side projects.

I also ditched jQuery and Knockout in favour of vanilla javascript and a static site builder. I got the opportunity to write my own static site generator using Nunjucks for this project. I used all the latest ES6 javascript and got to utilize code splitting for faster loading.

This version also ditched messy JSON code management in favour of a CMS. I decided to use Contentful. This allows me to write and publish content from a user interface. After the updates are finished, a node script takes care of downloading the content, parsing it, moving the assets to my servers, and building those JSON files. The data is verified to be in a valid state by running unit tests.

I learned a lot from this project and take pride in what I've learned.
