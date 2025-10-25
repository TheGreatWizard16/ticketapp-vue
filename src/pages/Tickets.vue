<template>
  <Layout>
    <h2>Tickets</h2>

    <form @submit.prevent="onCreate" class="card" style="margin:16px 0;display:grid;gap:12px" aria-label="Create ticket">
      <div>
        <label class="label" for="title">Title *</label>
        <input id="title" class="input" v-model="title" placeholder="Short summary" required :aria-invalid="!!err" />
        <div class="label" aria-hidden>1–120 chars</div>
      </div>
      <div>
        <label class="label" for="status">Status *</label>
        <select id="status" class="input" v-model="status" required>
          <option value="open">open</option>
          <option value="in_progress">in_progress</option>
          <option value="closed">closed</option>
        </select>
      </div>
      <div>
        <label class="label" for="desc">Description</label>
        <textarea id="desc" class="input" rows="4" v-model="description" aria-describedby="desc-help"></textarea>
        <div id="desc-help" class="label" aria-hidden>Optional ≤ 2000 chars</div>
      </div>
      <div v-if="err" class="error" role="alert">{{ err }}</div>
      <div><button class="btn" type="submit">Create</button></div>
    </form>

    <div class="grid" style="gap:16px" role="list" aria-label="Ticket list">
      <div v-for="t in sorted" :key="t.id" class="card" role="listitem" :aria-label="`Ticket ${t.title}`">
        <template v-if="editingId === t.id">
          <div class="grid" style="gap:10px">
            <input class="input" v-model="editTitle" aria-label="Title" />
            <select class="input" v-model="editStatus" aria-label="Status">
              <option value="open">open</option>
              <option value="in_progress">in_progress</option>
              <option value="closed">closed</option>
            </select>
            <textarea class="input" rows="3" v-model="editDescription" aria-label="Description"></textarea>
            <div v-if="editErr" class="error" role="alert">{{ editErr }}</div>
            <div style="display:flex;gap:8px">
              <button class="btn" type="button" :disabled="!isDirty(t)" @click="save(t.id)">Save</button>
              <button class="btn ghost" type="button" @click="cancel(t)">Cancel</button>
            </div>
          </div>
        </template>
        <template v-else>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="margin:0">{{ t.title }}</h3>
            <span class="status" :class="t.status">{{ t.status }}</span>
          </div>
          <p v-if="t.description" style="margin:0;color:var(--muted)">{{ t.description }}</p>
          <small style="color:var(--muted)">
            Created {{ format(t.createdAt) }} • Updated {{ format(t.updatedAt) }}
          </small>
          <div style="display:flex;gap:8px">
            <button class="btn" type="button" @click="startEdit(t)">Edit</button>
            <button class="btn ghost" type="button" @click="del(t.id)">Delete</button>
          </div>
        </template>
      </div>
      <div v-if="sorted.length === 0" class="card">No tickets yet.</div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Layout from '../components/Layout.vue'
import { useTickets, type Ticket } from '../store/tickets'
import { useToast } from '../composables/toast'

type Status = 'open'|'in_progress'|'closed'
const isValidStatus = (s: string): s is Status => s==='open'||s==='in_progress'||s==='closed'
const sanitize = (s:string) => s.replace(/\s+/g,' ').trim()
const { push } = useToast()

const store = useTickets()
onMounted(() => store.load())

const title = ref(''); const status = ref<Status>('open'); const description = ref('')
const err = ref<string|null>(null)

function onCreate(){
  try{
    const t = sanitize(title.value)
    const d = description.value.trim()
    if(!t) throw new Error('Title is required')
    if(t.length>120) throw new Error('Title too long (max 120)')
    if(!isValidStatus(status.value)) throw new Error('Invalid status')
    if(d && d.length>2000) throw new Error('Description too long (max 2000)')
    store.create({ title: t, status: status.value, description: d })
    title.value=''; description.value=''; status.value='open'; err.value=null
    push('Ticket created')
  }catch(ex:any){ err.value = ex?.message || 'Validation error' }
}

const sorted = computed(() => store.items.slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt)))
const format = (iso:string) => new Date(iso).toLocaleString()

// Edit state
const editingId = ref<string|null>(null)
const editTitle = ref(''); const editStatus = ref<Status>('open'); const editDescription = ref('')
const editErr = ref<string|null>(null)

function startEdit(t: Ticket){
  editingId.value = t.id
  editTitle.value = t.title
  editStatus.value = (t.status as Status) || 'open'
  editDescription.value = t.description || ''
}

function cancel(t: Ticket){
  editingId.value = null
  editErr.value = null
  editTitle.value = t.title
  editStatus.value = (t.status as Status) || 'open'
  editDescription.value = t.description || ''
}

function isDirty(t: Ticket){
  return editTitle.value !== t.title ||
         editStatus.value !== (t.status as Status) ||
         (editDescription.value || '') !== (t.description || '')
}

function save(id: string){
  try{
    const t = sanitize(editTitle.value)
    const d = editDescription.value.trim()
    if(!t) throw new Error('Title is required')
    if(t.length>120) throw new Error('Title too long (max 120)')
    if(!isValidStatus(editStatus.value)) throw new Error('Invalid status')
    if(d && d.length>2000) throw new Error('Description too long (max 2000)')
    store.update(id, { title: t, status: editStatus.value, description: d })
    editingId.value = null; editErr.value = null
    push('Ticket updated')
  }catch(ex:any){ editErr.value = ex?.message || 'Validation error' }
}

function del(id: string){
  if(confirm('Delete this ticket?')){
    store.remove(id)
    push('Ticket deleted')
  }
}
</script>
