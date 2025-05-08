<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import raw from '../../../photos/data'

const photos: Photo[] = [
  'p-2022-06-19-22-18-13-000-1',
  'p-2019-06-17-18-21-12-000-1',
  'p-2019-09-08-15-20-10-000-1',
  'p-2023-09-09-12-26-36-000-1',
  'p-2017-07-05-07-09-09-000-1',
  'p-2020-06-03-22-00-13-000-1',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
