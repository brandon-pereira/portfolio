---
id: 'wreno-website-redesign'
title: 'Wreno: Website Rebranding'
date: '2023-06-01T00:00:00.000Z'
languages: 'CSS, TypeScript, HTML, Performance, A11Y, SEO, React'
description: 'I lead the engineering efforts for the Wreno rebranding. We used this time to reduce technical debt, improve lighthouse and SEO ratings, and standardize our tech stack.'
type: 'External'
status: 'Live'
images:
  [
    {
      title: 'Re-branded Homepage on Desktop',
      url: '../../assets/projects/wreno-website-redesign/0.png',
      contentType: 'image/png'
    },
    {
      title: 'Re-branded  Homepage on Mobile',
      url: '../../assets/projects/wreno-website-redesign/1.png',
      contentType: 'image/png'
    },
    {
      title: 'Example of a new form we introduced',
      url: '../../assets/projects/wreno-website-redesign/2.png',
      contentType: 'image/png'
    }
  ]
link: 'https://wreno.io/'
color: '#DFFE7F'
---

In early 2023, Wreno made the decision that it needed to pivot into a new market. This was a hard decision, but we ultimately landed on building compliance software. Previously, we were building a solution to connect contractors with property managers. As part of the rebranding, we prioritized rebranding the company with a more modern interface. When Wreno started, they didn't have any engineers or designers. However, since then, they'd hired myself to build an engineering team, and another to build the design team.

<!-- TODO: Add link to vendorease article when ready -->

The task of re-branding the website may seem simple, but it is a project which was running in parallel to us also rebuilding our entire product from scratch (article coming soon!) so we had limited resources for the re-branding. We chose to outsource the rebranding and have our internal team focus on the product rebuild.

I managed hiring a contractor to assist in this development while also building out tickets and a project scope in our ticketing software. As part of this, I also made it a priority to integrate this website into our existing frontend monorepo so that we had a single codebase for our frontend web engineers to maintain. This allowed us to leverage our existing component library (managed through Storybook and Chromatic) to re-use our existing buttons, inputs, etc. and simultaneously re-skin our product and website at the same time.

We also chose to leverage [Builder.io](https://builder.io), which allowed our non-technical team to build new pages and manage the websites content without the need for our engineers to need to manage coding and deploying those changes.

Lastly, we made it a top priority to improve our websites performance, SEO, and Accessibility. Now boasting a 100/100 in all categories in Lighthouse Labs!
