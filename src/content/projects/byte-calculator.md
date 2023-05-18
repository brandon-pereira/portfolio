---
title: "Byte Calculator"
description: "I built a quick and simple tool to calculate the number of bytes in a given string"
date: "2020-08-27T00:00:00.000Z"
languages: "CSS, HTML, A11Y, & SEO, Javascript (ES6+)"
type: "Internal"
status: "Live"
link: "https://branclon.com/byte-calculator/"
gitUrl: "https://github.com/brandon-pereira/byte-calculator"
primaryImage: "../../assets//1vEd9RWjaAqSbr8POGxtD0.jpg"
color: "#b71da1"
---
I built a quick and simple tool to calculate the number of bytes in a given string. I found myself needing to do this a lot for a different project but all the tooling available for this wasn't very good. 

One of the more fun things was I leveraged a web worker to offload the byte size calculation and parsing. It's not really necessary, but I found when I was pasting in gigabyte sized files it really sped up the application, so why not! 

