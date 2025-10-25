<template>
  <Layout>
    <div class="card" style="max-width:480px;margin:40px auto">
      <h2>Create account</h2>
      <form @submit.prevent="onSubmit" class="grid" style="gap:12px">
        <label class="label" for="email">Email</label>
        <input id="email" class="input" v-model="email" required />
        <label class="label" for="pw">Password</label>
        <input id="pw" type="password" class="input" v-model="password" required />
        <div v-if="err" class="error" role="alert">{{ err }}</div>
        <button class="btn" type="submit">Create account</button>
      </form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import { setSession } from '../lib/session'
import { useToast } from '../composables/toast'

const email = ref('')
const password = ref('')
const err = ref<string | null>(null)
const router = useRouter()
const { push } = useToast()

function onSubmit(){
  err.value = null
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  if(!validEmail){ err.value = 'Enter a valid email'; return }
  if(password.value.length < 6){ err.value = 'Password must be at least 6 characters'; return }
  setSession({ token: crypto.randomUUID(), userEmail: email.value })
  push('Account created — you are signed in')
  router.replace('/dashboard')
}
</script>
