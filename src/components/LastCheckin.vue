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
    if (res.ok) {
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
const finalMessage = computed(
  () => `Last seen ${timeAgo.value}, at ${placeName.value} in ${cityName.value}`,
)
</script>

<template>
  <span v-if="isLoading">Looking for BC...<br></span>
  <span v-else>{{ finalMessage }}</span>
</template>
