<!-- app/components/CommentsUtterances.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  repo: string
  theme?: string
  issueTerm?: string
}>(), {
  theme: 'github-light',
  issueTerm: 'pathname'
})

const container = ref<HTMLElement | null>(null)
const route = useRoute()

function loadComments() {
  if (!container.value) return
  container.value.innerHTML = ''
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('repo', props.repo)
  script.setAttribute('issue-term', props.issueTerm)
  script.setAttribute('label', 'comments')
  script.setAttribute('theme', props.theme)
  container.value.appendChild(script)
}

onMounted(loadComments)
watch(() => route.path, loadComments)
</script>

<template>
  <div ref="container" class="comments" />
</template>
