---
id: '7Km3R1SnDTIEq3ltYyUQCr'
title: 'Wedding Photobooth'
date: '2021-09-03T00:00:00.000Z'
languages: 'NodeJS, CSS, HTML, A11Y, & SEO, Javascript (ES6+), MongoDB'
description: 'I challenged myself by building an entire photo booth solution for my wedding. The booth creates a photo strip using photos from our DLSR, prints the result automatically, and uploads them to the web leveraging Tensorflow for Facial Recognition.'
type: 'Internal'
status: 'Unavailable'
images: [
      {
	"_id": "3SpnzqnBIUh3BIz8S6zHzU",
	"title": " The Fullscreen Photo Viewer",
	"description": "",
	"url": "../../assets/3SpnzqnBIUh3BIz8S6zHzU.png",
	"contentType": "image/png"
},{
	"_id": "72tGMeKQsKizjb3JNqOFQr",
	"title": "The Similar Faces feature",
	"description": "",
	"url": "../../assets/72tGMeKQsKizjb3JNqOFQr.png",
	"contentType": "image/png"
},{
	"_id": "xk6cR2O7vLLiWpcGC7lFF",
	"title": "One of our initial prototypes in action",
	"description": "",
	"url": "../../assets/xk6cR2O7vLLiWpcGC7lFF.jpg",
	"contentType": "image/jpeg"
}]
thumbnail: '[object Object]'
gitUrl: 'https://github.com/brandon-pereira/unique-faces'
color: '#f7c10d'
primaryImage: '../../assets/3SpnzqnBIUh3BIz8S6zHzU.jpg'
---

I challenged myself by building an entire photo booth solution for my wedding. The booth creates a photo strip using photos from our DLSR, prints the result automatically, and uploads them to the web leveraging Tensorflow for facial recognition.

This is how the photo booth worked for the end-user. They would enter the booth, and select from "Print" or "Boomerang", if they selected "Print" it would automatically take four photos, display the result on screen, and automatically print a copy. They could also scan a QR code and view the photo instantly on their phone.

On the hardware end, I used a Canon Rebel T7 as a camera. To print, I used a Canon Selphy. To run the software, I used a Mac with a wireless mouse for controlling it. Both the camera and the printer were fully automated and managed by software. 

On the software end, I used DSLRBooth for a lot of the heavy lifting. It would manage to connect to the printer and camera. I also set up a simple node server that would crawl the filesystem for images, automatically upload them to S3, and process them using Tensorflow. The script scans the photo for faces and stores any faces it finds. Lastly, another script that would group similar faces and display them in a UI on the frontend website. This allowed someone to find all the photos of them easily.
