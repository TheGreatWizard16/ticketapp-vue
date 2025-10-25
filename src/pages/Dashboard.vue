<template>
  <Layout>
    <h2>Dashboard</h2>
    <div class="grid cols-3" style="margin-top:16px">
      <div class="card"><strong>Total</strong><div style="font-size:36px">{{ total }}</div></div>
      <div class="card"><strong>Open</strong><div style="font-size:36px;color:var(--green)">{{ open }}</div></div>
      <div class="card"><strong>Resolved</strong><div style="font-size:36px;color:var(--gray)">{{ resolved }}</div></div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import { useTickets } from '../store/tickets'

const store = useTickets()
onMounted(() => store.load())

const total = computed(() => store.items.length)
const open = computed(() => store.items.filter(t => t.status === 'open').length)
const resolved = computed(() => store.items.filter(t => t.status === 'closed').length)
</script>
