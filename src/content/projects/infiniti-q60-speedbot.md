---
title: "INFINITI: Q60 Speedbot"
description: "I built a chatbot for INFINITI USA. It allows you to compare their Q60's 0-60 speed against its competition. It ended up receiving over a thousand users within its first two days of launching."
date: "2017-04-10T00:00:00.000Z"
languages: "NodeJS"
type: "External"
status: "Unavailable"
link: "https://www.messenger.com/t/INFINITIQ60SpeedBot"
primaryImage: "../../assets//2fLYBsbwHO6sm6M0KoqIKG.jpg"
color: "#0684f9"
---
I built a chatbot for INFINITI USA. It allows you to compare their Q60's 0-60 speed against its competition. It ended up receiving over a thousand users within its first two days of launching.

From a technical perspective, it's written in NodeJS and uses DocumentDB for storing the records. It is hosted on Azure. Asides for building atop our existing framework, I also added new features which can be used on future bots. These include:

Adding an algorithm for determining the 'did you mean' values.

- Added the ability to unit test user flows and application logic.
- Added the ability to perform load testing on the application.
- Added an analytics module.
- Added a logging module which can be connected to either the console or to a database.

It also got some good news coverage: [CarThrottle](https://www.carthrottle.com/post/infiniti-has-built-a-bot-to-compare-its-hottest-q60-to-other-cars-and-you-can-talk-to-it/) and [The Drive](http://www.thedrive.com/sheetmetal/9200/infinitis-facebook-chatbot-can-tell-you-the-0-to-60-mph-time-of-almost-any-car).
