<template>
  <Layout>
    <div class="card" style="max-width:560px;margin:40px auto;text-align:center">
      <h2>Page not found</h2>
      <p>We can’t find that page. Try the dashboard or tickets.</p>
      <div style="display:flex;gap:8px;justify-content:center">
        <RouterLink class="btn" to="/dashboard">Dashboard</RouterLink>
        <RouterLink class="btn ghost" to="/tickets">Tickets</RouterLink>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import { RouterLink } from 'vue-router'
</script>
