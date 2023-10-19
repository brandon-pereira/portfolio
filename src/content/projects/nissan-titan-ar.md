---
id: 'nissan-titan-ar'
title: 'Nissan: Titan AR'
date: '2018-09-21T00:00:00.000Z'
languages: 'MongoDB, NodeJS'
description: 'I was tasked to build an interactive augmented reality experience for Nissan USA. Facebook recently announced AR experiences for their Messenger platform, so I was asked to use that as a medium for the experience. '
type: 'External'
status: 'Unavailable'
images:
  [
    {
      title: 'Preview of how the AR experience works',
      url: '../../assets/projects/nissan-titan-ar/0.jpg',
      contentType: 'image/jpeg'
    },
    {
      title: 'Demo of the app journey',
      url: '/projects/videos/nissan-titan-ar/1.mp4',
      contentType: 'video/mp4'
    }
  ]
link: 'https://m.me/winanissantitan'
color: '#f29a42'
---

I was tasked to build an interactive augmented reality experience for Nissan USA. Facebook recently announced AR experiences for their Messenger platform, so I was asked to use that as a medium for the experience.

In the video below you can see how the journey works. First, you're greeted by the bot to select your favourite college football team. Upon selection, you're then presented with an option to see your Titan in the camera. This is where the AR happens. Once you've played around, you can choose to share with your friends. Lastly, you're asked to submit your information for a chance to win the customized Titan.

Under the hood, we're leveraging our internal chatbot framework (developed and maintained by myself) to do a lot of the Messenger chat experience. We are also utilizing the Facebook Messenger AR Platform to build the augmented reality experience (this was especially difficult because the API isn't documented very well) and we're leveraging Azure and MongoDB for hosting/data storage.
