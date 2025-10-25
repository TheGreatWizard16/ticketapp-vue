<template>
  <div>
    <header>
      <div class="container" style="display:flex;align-items:center;justify-content:space-between">
        <RouterLink to="/" style="font-weight:700;font-size:18px">TicketApp</RouterLink>
        <nav style="display:flex;gap:16px">
          <RouterLink class="btn ghost" to="/dashboard">Dashboard</RouterLink>
          <RouterLink class="btn ghost" to="/tickets">Tickets</RouterLink>
          <button v-if="session" class="btn ghost" @click="logout" aria-label="Logout">Logout</button>
          <RouterLink v-else class="btn" to="/auth/login">Login</RouterLink>
        </nav>
      </div>
    </header>
    <main class="container" style="padding-bottom:64px">
      <slot />
    </main>
    <footer>
      <div class="container">© {{ year }} TicketApp • Max-width 1440px</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { clearSession, getSession } from '../lib/session'
import { computed } from 'vue'

const router = useRouter()
const session = computed(() => getSession())
const logout = () => { clearSession(); router.push('/') }
const year = new Date().getFullYear()
</script>
