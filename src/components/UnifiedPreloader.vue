<!-- Unified Preloader - Combines all preloading strategies -->
<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router/auto'

const route = useRoute()
const router = useRouter()

// Development mode check for template
const isDev = import.meta.env.DEV

// Performance tracking (dev only)
const cacheHits = ref(0)
const totalNavigations = ref(0)
const preloadedRoutes = ref<Set<string>>(new Set())

// User behavior tracking
const scrollProgress = ref(0)
const timeOnPage = ref(0)
const hasStartedBehavioralPreload = ref(false)

let startTime = Date.now()
let scrollTimer: number | null = null
let timeTimer: number | null = null

// Critical resources that should always be loaded
const criticalLinks = computed(() => [
  // Critical fonts
  {
    rel: 'preload' as const,
    href: '/assets/fonts/inter-5fac53e3.woff2',
    as: 'font' as const,
    type: 'font/woff2',
    crossorigin: 'anonymous' as const,
  },
  {
    rel: 'preload' as const,
    href: '/assets/fonts/dmmono-cbe07c46.woff2',
    as: 'font' as const,
    type: 'font/woff2',
    crossorigin: 'anonymous' as const,
  },
  // DNS prefetch for external domains
  { rel: 'dns-prefetch' as const, href: 'https://raw.githubusercontent.com' },
  { rel: 'dns-prefetch' as const, href: 'https://platform.twitter.com' },
  { rel: 'dns-prefetch' as const, href: 'https://cv.bicheng.me' },
  // Preconnect to critical domains
  { rel: 'preconnect' as const, href: 'https://raw.githubusercontent.com', crossorigin: 'anonymous' as const },
  { rel: 'preconnect' as const, href: 'https://cv.bicheng.me' },
])

// Smart prefetch based on current route and user behavior
function prefetchRoute(routePath: string, reason: string) {
  try {
    // Check if already prefetched
    const existingLink = document.querySelector(`link[rel="prefetch"][href="${routePath}"]`)
    if (existingLink)
      return false

    // Create prefetch link
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = routePath
    document.head.appendChild(link)

    preloadedRoutes.value.add(routePath)

    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(`🚀 Prefetched ${routePath} (${reason})`)
    }

    return true
  }
  catch (error) {
    if (isDev) {
      console.warn(`⚠️ Failed to prefetch ${routePath}:`, error)
    }
    return false
  }
}

// Get prefetch targets based on current route and behavior
function getPrefetchTargets() {
  const targets: Array<{ route: string, priority: number }> = []

  if (route.path === '/') {
    // Homepage: prefetch main navigation
    targets.push(
      { route: '/posts', priority: 1 },
      { route: '/photos', priority: 1 },
      { route: '/projects', priority: 2 },
      { route: 'https://cv.bicheng.me', priority: 2 },
      { route: '/notes', priority: 3 },
      { route: '/quotes', priority: 3 },
    )
  }
  else if (route.path === '/posts') {
    // Posts listing: prefetch popular posts
    if (scrollProgress.value > 20) {
      targets.push(
        { route: '/posts/baking-my-personal-blog', priority: 1 },
        { route: '/posts/ai-agent-first-time', priority: 2 },
      )
    }
  }
  else if (route.path.startsWith('/posts/')) {
    // Individual post: prefetch related content
    if (scrollProgress.value > 50) {
      targets.push(
        { route: '/posts', priority: 1 },
        { route: '/photos', priority: 2 },
      )
    }
  }
  else if (route.path === '/photos') {
    targets.push(
      { route: '/posts', priority: 1 },
      { route: '/posts/photos-page', priority: 2 },
    )
  }

  return targets.sort((a, b) => a.priority - b.priority)
}

// Execute prefetching with staggered timing
function executePrefetching(reason: string) {
  const targets = getPrefetchTargets()

  targets.forEach((target, index) => {
    setTimeout(() => {
      prefetchRoute(target.route, reason)
    }, index * 100) // Stagger by 100ms
  })
}

// Post-load prefetching (zero impact on initial load)
function startPostLoadPrefetching() {
  if (hasStartedBehavioralPreload.value)
    return
  hasStartedBehavioralPreload.value = true

  // Multiple trigger strategies
  const startPrefetching = () => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('🎯 Starting post-load prefetching...')
    }
    executePrefetching('post-load')
  }

  // Strategy 1: After page is fully loaded
  if (document.readyState === 'complete') {
    setTimeout(startPrefetching, 500)
  }
  else {
    window.addEventListener('load', () => setTimeout(startPrefetching, 500), { once: true })
  }

  // Strategy 2: On user engagement
  const startOnEngagement = () => {
    if (hasStartedBehavioralPreload.value)
      return
    setTimeout(startPrefetching, 200)
  }

  window.addEventListener('scroll', startOnEngagement, { once: true, passive: true })

  // Strategy 3: Fallback after 3 seconds
  setTimeout(() => {
    if (!hasStartedBehavioralPreload.value) {
      startPrefetching()
    }
  }, 3000)
}

// Track scroll for behavioral prefetching
function updateScrollProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  scrollProgress.value = Math.round(progress)

  // Debounced behavioral prefetching
  if (scrollTimer)
    clearTimeout(scrollTimer)
  scrollTimer = window.setTimeout(() => {
    executePrefetching('scroll-behavior')
  }, 300)
}

// Track time on page
function updateTimeOnPage() {
  timeOnPage.value = Math.round((Date.now() - startTime) / 1000)

  // Time-based prefetching
  if (timeOnPage.value > 10) {
    executePrefetching('time-behavior')
  }
}

// Setup hover prefetching for navigation
function setupHoverPreloading() {
  const navLinks = document.querySelectorAll('nav a, .nav a')

  navLinks.forEach((link) => {
    const href = link.getAttribute('href')
    if (href && (href.startsWith('/') || href.startsWith('https://cv.bicheng.me'))) {
      link.addEventListener('mouseenter', () => {
        prefetchRoute(href, 'hover')
      }, { once: true })
    }
  })
}

// Performance tracking for development
function trackNavigation(to: string) {
  if (!isDev)
    return

  const wasPreloaded = preloadedRoutes.value.has(to)
  if (wasPreloaded) {
    cacheHits.value++
  }
  totalNavigations.value++

  const hitRate = totalNavigations.value > 0 ? (cacheHits.value / totalNavigations.value * 100).toFixed(1) : '0'
  // eslint-disable-next-line no-console
  console.log(`📊 Navigation to ${to}: ${wasPreloaded ? 'HIT' : 'MISS'} (${hitRate}% hit rate)`)
}

// Setup and cleanup
onMounted(() => {
  // Start post-load prefetching
  startPostLoadPrefetching()

  // Setup behavioral tracking
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  timeTimer = window.setInterval(updateTimeOnPage, 5000)

  // Setup hover preloading
  setTimeout(setupHoverPreloading, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  if (scrollTimer)
    clearTimeout(scrollTimer)
  if (timeTimer)
    clearInterval(timeTimer)
})

// Reset on route change
router.beforeEach((to) => {
  trackNavigation(to.path)
})

router.afterEach(() => {
  hasStartedBehavioralPreload.value = false
  scrollProgress.value = 0
  timeOnPage.value = 0
  startTime = Date.now()
})

// Add critical resource hints
useHead({
  link: criticalLinks.value,
})

// Expose debug info in development
if (isDev) {
  ;(window as any).__preloadingMetrics = {
    getCacheHitRate: () => totalNavigations.value > 0 ? (cacheHits.value / totalNavigations.value * 100).toFixed(1) : '0',
    getPreloadedRoutes: () => Array.from(preloadedRoutes.value),
    getTotalNavigations: () => totalNavigations.value,
    getCacheHits: () => cacheHits.value,
  }
}
</script>

<template>
  <!-- Development-only performance indicator -->
  <div
    v-if="isDev && totalNavigations > 0"
    class="fixed bottom-20 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded z-50 font-mono"
    style="font-size: 10px;"
  >
    Cache: {{ totalNavigations > 0 ? (cacheHits / totalNavigations * 100).toFixed(1) : '0' }}%
    <br>
    Nav: {{ totalNavigations }}
  </div>
</template>
