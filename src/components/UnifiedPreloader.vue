<!-- Unified Preloader - Performance-Optimized Balance -->
<script setup lang="ts">
import type { Photo } from '../../photos/data'
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

// Task 1: Extract Magic Numbers into Constants
const PHOTO_PRELOAD_COUNT = 8
const PHOTO_STAGGER_DELAY_MS = 250
const ROUTE_STAGGER_DELAY_MS = 80
const CRITICAL_PHOTOS_COUNT = 2 // First 2 photos get high priority
const DEV_INIT_DELAY_MS = 800
const PROD_INIT_DELAY_MS = 600
const PHOTO_PRELOAD_DELAY_MS = 400
const SCROLL_DEBOUNCE_MS = 200
const TIME_BASED_PREFETCH_THRESHOLD_S = 8
const HOVER_SETUP_DELAY_MS = 800
const TIME_TRACKING_INTERVAL_MS = 4000
const HOMEPAGE_QUICK_START_DELAY_MS = 50

// Critical resources that should always be loaded
const criticalLinks = computed(() => [
  // TODO: The font paths below are hardcoded with build hashes.
  // This is a significant fragility. If the font files are updated or the project
  // is rebuilt, these hashes will change, and these preload links will break,
  // pointing to non-existent files. This should be replaced with a dynamic
  // mechanism that reads the latest file hashes from the build manifest.
  // For now, leaving as-is but flagging as a high-priority maintenance item.
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

// Task 2: Optimize Route Prefetching - Use Set lookup instead of DOM query
function prefetchRoute(routePath: string, reason: string) {
  try {
    // Use O(1) Set lookup instead of O(n) DOM query
    if (preloadedRoutes.value.has(routePath))
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

// Task 3: Batch DOM Operations + Task 4: Add fetchpriority for critical photos
async function preloadPhotos(reason: string) {
  try {
    // Simple dynamic import
    const photosModule = await import('../../photos/data')
    const photos = photosModule.default

    // Get first N photos (already sorted by timestamp descending)
    const photosToPreload = photos.slice(0, PHOTO_PRELOAD_COUNT)

    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(`📸 Starting photo prefetch: ${photosToPreload.length} photos (${reason})`)
    }

    const criticalLinks: HTMLLinkElement[] = []
    const standardLinks: HTMLLinkElement[] = []

    // Create and separate all link elements first
    photosToPreload.forEach((photo: Photo, index: number) => {
      if (preloadedPhotos.value.has(photo.url))
        return

      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = photo.url
      link.as = 'image'
      link.crossOrigin = 'anonymous'

      preloadedPhotos.value.add(photo.url)

      if (index < CRITICAL_PHOTOS_COUNT) {
        // This is a critical photo
        link.setAttribute('fetchpriority', 'high')
        criticalLinks.push(link)
        if (isDev)
          // eslint-disable-next-line no-console
          console.log(`📷 Prepared critical photo ${index + 1}/${PHOTO_PRELOAD_COUNT}: ${photo.name} (HIGH PRIORITY)`)
      }
      else {
        // This is a standard photo
        standardLinks.push(link)
        if (isDev)
          // eslint-disable-next-line no-console
          console.log(`📷 Prepared standard photo ${index + 1}/${PHOTO_PRELOAD_COUNT}: ${photo.name}`)
      }
    })

    // 1. Insert critical links immediately to give the browser the hint ASAP.
    if (criticalLinks.length > 0) {
      const fragment = document.createDocumentFragment()
      criticalLinks.forEach(link => fragment.appendChild(link))
      document.head.appendChild(fragment)
      if (isDev)
        // eslint-disable-next-line no-console
        console.log(`⚡ Immediately dispatched ${criticalLinks.length} high-priority photo prefetch hints.`)
    }

    // 2. Stagger the insertion of standard-priority links to avoid network congestion.
    if (standardLinks.length > 0) {
      const fragment = document.createDocumentFragment()
      standardLinks.forEach((link, index) => {
        setTimeout(() => {
          fragment.appendChild(link)
          // Append fragment to DOM in batches to balance performance and responsiveness
          if (index === standardLinks.length - 1 || (index + 1) % 3 === 0) {
            document.head.appendChild(fragment.cloneNode(true))
            // Clear fragment for next batch
            while (fragment.firstChild)
              fragment.removeChild(fragment.firstChild)
          }
        }, index * PHOTO_STAGGER_DELAY_MS) // Stagger starts from 0 for the standard links
      })
    }

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
      // TODO: These slugs are hardcoded. If they change, this prefetching will break.
      // A more robust solution would be to fetch a list of "featured" or "latest"
      // posts and prefetch those dynamically.
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
    }, index * ROUTE_STAGGER_DELAY_MS)
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
  const isHomepage = route.path === '/'
  const initDelay = isDev ? DEV_INIT_DELAY_MS : PROD_INIT_DELAY_MS

  if (document.readyState === 'complete') {
    // Already loaded - start immediately but staggered
    setTimeout(() => {
      // Route prefetching first (lighter)
      executePrefetching('unified-init')

      // Photo preloading second (heavier) - only on homepage
      if (isHomepage) {
        setTimeout(() => preloadPhotos('unified-init'), PHOTO_PRELOAD_DELAY_MS)
      }
    }, initDelay)
  }
  else {
    // Wait for load event
    window.addEventListener('load', () => {
      setTimeout(() => {
        executePrefetching('unified-init')
        if (isHomepage) {
          setTimeout(() => preloadPhotos('unified-init'), PHOTO_PRELOAD_DELAY_MS)
        }
      }, initDelay)
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
  }, SCROLL_DEBOUNCE_MS)
}

// Simple time tracking
function updateTimeOnPage() {
  timeOnPage.value = Math.round((Date.now() - startTime) / 1000)

  // Time-based prefetching
  if (timeOnPage.value > TIME_BASED_PREFETCH_THRESHOLD_S) {
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
  timeTimer = setInterval(updateTimeOnPage, TIME_TRACKING_INTERVAL_MS)

  // Setup hover preloading
  setTimeout(setupHoverPreloading, HOVER_SETUP_DELAY_MS)
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
    setTimeout(startUnifiedPreloading, HOMEPAGE_QUICK_START_DELAY_MS)
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
