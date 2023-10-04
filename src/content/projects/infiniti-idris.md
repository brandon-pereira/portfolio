---
id: 'infiniti-idris'
title: 'INFINITI: Idris'
date: '2017-12-01T00:00:00.000Z'
languages: 'NodeJS, MongoDB'
description: 'I built a chatbot for INFINITI Global. It allows users to learn about their new QX50 vehicle. It uses natural language processing to figure out users intent and is localized to Canadian English and French, as well as American English.'
type: 'External'
status: 'Live'
images: [
      {
	"title": "Example of how the suggestions work. They are based on users input.",
	"description": "Example of how the suggestions work. They are based on users input.",
	"url": "../../assets/projects/infiniti-idris/0.png",
	"contentType": "image/png"
}]
link: 'https://m.me/INFINITIIDRIS?ref=brandonp_portfolio'
color: '#087fef'
---

I built a chatbot for INFINITI Global. It allows users to learn about their new QX50 vehicle. It uses natural language processing to figure out users intent and is localized to Canadian English and French, as well as American English.

From a technical perspective, it's written in NodeJS and uses MongoDB for storing records. It's hosted on Azure. Asides from building atop our existing framework, I also added new features which can be used on future bots. 

These include:

- Improved natural language processing service (through Dialogflow)
- All content and training data provided through Excel and can be exported into JSON through an export tool written in Node. 
- Built the ability to localize bots more easily
- Improved load testing module to better simulate real-world cases

This bot has helped our company get insight on what kind of questions people are asking bots and has also paved the road for another chatbot to be built for more INFINITI regions.
