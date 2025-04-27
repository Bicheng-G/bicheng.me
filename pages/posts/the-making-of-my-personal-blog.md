---
title: The Making of My Personal Blog
date: 2023-07-16
lang: en
duration: 5min

---

This blog documents my journey from conception to deployment of my brand spanking new personal website. Let's extend a virtual high five to Cali Castle for open sourcing the awesome website project!

# The Motivation

The thought of having a personal blog started to sprout when the idea of learning in public began to germinate in my mind. To get the full scoop on this, check out my other blog post [![img](https://spot.bicheng.me/api/favicon?url=bicheng.me)Learn Out Loud](https://bicheng.me/blog/learning-out-loud-the-journey-of-learning-in-public). Before this, my digital presence was limited to a static portfolio site showcasing past projects - you know, the usual jazz. But it was as good at posting blogs as a mime is at karaoke.

In addition to that, I've always had a soft spot for frontend development. I consider myself a "visual beast" (sounds cooler than animal, don't you think?). Gorgeous designs tickle my fancy, and sites like dribbble are like a digital spa day for me.

# The Start

Even though I hadn't yet set the wheels in motion for a new personal site, I stumbled upon this awesome website designed by Cali Castle during one of my researches on frontend frameworks and chanced upon Cali's article [![img](https://spot.bicheng.me/api/favicon?url=cali.so)React or Vue My Take](https://cali.so/blog/react-or-vue-my-take-on-web-dev).

I was instantly blown away by the website design and found myself down a rabbit hole, exploring every nook and cranny. Eventually, I found a note at the footer stating "The website is open-sourced by Cali". Score!

# The Process

I ventured over to his GitHub repository. With zero understanding of how the site functioned, I shot over an issue asking him how to manage the blogs. And voila! The very next day, he published a comprehensive guide blog titled [![img](https://spot.bicheng.me/api/favicon?url=cali.so)Guide for Cloning My Site](https://cali.so/blog/guide-for-cloning-my-site). He also specifically addressed on how to handle the blog section.

That was a jaw-dropper for me.

Without missing a beat, I spent the entire weekend building, debugging, deploying, and possibly forgetting to sleep.

## Technology Stacks Exposed

### Network

#### Domain

Thanks to the perks from the [![img](https://spot.bicheng.me/api/favicon?url=education.github.com)Github Student Developer Pack](https://education.github.com/pack), I managed to get my domain and SSL certificate for free for a year from namecheap (Love a good bargain!).

On a slightly unrelated note, I also discovered that my surname 'gu' is a top-level domain for Guam. Unfortunately, the price tag for _bicheng.gu_ made my wallet quiver in fear, so I decided to give it a pass (I might revisit it if I ever hit the 10,000 subscriber mark).

#### DNS

DNS is like the switchboard operator for the domain. We add relevant A records or CNAME records in the DNS backend to guide the domain towards the website server.

#### SSL certification

In this age of rampant cyber threats, setting up SSL certification is essential as we shift from the HTTP to the HTTPS protocol.

It's not just about being on the cool kids' club with HTTPS. It also amps up the security and credibility of the website. Visitors to non-SSL certified sites often get security warnings from browsers, which can make them skedaddle faster than a cat in a bathtub.

### Frontend

I've always been mesmerized by cool frontend designs, snazzy illustrations, and smooth interactions. Building this new website was like having my own digital Lego set to play around with.

#### pnpm

pnpm is the package manager used in this project. It's like the backstage manager, handling all the packages required for the website.

`pnpm dev` lets us step into the development environment, and visiting localhost:3000 offers a live preview of the project. Thanks to the hot module replacement (HMR) feature, any changes can be viewed live, eliminating the need to refresh the page every time.

And finally, `pnpm build` checks if the project is ready to strut its stuff on the digital runway.

#### Next.JS

Next.js is the framework used in the project. Think of it as your toolbox, packed with all the tools and components needed to build the website.

- pages folder - These are the building blocks of our website Lego set. Each page file corresponds to a webpage, and the file name is the webpage's URL.
- components folder - Think of these as the wheels, doors, and windows of your Lego model. They're pre-built React components with different functionalities.
- api folder - These are like the functional components of your Lego model, such as electric motors or lights. It helps manage the backend functionality of your Next.js application.
- public folder - These are the decorative stickers that jazz up your Lego model. It contains all the static resources, like images and fonts.
- styles folder - This is like the color and shape of your Lego bricks. It contains all the style-related files like CSS.

### Serverless

#### Vercel

Vercel is like the stage crew for developers, making it super easy to deploy and host web applications, static sites, and serverless functions. The cherry on top? Its git integration triggers automatic deployments every time you push changes to the repository. Smooth, right?

#### Sanity

Sanity is the CMS (Content Management System) used for this serverless project. It lets developers manage content from the backend separately from the frontend presentation. Plus, it offers a real-time editing experience for my blogs. Talk about sanity indeed!

## A Pinch of AI

AI, to me, is like a genie granting me wishes to comprehend an area I'm completely alien to.

The best part? I can ask all sorts of questions without the fear of looking like a dunce or pestering anyone. For example, I once asked, "How does Vercel deployment relate to pnpm build?"

Turns out, the 'pnpm build' step is vital to ensure the codes can compile successfully. If it gets a thumbs up, the chances are, Vercel will deploy it without throwing a tantrum.

# What's More

At this point, I'm in Explorer Gear^1, discovering what I don't know and diving into topics that pique my curiosity. I haven't switched to Miner Gear^1 yet to dig deeper into these topics. This is why my blogs lean more towards being notes to self, rather than specialized frontend blogs.

I'm hoping to switch to 'Miner gear' in the future, combing through each line of code to really understand the magic behind it. That's when I'll squeeze the most juice out of this project.
