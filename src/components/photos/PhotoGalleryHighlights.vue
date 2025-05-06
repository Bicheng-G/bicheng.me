<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import { onMounted, ref } from 'vue'
// Remove direct import of getPhotosByName
// import { getPhotosByName } from '../../../photos/data'

const highlightNames: string[] = [
  'p-2022-06-19-22-18-13-000-1',
  'p-2019-06-17-18-21-12-000-1',
  'p-2019-09-08-15-20-10-000-1',
  'p-2023-09-09-12-26-36-000-1',
  'p-2017-07-05-07-09-09-000-1',
  'p-2020-06-03-22-00-13-000-1',
]

const photos = ref<Photo[]>([])

onMounted(async () => {
  // Dynamically import the default export (the full array)
  const { default: allPhotos } = await import('../../../photos/data')
  // Filter the array to get only the highlight photos
  photos.value = highlightNames
    .map(name => allPhotos.find(p => p.name === name))
    .filter((p): p is Photo => p !== undefined)
  // Previous logic using getPhotosByName removed:
  // photos.value = await getPhotosByName(highlightNames)
})
</script>

<template>
  <PhotoSlide v-if="photos.length" :photos="photos" />
  <div v-else>
    Loading photos...
  </div>
</template>
