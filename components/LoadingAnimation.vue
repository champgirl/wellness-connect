<script setup lang="ts">
const loading = ref<HTMLElement | null>(null)

const props = defineProps({
  width: {
    type: Number,
    default: 50
  },
  height: {
    type: Number,
    default: 50
  },
  color: {
    type: String,
    default: '#F5F5F5FF'
  }
})

const animation = `
@keyframes loading {
  0% {
    transform: rotate(0deg) translate(0, ${props.height / 2 - 8}px);
  }
  50% {
    transform: rotate(180deg) translate(0, ${props.height / 2 - 8}px);
  }
  100% {
    transform: rotate(360deg) translate(0, ${props.height / 2 - 8}px);
  }
}
`

onMounted(() => {
  const style = document.createElement('style')
  style.innerHTML = animation
  if (loading.value) loading.value.appendChild(style)
})
</script>

<template>
  <div class="loading" ref="loading" :style="{width: width + 'px', height: height + 'px'}">
    <div class="loading_circle-dot" v-for="i in 8" :key="i"
         :style="{
         transform: 'translate(0, ' + (height / 2 - 8) + 'px)',
         width: (height / 4) + 'px',
         height: (height / 4) + 'px',
         background: props.color,
         animationDelay: (i * 0.1875) + 's'
         }"></div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  position: relative;
  display: grid;
  place-items: center;

  .loading_circle-dot {
    position: absolute;
    border-radius: 50%;
    animation: loading 1.5s linear infinite;
  }
}
</style>