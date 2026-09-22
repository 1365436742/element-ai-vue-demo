import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { mockChatStream } from '@/utils/mockChat'
import type { ChatSkill } from '@/data/skills'

export interface ChatContext {
  model?: string
  skill?: ChatSkill
}

export interface ChatMessage {
  id: string
  content: string
  placement: 'start' | 'end'
  isMarkdown?: boolean
  variant?: 'borderless' | 'filled'
  loading?: boolean
  typingOver?: boolean
  stopped?: boolean
  error?: boolean
  attachments?: string[]
  model?: string
  skill?: ChatSkill
}
interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
}

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([])
  const activeId = ref<string | null>(null)
  const loading = ref(false)
  const draftKey = ref(0)
  const messages = computed(
    () => sessions.value.find((item) => item.id === activeId.value)?.messages ?? [],
  )
  let generation = 0
  let pending: ChatMessage | undefined

  function stop() {
    generation++
    if (pending) {
      pending.loading = false
      pending.typingOver = true
      pending.stopped = true
      if (!pending.content) pending.content = '已停止生成。你可以调整问题后继续。'
      pending = undefined
    }
    loading.value = false
  }
  function newChat() {
    stop()
    activeId.value = null
    draftKey.value++
  }
  function selectChat(id: string) {
    if (activeId.value === id) return
    stop()
    activeId.value = id
    draftKey.value++
  }

  async function generate(input: string, context: ChatContext = {}) {
    const token = ++generation
    loading.value = true
    messages.value.push({
      id: crypto.randomUUID(),
      content: '',
      placement: 'start',
      isMarkdown: true,
      variant: 'borderless',
      loading: true,
      model: context.model,
    })
    const current = messages.value[messages.value.length - 1]!
    pending = current
    try {
      const prompt = context.skill
        ? `技能：${context.skill.name}\n${context.skill.instruction}\n\n用户问题：${input}`
        : input
      for await (const chunk of mockChatStream(prompt)) {
        if (token !== generation) return
        current.loading = false
        if (chunk.type === 'text' && !chunk.done) current.content += chunk.content
      }
    } catch {
      if (token === generation) {
        current.error = true
        current.content += '\n\n生成遇到问题，请重试。'
      }
    } finally {
      if (token === generation) {
        current.loading = false
        current.typingOver = true
        loading.value = false
        pending = undefined
      }
    }
  }
  function send(content: string, attachments: string[] = [], context: ChatContext = {}) {
    if (!content.trim() || loading.value) return
    if (!activeId.value) {
      const id = crypto.randomUUID()
      sessions.value.unshift({ id, title: content.trim().slice(0, 28), messages: [] })
      activeId.value = id
    }
    messages.value.push({
      id: crypto.randomUUID(),
      content: content.trim(),
      placement: 'end',
      attachments,
      model: context.model,
      skill: context.skill ? { ...context.skill } : undefined,
    })
    void generate(content.trim(), context)
  }
  function regenerate() {
    if (loading.value || !messages.value.length) return
    const last = messages.value[messages.value.length - 1]
    if (last?.placement === 'start') messages.value.pop()
    const message = messages.value[messages.value.length - 1]
    if (message) void generate(message.content, { model: message.model, skill: message.skill })
  }
  return {
    sessions,
    activeId,
    messages,
    loading,
    draftKey,
    send,
    stop,
    newChat,
    selectChat,
    regenerate,
  }
})
