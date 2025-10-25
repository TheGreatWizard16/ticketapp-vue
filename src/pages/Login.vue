<template>
  <Layout>
    <div class="card" style="max-width:480px;margin:40px auto">
      <h2>Login</h2>
      <form @submit.prevent="onSubmit" class="grid" style="gap:12px">
        <label class="label" for="email">Email</label>
        <input id="email" class="input" v-model="email" required />
        <label class="label" for="pw">Password</label>
        <input id="pw" type="password" class="input" v-model="password" required />
        <div v-if="err" class="error" role="alert">{{ err }}</div>
        <button class="btn" type="submit">Sign in</button>
        <div>Don’t have an account? <RouterLink to="/auth/signup">Create one</RouterLink></div>
      </form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Layout from '../components/Layout.vue'
import { setSession } from '../lib/session'
import { useToast } from '../composables/toast'

const email = ref('demo@ticket.app')
const password = ref('Demo@1234')
const err = ref<string | null>(null)
const route = useRoute()
const router = useRouter()
const { push } = useToast()

onMounted(() => {
  const reason = route.query.reason as string | undefined
  if (reason) push(reason)
})

function onSubmit(){
  err.value = null
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  if(!validEmail){ err.value = 'Enter a valid email'; return }
  if(password.value.length < 6){ err.value = 'Password must be at least 6 characters'; return }
  setSession({ token: crypto.randomUUID(), userEmail: email.value })
  push('Signed in successfully')
  const from = (route.query.from as string) || '/dashboard'
  router.replace(from)
}
</script>
