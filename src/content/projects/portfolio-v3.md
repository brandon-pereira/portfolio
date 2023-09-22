---
id: 'X0k8dPduGQMC2ogY8Y4uw'
title: 'Portfolio v3'
date: '2018-04-01T00:00:00.000Z'
languages: 'CSS, HTML, A11Y, & SEO, Javascript (ES6+), NodeJS'
description: 'The third version of my portfolio was a complete rewrite. The rewrite was done to drastically improve load times, improve search engine rankings, and redesign a couple sections of the site.'
type: 'Internal'
status: 'Live'
images: [
      {
	"_id": "2giTsFWK76uQIyiweUEcYc",
	"title": "The redesigned header",
	"description": "The redesigned header",
	"url": "../../assets/2giTsFWK76uQIyiweUEcYc.png",
	"contentType": "image/png"
},{
	"_id": "3qrT3DiawMIIusmuGSsouW",
	"title": "The projects redesign",
	"description": "The projects redesign",
	"url": "../../assets/3qrT3DiawMIIusmuGSsouW.png",
	"contentType": "image/png"
},{
	"_id": "4I4c4lpewoMgQoYgIWMk06",
	"title": "The new apps section",
	"description": "The new apps section",
	"url": "../../assets/4I4c4lpewoMgQoYgIWMk06.png",
	"contentType": "image/png"
}]
thumbnail: '[object Object]'
link: 'https://branclon.com'
gitUrl: 'https://github.com/brandon-pereira/portfolio/tree/release/v3'
color: '#c5044b'
primaryImage: '../../assets/2giTsFWK76uQIyiweUEcYc.jpg'
---

The third version of my portfolio was a complete rewrite. The rewrite was done to drastically improve load times, improve search engine rankings, and redesign a couple sections of the site.

This version of the app introduced a brand new header which had more eye-candy (yay), a redesigned projects section which was cleaner and more powerful, as well as an "Apps" section which allowed me to put a spotlight on some of my several side projects.

I also ditched jQuery and Knockout in favour of vanilla javascript and a static site builder. I got the opportunity to write my own static site generator using Nunjucks for this project. I used all the latest ES6 javascript and got to utilize code splitting for faster loading.

This version also ditched messy JSON code management in favour of a CMS. I decided to use Contentful. This allows me to write and publish content from a user interface. After the updates are finished, a node script takes care of downloading the content, parsing it, moving the assets to my servers, and building those JSON files.  The data is verified to be in a valid state by running unit tests.

I learned a lot from this project and take pride in what I've learned.
