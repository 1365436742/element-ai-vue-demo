import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { mockChatStream } from '@/utils/mockChat'
import { chatSkills } from '@/data/skills'

vi.mock('@/utils/mockChat', () => ({ mockChatStream: vi.fn() }))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.useFakeTimers()
  vi.mocked(mockChatStream).mockImplementation(async function* () {
    yield { type: 'text', content: '第一段' }
    await new Promise((resolve) => setTimeout(resolve, 100))
    yield { type: 'text', content: '第二段' }
  })
})
afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('chat sessions', () => {
  it('ignores empty messages and duplicate sends during generation', async () => {
    const chat = useChatStore()
    chat.send('   ')
    expect(chat.sessions).toHaveLength(0)
    chat.send('hello')
    chat.send('duplicate')
    expect(chat.messages).toHaveLength(2)
    await vi.runAllTimersAsync()
    expect(chat.messages[1]?.content).toBe('第一段第二段')
    expect(chat.loading).toBe(false)
  })

  it('stops the previous stream when starting a new conversation', async () => {
    const chat = useChatStore()
    chat.send('first')
    await vi.advanceTimersByTimeAsync(0)
    const firstId = chat.activeId!
    const firstAnswer = chat.messages[1]!
    chat.newChat()
    chat.send('second')
    await vi.runAllTimersAsync()
    expect(firstAnswer.content).toBe('第一段')
    expect(firstAnswer.stopped).toBe(true)
    expect(chat.messages[1]?.content).toBe('第一段第二段')
    chat.selectChat(firstId)
    expect(chat.messages[0]?.content).toBe('first')
    expect(chat.loading).toBe(false)
  })

  it('regenerates only the answer and preserves the user message', async () => {
    const chat = useChatStore()
    chat.send('question')
    await vi.runAllTimersAsync()
    const originalId = chat.messages[1]?.id
    chat.regenerate()
    await vi.runAllTimersAsync()
    expect(chat.messages).toHaveLength(2)
    expect(chat.messages[0]?.content).toBe('question')
    expect(chat.messages[1]?.id).not.toBe(originalId)
    expect(chat.loading).toBe(false)
  })

  it('recovers from a failed stream so the user can retry', async () => {
    vi.mocked(mockChatStream).mockImplementation(async function* () {
      yield { type: 'text', content: '部分内容' }
      throw new Error('stream failed')
    })
    const chat = useChatStore()
    chat.send('question')
    await vi.runAllTimersAsync()
    expect(chat.messages[1]?.error).toBe(true)
    expect(chat.messages[1]?.content).toContain('请重试')
    expect(chat.loading).toBe(false)
  })

  it('keeps the skill context when regenerating without leaking it into the next message', async () => {
    const chat = useChatStore()
    const skill = chatSkills[0]!
    chat.send('画一张流程图', [], { model: 'Claude Opus 4.5', skill })
    await vi.runAllTimersAsync()
    const expectedPrompt = `技能：${skill.name}\n${skill.instruction}\n\n用户问题：画一张流程图`
    expect(mockChatStream).toHaveBeenLastCalledWith(expectedPrompt)
    expect(chat.messages[0]?.content).toBe('画一张流程图')
    expect(chat.messages[0]?.skill?.id).toBe(skill.id)
    expect(chat.messages[1]?.model).toBe('Claude Opus 4.5')
    chat.regenerate()
    await vi.runAllTimersAsync()
    expect(mockChatStream).toHaveBeenLastCalledWith(expectedPrompt)
    chat.send('普通问题')
    await vi.runAllTimersAsync()
    expect(mockChatStream).toHaveBeenLastCalledWith('普通问题')
    expect(chat.messages[2]?.skill).toBeUndefined()
  })
})
