---
id: 'byte-calculator'
title: 'Byte Calculator'
date: '2020-08-27T00:00:00.000Z'
languages: 'CSS, HTML, A11Y, SEO, Javascript (ES6+)'
description: 'I built a quick and simple tool to calculate the number of bytes in a given string'
type: 'Internal'
status: 'Live'
images:
  [
    {
      'title': 'Mobile View',
      'url': '../../assets/projects/byte-calculator/0.png',
      'contentType': 'image/png'
    },
    {
      'title': 'Desktop View',
      'url': '../../assets/projects/byte-calculator/1.png',
      'contentType': 'image/png'
    }
  ]
link: 'https://branclon.com/byte-calculator/'
gitUrl: 'https://github.com/brandon-pereira/byte-calculator'
color: '#b41da4'
---

I built a quick and simple tool to calculate the number of bytes in a given string. I found myself needing to do this a lot for a different project but all the tooling available for this wasn't very good.

One of the more fun things was I leveraged a web worker to offload the byte size calculation and parsing. It's not really necessary, but I found when I was pasting in gigabyte sized files it really sped up the application, so why not!
