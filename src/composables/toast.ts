import { reactive } from 'vue'

type ToastMsg = { id: string; text: string }
const state = reactive<{ items: ToastMsg[] }>({ items: [] })

export function useToast() {
  const push = (text: string) => {
    const id = crypto.randomUUID()
    state.items.push({ id, text })
    setTimeout(() => {
      const idx = state.items.findIndex(t => t.id === id)
      if (idx >= 0) state.items.splice(idx, 1)
    }, 2200)
  }
  return { state, push }
}
