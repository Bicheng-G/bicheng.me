<script setup lang="ts">
interface Props {
  src: string
  webpSrc?: string
  avifSrc?: string
  alt: string
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  class?: string
  style?: string | Record<string, any>
  width?: number
  height?: number
  sizes?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  fetchpriority: 'auto',
})

// Generate responsive sizes if not provided
const responsiveSizes = computed(() => {
  if (props.sizes)
    return props.sizes
  return '(max-width: 320px) 280px, (max-width: 640px) 600px, (max-width: 1024px) 960px, 1200px'
})

// Check if browser supports WebP
const supportsWebP = ref(false)

onMounted(() => {
  // Simple WebP support detection
  const webP = new Image()
  webP.onload = webP.onerror = () => {
    supportsWebP.value = (webP.height === 2)
  }
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
})

// Use WebP if available and browser supports it, otherwise use original
const imageSrc = computed(() => {
  if (supportsWebP.value && props.webpSrc) {
    return props.webpSrc
  }
  return props.src
})
</script>

<template>
  <!-- Use simple img tag to avoid picture element orientation issues -->
  <img
    :src="imageSrc"
    :alt="alt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :class="$props.class"
    :style="style"
    :width="width"
    :height="height"
    :sizes="responsiveSizes"
  >
</template>
