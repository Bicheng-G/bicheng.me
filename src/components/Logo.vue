<template>
  <svg
    viewBox="-10 -15 220 260"
    xmlns="http://www.w3.org/2000/svg"
    class="w-11 h-11"
  >
    <title>Bicheng Gu @ bicheng.me</title>
    <path
      class="path1" width="11" height="11"
      d="
          M137.399 67.9318
            C132.587 57.2975 123.581 35.0001 106.052 35
            C88.5226 34.9999 77.1797 57.6405 73.743 67.9318
            C69.619 80.2811 64.944 106.489 75.1178 111.155
            C85.2917 115.82 108.687 101.435 119.113 93.6596
          L148.673 72.3912
            C162.49 61.757 183.388 45.9772 192.668 51.4658
            C201.948 56.9544 196.884 70.523 194.043 75.8216
            C187.237 88.514 171.77 108.067 159.328 121.446
          L150.391 130.708

          L141.18 139.284
            C127.775 152.662 109.49 184.222 109.49 184.222
            C109.49 184.222 94.0226 208.235 100.897 220.927
            C103.876 225.73 113.614 232.247 128.738 219.898
            C132.748 216.353 141.455 207.549 146.954 187.995
            C152.454 168.442 150.391 130.708 150.391 130.708

          C148.673 105.666 142.28 79.7036 141.18 77.7826
        "
      stroke="black" stroke-width="6.5"
      stroke-linecap="round" stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion) {
  .path1 {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}
@media print {
  .path1 {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}
@keyframes grow {
  0% {
    stroke-dashoffset: 800px;
    stroke-dasharray: 0 800px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  40% {
    stroke-dasharray: 800px 0;
  }
  85% {
    stroke-dasharray: 800px 0;
  }
  95%,
  to {
    stroke-dasharray: 0 800px;
  }
}
.path1 {
  stroke-dashoffset: 800px;
  stroke-dasharray: 800px 0;
  animation: grow 10s ease forwards infinite;
  transform-origin: center;
  stroke: #303030;
  animation-delay: 0s;
}
.dark .path1 {
  stroke: #fdfdfd;
}
</style>
