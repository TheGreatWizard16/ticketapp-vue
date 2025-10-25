<template>
  <div aria-live="polite" aria-atomic="true"
       style="position:fixed;right:16px;bottom:16px;display:grid;gap:8px;z-index:50">
    <div v-for="t in state.items" :key="t.id" class="toast">{{ t.text }}</div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/toast'
const { state } = useToast()
</script>
