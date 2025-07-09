<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed, onMounted, ref } from 'vue'

dayjs.extend(relativeTime)

interface Checkin {
  venue: {
    name: string
    location: {
      city: string
    }
  }
  createdAt: number
}

const data = ref<Checkin | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/.netlify/functions/last-checkin')
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      data.value = await res.json()
    }
  }
  catch (err) {
    console.error('Failed to load last check-in', err)
  }
  finally {
    isLoading.value = false
  }
})

const timeAgo = computed(() => {
  if (!data.value?.createdAt)
    return 'sometime'
  return dayjs.unix(data.value.createdAt).fromNow()
})

const placeName = computed(() => data.value?.venue?.name || 'somewhere')
const cityName = computed(() => data.value?.venue?.location?.city || 'this universe')
const mapUrl = computed(() =>
  `https://www.google.com/maps/place/${encodeURIComponent(`${placeName.value} ${cityName.value}`)}`,
)
// We will render the sentence directly in the template so the icon span is parsed as real HTML.
</script>

<template>
  <span v-if="isLoading">Looking for BC...</span>
  <span v-else><span i-line-md-map-marker-radius-twotone /> Last seen {{ timeAgo }}, at <a :href="mapUrl" target="_blank" rel="noopener noreferrer"> {{ placeName }}<span i-ri-pushpin-line /></a> in {{ cityName }}.</span>
</template>
