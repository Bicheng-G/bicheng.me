---
title: Bicheng Gu
description: Bicheng Gu's Portfolio
image: https://bicheng.me/og.png
art: random
---

<script setup>
import { defineAsyncComponent } from 'vue'

// Lazy load the LifeInWeeks component since it's at the bottom and not critical
const LifeInWeeksLazy = defineAsyncComponent(() => import('../src/components/LifeInWeeks.vue'))
</script>

Hey! I'm <span class="text-[var(--fg-deeper)]"><ruby lang="ja">Bicheng Gu<rp>(</rp><rt>必成 顾</rt><rp>)</rp></ruby></span>, a pragmatic product manager well versed in business development.

Working at {Elitetax Systems} {Soon Heng}<br>
Incubating {Elite CoPilot} {Pivox}<br>
Creator of {Pet Parents Club}<br>

Off-screen, I enjoy photography and traveling, I post [photos on this page](/photos). Inspired by learning out loud, I write [blog posts](/posts) about self-actualization, metacognition, sciense-based-parenting, etc.

I'm based in Singapore - <LastCheckin />. If you are around, let's have some coffee or work together.

<div slide-enter slide-enter-2 mb-8>
<PhotoGalleryHighlights />
</div>

As an optimizer, I'm adept in polishing the product and refining the process.

> Give me a v0 and a direct line to users, and I shall iterate it into the product users can't live without.

Looking at the entire lifespan from a distance reminds me to <span class="text-[var(--fg-deeper)]"><ruby lang="ja">live in the moment<rp>(</rp><rt>活在当下</rt><rp>)</rp></ruby></span>.

<div  slide-enter slide-enter-4 my-8 />
<ClientOnly>
  <LifeInWeeksLazy />
  <template #fallback>
    <div class="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">
      <div class="animate-pulse">Loading life visualization...</div>
    </div>
  </template>
</ClientOnly>
<div my-8 />

<div flex-auto />

---

Find me on

<p flex="~ gap-2 wrap" class="mt--2!">
  <a href="https://www.linkedin.com/in/bicheng-gu" target="_blank"><span op75 i-simple-icons-linkedin /> LinkedIn </a>
  <span op25> / </span>
  <a href="https://github.com/Bicheng-G" target="_blank"><span op75 i-simple-icons-github /> GitHub </a>
  <span op25> / </span>
  <a href="https://x.com/0xAilurus" target="_blank"><span op75 i-ri-twitter-x-fill /> Twitter </a>
  <span op25> / </span>
  <a href="https://wa.me/6585882413?text=Hi%20Bicheng%2C%20I%20saw%20your%20blog%20and%20.." target="_blank"><span op75 i-simple-icons-whatsapp /> WhatsApp </a>
</p>

Or mail me at <TextCopy inline-block relative><span font-mono>hi<span i-carbon-at/><span absolute left=1 class="opacity-0">@</span>bicheng.me</span></TextCopy>
