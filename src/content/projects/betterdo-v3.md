---
id: 'betterdo-v3'
title: 'BetterDo v3'
date: '2019-01-04T00:00:00.000Z'
languages: 'Javascript (ES6+), MongoDB, NodeJS, Animation, CSS, TypeScript, React'
description: 'I built a web app for organizing and maintaining to-do lists and tasks.  It features has offline support, shared lists, and push notifications. Give it a try if you''re looking to declutter your life.'
type: 'Internal'
status: 'Live'
images: [
      {
	"title": "Example of desktop experience",
	"description": "Example of desktop experience",
	"url": "../../assets/projects/betterdo-v3/0.png",
	"contentType": "image/png"
},{
	"title": "Mobile Experience",
	"description": "Mobile Experience",
	"url": "../../assets/projects/betterdo-v3/1.png",
	"contentType": "image/png"
},{
	"title": "List Members User Interface",
	"description": "List Members User Interface",
	"url": "../../assets/projects/betterdo-v3/2.png",
	"contentType": "image/png"
}]
link: 'https://betterdo.app/'
gitUrl: 'https://github.com/brandon-pereira/betterdo-ui'
color: '#055edc'
---

I built a web app for organizing and maintaining to-do lists and tasks.  It features has offline support, shared lists, and push notifications. Give it a try if you're looking to declutter your life.

Under the hood, I'm using React, styled components, MobX to render the front-end. The application also registers a service worker. This enables offline support, adds progressive web application features,  and adds push notifications.

On the back-end, I'm using Node. I have an Express server to handle requests, Passport for managing sign-in with Google, and MongoDB for storing data. I also got the codebase to 100% test coverage with Jest.

For hosting, I chose to use DigitalOcean. I had other projects using DitigalOcean, so I created a new Ubuntu server that could host all my applications inside a single instance. This allowed me to reduce my hosting costs significantly.
