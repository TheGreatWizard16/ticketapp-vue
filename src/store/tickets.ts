import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type Ticket = {
  id: string
  title: string
  description?: string
  status: TicketStatus
  priority?: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

const LS_KEY = 'ticketapp_tickets'

export const useTickets = defineStore('tickets', {
  state: () => ({
    items: [] as Ticket[],
  }),
  actions: {
    load() {
      const raw = localStorage.getItem(LS_KEY)
      this.items = raw ? JSON.parse(raw) : []
    },
    create(t: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) {
      if (!t.title?.trim()) throw new Error('Title is required')
      if (!['open', 'in_progress', 'closed'].includes(t.status)) throw new Error('Invalid status')
      const now = new Date().toISOString()
      const item: Ticket = { ...t, id: nanoid(), createdAt: now, updatedAt: now }
      this.items = [item, ...this.items]
      localStorage.setItem(LS_KEY, JSON.stringify(this.items))
    },
    update(id: string, patch: Partial<Ticket>) {
      this.items = this.items.map(x => {
        if (x.id !== id) return x
        const merged = { ...x, ...patch, updatedAt: new Date().toISOString() }
        if (!merged.title?.trim()) throw new Error('Title is required')
        if (!['open', 'in_progress', 'closed'].includes(merged.status)) throw new Error('Invalid status')
        if (merged.description && merged.description.length > 2000) throw new Error('Description too long (max 2000)')
        return merged
      })
      localStorage.setItem(LS_KEY, JSON.stringify(this.items))
    },
    remove(id: string) {
      this.items = this.items.filter(x => x.id !== id)
      localStorage.setItem(LS_KEY, JSON.stringify(this.items))
    },
  },
})
