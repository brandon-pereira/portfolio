---
title: "BetterDo v3"
description: "I built a web app for organizing and maintaining to-do lists and tasks.  It features has offline support, shared lists, and push notifications. Give it a try if you're looking to declutter your life."
date: "2019-01-04T00:00:00.000Z"
languages: "Javascript (ES6+), MongoDB, NodeJS, Animation, CSS, TypeScript, React"
type: "Internal"
status: "Live"
link: "https://betterdo.app/"
gitUrl: "https://github.com/brandon-pereira/betterdo-ui"
primaryImage: "../../assets//4loe2vKe5Bi91vAYlozgMv.jpg"
color: "#0463e4"
---
I built a web app for organizing and maintaining to-do lists and tasks.  It features has offline support, shared lists, and push notifications. Give it a try if you're looking to declutter your life.

Under the hood, I'm using React, styled components, MobX to render the front-end. The application also registers a service worker. This enables offline support, adds progressive web application features,  and adds push notifications.

On the back-end, I'm using Node. I have an Express server to handle requests, Passport for managing sign-in with Google, and MongoDB for storing data. I also got the codebase to 100% test coverage with Jest.

For hosting, I chose to use DigitalOcean. I had other projects using DitigalOcean, so I created a new Ubuntu server that could host all my applications inside a single instance. This allowed me to reduce my hosting costs significantly.
