---
id: 'tetha'
title: 'Tetha'
date: '2020-10-01T00:00:00.000Z'
languages: 'Javascript (ES6+), CSS, GraphQL, MongoDB, React'
description: 'I worked with a local entrepreneur to develop a digital wall calendar. He wanted to be able to have a wall-mounted touch-screen monitor that could display current calendar events from multiple Google accounts.'
type: 'External'
status: 'Unavailable'
images:
  [
    {
      title: 'Close up of the Calendar Interface',
      url: '../../assets/projects/tetha/0.png',
      contentType: 'image/png'
    },
    {
      title: 'Example of how the calendar looks on the device',
      url: '../../assets/projects/tetha/1.jpg',
      contentType: 'image/jpeg'
    },
    {
      title: 'Example of how the Setup/Welcome screen looks',
      url: '../../assets/projects/tetha/2.jpg',
      contentType: 'image/jpeg'
    },
    {
      title: 'Example of the settings screen',
      url: '../../assets/projects/tetha/3.png',
      contentType: 'image/png'
    }
  ]
link: 'https://swiston.ca/'
color: '#2a7fd4'
---

I worked with a local entrepreneur to develop a digital wall calendar. He wanted to be able to have a wall-mounted touch-screen monitor that could display current calendar events from multiple Google accounts.

From a hardware perspective, I learned a lot on this project. All I knew when I started was that it was an Android tablet. I didn't know anything about how Kiosk mode or Android Launchers. These two features are essential for taking an Android APK and locking it as the only usable application. This project was a real opportunity for me to experiment with writing native bindings for a Cordova based application. I also explored using React Native for this project, but we ran into a couple of limitations early on that have since been resolved.

On the backend, I also learned a lot. I had experience with managing OAuth Tokens, but this project expanded that knowledge. I learned a lot about implementing OAuth at a lower level (rather than using a library), managing and leveraging refresh tokens, and managing user sessions on the front-end. For this project, I also leveraged Apollo Server to manage the front-end queries, which is something I've had a ton of experience with previously, so it was an easy grab to keep the project moving quickly.

On the front-end, this was a fun project to build. I've always found calendar interfaces pretty complex. There are conflicts (multiple overlapping events), supporting multiple users and calendars, and recurring/all-day events. I felt the solution I implemented for this worked well and scaled as we added other features. Aside from the calendar itself, it was also enjoyable to build UI interfaces commonly reserved for the operating system (Wi-Fi selection, Brightness Sliders, Sleep Schedules, etc.)

I took on this contracting position at the peak of COVID-19, so it was nice to have something to keep me occupied during the lockdown. I look forward to seeing how this project evolves.
