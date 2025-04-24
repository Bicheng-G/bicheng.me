<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useNow } from '@vueuse/core'
import dayjs from 'dayjs'

const BIRTH_DATE = dayjs('1995-09-01')
const LIFE_SPAN = 75
const MONTHS_PER_YEAR = 12
const TOTAL_MONTHS = LIFE_SPAN * MONTHS_PER_YEAR

// Use more columns for a better horizontal ratio
const COLS = 60 // Going back to original but ensuring good ratio
// const ROWS = Math.ceil(TOTAL_MONTHS / COLS)

// Calculate time dynamically using VueUse's useNow
const now = useNow({ interval: 1000 * 60 * 60 }) // Update every hour
const age = computed(() => dayjs(now.value).diff(BIRTH_DATE, 'month'))
const monthsLived = computed(() => Math.floor(age.value))
const currentMonth = computed(() => monthsLived.value + 1)
const percentageLived = computed(() => ((monthsLived.value / TOTAL_MONTHS) * 100).toFixed(1))

// Define type for month object
interface MonthData {
  status: 'past' | 'current' | 'future'
  date: dayjs.Dayjs
  year: number
  monthOfYear: number
  recentIndex: number
}

// Create array of months for rendering
const months = computed(() => Array.from({ length: TOTAL_MONTHS }, (_, i) => {
  const monthNumber = i + 1
  const monthDate = BIRTH_DATE.add(i, 'month')
  const yearOfLife = Math.floor(i / MONTHS_PER_YEAR) + 1
  const monthOfYear = (i % MONTHS_PER_YEAR) + 1
  const monthsTillNow = currentMonth.value - monthNumber

  return {
    status: monthNumber < currentMonth.value ? 'past' : monthNumber === currentMonth.value ? 'current' : 'future',
    date: monthDate,
    year: yearOfLife,
    monthOfYear,
    recentIndex: monthsTillNow >= 0 && monthsTillNow < 5 ? monthsTillNow : -1, // Index for recent months
  } as MonthData
}))

// Split months into rows
const rows = computed(() => {
  const result: MonthData[][] = []
  for (let i = 0; i < months.value.length; i += COLS) {
    result.push(months.value.slice(i, i + COLS))
  }
  return result
})

// Keep refs for other functionality
const gridRef = ref<HTMLElement | null>(null)
const currentRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Auto-scroll logic removed
})

// Function to bind ref conditionally
function setRef(el: Element | ComponentPublicInstance | null, month: { status: string }) {
  if (month.status === 'current' && el instanceof HTMLElement)
    currentRef.value = el
}

// Toggle tooltip visibility
const activeTooltip = ref<MonthData | null>(null)
function showTooltip(month: MonthData) {
  activeTooltip.value = month
}
function hideTooltip() {
  activeTooltip.value = null
}

// Format the tooltip date in a readable way
function formatTooltipDate(month: MonthData | null) {
  if (!month)
    return ''
  return `Age ${month.year - 1}`
}
</script>

<template>
  <div class="life-in-months my-4 select-none w-full">
    <!-- Content wrapper with tooltip position -->
    <div class="relative w-full overflow-x-auto">
      <!-- Floating tooltip -->
      <div
        v-if="activeTooltip"
        class="absolute z-10 bg-white dark:bg-gray-800 text-xs px-3 py-2 rounded shadow-lg border border-gray-200 dark:border-gray-700"
        :style="{
          top: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
        }"
      >
        {{ formatTooltipDate(activeTooltip) }}
      </div>

      <!-- Grid container -->
      <div ref="gridRef" class="relative w-full">
        <!-- Grid -->
        <div
          class="grid gap-0.5 mx-auto"
          :style="{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          }"
        >
          <template v-for="(row, rowIndex) in rows" :key="`row-${rowIndex}`">
            <div
              v-for="month in row"
              :key="month.date.format('YYYY-MM')"
              :ref="el => setRef(el, month)"
              class="aspect-square transition-colors duration-300 hover:bg-opacity-80"
              :class="{
                'bg-gray-400/40 dark:bg-gray-500/40': month.status === 'past',
                'bg-green-500/95 dark:bg-green-400/95 animate-pulse': month.status === 'current',
                'bg-gray-200/25 dark:bg-gray-700/25': month.status === 'future',
              }"
              @mouseenter="showTooltip(month)"
              @mouseleave="hideTooltip"
            />
          </template>
        </div>
      </div>
    </div>

    <!-- Simple stats at bottom -->
    <div class="mt-4 text-xs flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-gray-600 dark:text-gray-300">
      <span>{{ monthsLived }}/{{ TOTAL_MONTHS }} months</span>
      <span>{{ percentageLived }}% of life lived</span>
    </div>
  </div>
</template>
