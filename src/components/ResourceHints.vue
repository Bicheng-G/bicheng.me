<script setup lang="ts">
import { useHead } from '@unhead/vue'

// Add resource hints for performance optimization
useHead({
  link: [
    // Preload critical fonts
    {
      rel: 'preload',
      href: '/assets/fonts/inter-5fac53e3.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    {
      rel: 'preload',
      href: '/assets/fonts/dmmono-cbe07c46.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    // DNS prefetch for external domains
    {
      rel: 'dns-prefetch',
      href: 'https://raw.githubusercontent.com',
    },
    {
      rel: 'dns-prefetch',
      href: 'https://platform.twitter.com',
    },
    // Preconnect to critical external domains
    {
      rel: 'preconnect',
      href: 'https://raw.githubusercontent.com',
      crossorigin: 'anonymous',
    },
  ],
})
</script>

<template>
  <div style="display: none;">
    <!-- This component only adds head elements, no visual content -->
  </div>
</template>
