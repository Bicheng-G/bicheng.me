---
title: Photos Page
date: 2025-03-12T12:00:00Z
lang: en
duration: 3min
---

During certain periods of my life, photography was my greatest passion. Most of the photos were shot on <ruby lang="ja">iphone<rp>(</rp><rt></rt><rp>)</rp></ruby> - they deliver good enough quality images to my standard. Most importantly, I am a lightweight enthusiast.

> The best camera is the one that's with you. --- Chase Jarvis

Instagram was once a delightful, minimalist platform for photo sharing that I frequently used - until Meta's acquisition changed everything. While I could tolerate the algorithms, ads, and short videos, the recent [change of profile photo grids' aspect ratio from square to 4:5](https://www.standard.co.uk/news/tech/instagram-update-how-adjust-profile-grid-what-changes-coming-b1205890.html) was the final straw - an arrogant decision that impacts every user's content without providing proper solutions.

I [requested to download all my data from Instagram](https://accountscenter.instagram.com/info_and_permissions/dyi/) (it took roughly a day to process in my case), and imported them to the website. Thankfully, the downloaded data was relatively easy to process, with photos dating back to 2015. I use [`sharp`](https://github.com/lovell/sharp) to process the images and compress them with [this script](https://github.com/antfu/antfu.me/blob/main/scripts/photos-manage.ts). This automation helps me manage the photos without worrying about image sizes for hosting.

Looking through these old photos brings back so many memories. As you may notice, my memories are largely with my family, hope you don't mind!

Here are some of [my recent photos](/photos):

<div mb-8>
  <PhotoGalleryAll :limit="12" class="gap-1!" />
</div>

That said, I hope to get back into regularly sharing photos, especially now that I have my own platform for it.

Thanks for reading! And I hope you find [my photos](/photos) interesting. Cheese 🧀!
