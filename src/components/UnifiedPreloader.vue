<!-- Unified Preloader - Performance-Optimized Balance -->
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
const preloadedPhotos = ref<Set<string>>(new Set())

// User behavior tracking
const scrollProgress = ref(0)
const timeOnPage = ref(0)
const hasStartedBehavioralPreload = ref(false)
const hasStartedPhotoPreload = ref(false)

// Minimal state management - no overhead
let startTime = Date.now()
let scrollTimer: ReturnType<typeof setTimeout> | null = null
let timeTimer: ReturnType<typeof setInterval> | null = null

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

// Lightweight prefetch - keep it simple and fast
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

// Optimized photo preloading - single strategy, minimal overhead
async function preloadPhotos(reason: string) {
  try {
    // Simple dynamic import
    const photosModule = await import('../../photos/data')
    const photos = photosModule.default

    // Get first 6 photos (already sorted by timestamp descending)
    const photosToPreload = photos.slice(0, 6)

    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(`📸 Starting photo prefetch: ${photosToPreload.length} photos (${reason})`)
    }

    // Simple staggered preloading - no complex promises or tracking
    photosToPreload.forEach((photo: any, index: number) => {
      setTimeout(() => {
        // Check if already preloaded
        if (preloadedPhotos.value.has(photo.url))
          return

        // Create prefetch link for image
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = photo.url
        link.as = 'image'
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)

        preloadedPhotos.value.add(photo.url)

        if (isDev) {
          // eslint-disable-next-line no-console
          console.log(`📷 Prefetched photo ${index + 1}/6: ${photo.name} (${reason})`)
        }
      }, index * 250) // Reduced from 300ms to 250ms for better performance
    })

    return true
  }
  catch (error) {
    if (isDev) {
      console.warn(`⚠️ Failed to preload photos:`, error)
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

// Simple prefetching execution - keep it lightweight
function executePrefetching(reason: string) {
  const targets = getPrefetchTargets()

  targets.forEach((target, index) => {
    setTimeout(() => {
      prefetchRoute(target.route, reason)
    }, index * 80) // Reduced from 100ms to 80ms for snappier performance
  })
}

// THE KEY FIX: Single unified initialization strategy
function startUnifiedPreloading() {
  if (hasStartedPhotoPreload.value || hasStartedBehavioralPreload.value)
    return

  // Mark both as started to prevent race conditions
  hasStartedPhotoPreload.value = true
  hasStartedBehavioralPreload.value = true

  if (isDev) {
    // eslint-disable-next-line no-console
    console.log('🚀 Starting unified preloading strategy...')
  }

  // Single coordinated strategy - the root fix for refresh behavior
  if (document.readyState === 'complete') {
    // Already loaded - start immediately but staggered
    setTimeout(() => {
      // Route prefetching first (lighter)
      executePrefetching('unified-init')

      // Photo preloading second (heavier) - only on homepage
      if (route.path === '/') {
        setTimeout(() => preloadPhotos('unified-init'), 400)
      }
    }, isDev ? 800 : 600) // Shorter delay in production
  }
  else {
    // Wait for load event
    window.addEventListener('load', () => {
      setTimeout(() => {
        executePrefetching('unified-init')
        if (route.path === '/') {
          setTimeout(() => preloadPhotos('unified-init'), 400)
        }
      }, isDev ? 800 : 600)
    }, { once: true })
  }
}

// Lightweight scroll tracking
function updateScrollProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  scrollProgress.value = Math.round(progress)

  // Lightweight debounced prefetching
  if (scrollTimer)
    clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    executePrefetching('scroll-behavior')
  }, 200) // Reduced from 300ms for better responsiveness
}

// Simple time tracking
function updateTimeOnPage() {
  timeOnPage.value = Math.round((Date.now() - startTime) / 1000)

  // Time-based prefetching
  if (timeOnPage.value > 8) { // Reduced from 10s for earlier prefetching
    executePrefetching('time-behavior')
  }
}

// Lightweight hover prefetching
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

// Streamlined setup and cleanup
onMounted(() => {
  // THE MAIN FIX: Single unified strategy
  startUnifiedPreloading()

  // Lightweight behavioral tracking
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  timeTimer = setInterval(updateTimeOnPage, 4000) // Reduced from 5s for better tracking

  // Setup hover preloading
  setTimeout(setupHoverPreloading, 800) // Reduced from 1000ms
})

onUnmounted(() => {
  // Simple cleanup - only what's necessary
  window.removeEventListener('scroll', updateScrollProgress)
  if (scrollTimer)
    clearTimeout(scrollTimer)
  if (timeTimer)
    clearInterval(timeTimer)
})

// Reset on route change - keep it simple
router.beforeEach((to) => {
  trackNavigation(to.path)
})

router.afterEach(() => {
  // Reset state
  hasStartedBehavioralPreload.value = false
  hasStartedPhotoPreload.value = false
  scrollProgress.value = 0
  timeOnPage.value = 0
  startTime = Date.now()

  // Start unified preloading for new route
  if (route.path === '/') {
    setTimeout(startUnifiedPreloading, 50) // Quick start for homepage
  }
})

// Add critical resource hints
useHead({
  link: criticalLinks.value,
})

// Lightweight debug info in development
if (isDev) {
  ;(window as any).__preloadingMetrics = {
    getCacheHitRate: () => totalNavigations.value > 0 ? (cacheHits.value / totalNavigations.value * 100).toFixed(1) : '0',
    getPreloadedRoutes: () => Array.from(preloadedRoutes.value),
    getPreloadedPhotos: () => Array.from(preloadedPhotos.value),
    getTotalNavigations: () => totalNavigations.value,
    getCacheHits: () => cacheHits.value,
    getPhotoPreloadCount: () => preloadedPhotos.value.size,
  }
}
</script>

<template>
  <!-- Development-only performance indicator -->
  <div
    v-if="isDev && (totalNavigations > 0 || preloadedPhotos.size > 0)"
    class="fixed bottom-20 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded z-50 font-mono"
    style="font-size: 10px;"
  >
    Cache: {{ totalNavigations > 0 ? (cacheHits / totalNavigations * 100).toFixed(1) : '0' }}%
    <br>
    Nav: {{ totalNavigations }}
    <br>
    Photos: {{ preloadedPhotos.size }}
  </div>
</template>
