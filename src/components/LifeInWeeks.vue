<script setup lang="ts">
import { useNow } from '@vueuse/core'
import dayjs from 'dayjs'

const BIRTH_DATE = dayjs('1995-09-01')
const LIFE_SPAN = 75
const MONTHS_PER_YEAR = 12
const TOTAL_MONTHS = LIFE_SPAN * MONTHS_PER_YEAR

// Use fewer columns for better performance
const COLS = 60
const ROWS = Math.ceil(TOTAL_MONTHS / COLS)

// Calculate time dynamically using VueUse's useNow
const now = useNow({ interval: 1000 * 60 * 60 }) // Update every hour
// High-frequency clock for animated counters (≈50 FPS)
const nowFast = useNow({ interval: 20 })

// Milliseconds in a tropical year (365.2425 days)
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425
const age = computed(() => dayjs(now.value).diff(BIRTH_DATE, 'month'))
const monthsLived = computed(() => Math.floor(age.value))
const currentMonth = computed(() => monthsLived.value + 1)
// Animated life-percentage with 20 decimal places
const percentageLived = computed(() => {
  const ageYears = (dayjs(nowFast.value).valueOf() - BIRTH_DATE.valueOf()) / MS_PER_YEAR
  return ((ageYears / LIFE_SPAN) * 100).toFixed(20)
})

// Create a more efficient grid using CSS custom properties
const gridStyle = computed(() => ({
  '--cols': COLS,
  '--total-months': TOTAL_MONTHS,
  '--months-lived': monthsLived.value,
  '--current-month': currentMonth.value,
  'display': 'grid',
  'gridTemplateColumns': `repeat(${COLS}, minmax(0, 1fr))`,
  'gap': '2px',
  'maxWidth': '100%',
  'aspectRatio': `${COLS} / ${ROWS}`,
}))

// Generate CSS for the grid items using a single style element
const gridCSS = computed(() => {
  let css = ''

  // Generate CSS for each month position
  for (let i = 1; i <= TOTAL_MONTHS; i++) {
    const isPast = i < currentMonth.value
    const isCurrent = i === currentMonth.value
    const _isFuture = i > currentMonth.value

    let bgColor = ''
    if (isPast)
      bgColor = 'rgba(156, 163, 175, 0.4)' // gray-400/40
    else if (isCurrent)
      bgColor = 'rgba(34, 197, 94, 0.95)' // green-500/95
    else bgColor = 'rgba(229, 231, 235, 0.25)' // gray-200/25

    let darkBgColor = ''
    if (isPast)
      darkBgColor = 'rgba(107, 114, 128, 0.4)' // gray-500/40
    else if (isCurrent)
      darkBgColor = 'rgba(74, 222, 128, 0.95)' // green-400/95
    else darkBgColor = 'rgba(55, 65, 81, 0.25)' // gray-700/25

    css += `
      .life-grid-item:nth-child(${i}) {
        background-color: ${bgColor};
        transition: background-color 0.3s ease;
      }
      .dark .life-grid-item:nth-child(${i}) {
        background-color: ${darkBgColor};
      }
      ${isCurrent
        ? `
        .life-grid-item:nth-child(${i}) {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `
        : ''}
    `
  }

  return css
})

// Tooltip functionality
const activeTooltip = ref<{ month: number, x: number, y: number } | null>(null)

function showTooltip(event: MouseEvent, monthIndex: number) {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  activeTooltip.value = {
    month: monthIndex,
    x: rect.left + rect.width / 2,
    y: rect.top,
  }
}

function hideTooltip() {
  activeTooltip.value = null
}

function formatTooltipDate(monthIndex: number) {
  const year = Math.floor((monthIndex - 1) / MONTHS_PER_YEAR) + 1
  return `Age ${year}`
}
</script>

<template>
  <div class="life-in-months my-4 select-none w-full">
    <!-- Inject dynamic CSS -->
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component is="style" v-html="gridCSS" />

    <!-- Floating tooltip -->
    <Teleport to="body">
      <div
        v-if="activeTooltip"
        class="fixed z-50 bg-white dark:bg-gray-800 text-xs px-3 py-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-none"
        :style="{
          left: `${activeTooltip.x}px`,
          top: `${activeTooltip.y - 40}px`,
          transform: 'translateX(-50%)',
        }"
      >
        {{ formatTooltipDate(activeTooltip.month) }}
      </div>
    </Teleport>

    <!-- Grid container -->
    <div class="relative w-full overflow-hidden">
      <!-- Optimized Grid using CSS -->
      <div
        class="life-grid mx-auto"
        :style="gridStyle"
      >
        <div
          v-for="i in TOTAL_MONTHS"
          :key="i"
          class="life-grid-item aspect-square hover:opacity-80 cursor-pointer"
          @mouseenter="(e) => showTooltip(e, i)"
          @mouseleave="hideTooltip"
        />
      </div>
    </div>

    <!-- Simple stats at bottom -->
    <div class="mt-4 text-xs flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-gray-600 dark:text-gray-300">
      <span class="font-mono">{{ percentageLived }} %</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.life-grid {
  container-type: inline-size;
}

@container (max-width: 600px) {
  .life-grid {
    --cols: 30;
    grid-template-columns: repeat(30, minmax(0, 1fr));
  }
}
</style>
