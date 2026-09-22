<template>
  <button
    v-if="config.sidebarOpen"
    class="sidebar-overlay"
    aria-label="关闭侧边栏"
    tabindex="-1"
    @click="closeSidebar"
  />
  <aside
    id="chat-sidebar"
    ref="sidebarRef"
    class="sidebar"
    :class="{ open: config.sidebarOpen }"
    aria-label="对话导航"
    @keydown="handleKeydown"
  >
    <div class="brand">
      <span class="brand-mark"><AppIcon name="spark" /></span
      ><span>element<span class="brand-ai"> ai</span><small>你的日常灵感伙伴</small></span
      ><button class="icon-button mobile-close" aria-label="关闭导航" @click="closeSidebar">
        <AppIcon name="close" />
      </button>
    </div>
    <button class="new-chat" @click="newChat">
      <AppIcon name="plus" /><span>开启新对话</span><span class="new-chat-hint">↵</span>
    </button>
    <nav class="navigation">
      <button class="nav-item active" @click="closeSidebar">
        <AppIcon name="chat" /><span>AI 对话</span><span class="active-dot" />
      </button>
    </nav>
    <div class="history-heading">
      <span>最近对话</span><span class="session-note">本次访问</span>
    </div>
    <div class="history-list">
      <button
        v-for="session in chat.sessions"
        :key="session.id"
        class="history-item"
        :class="{ selected: chat.activeId === session.id }"
        :aria-current="chat.activeId === session.id ? 'true' : undefined"
        @click="selectChat(session.id)"
      >
        <AppIcon name="chat" /><span>{{ session.title }}</span>
      </button>
      <div v-if="!chat.sessions.length" class="history-empty">
        <span class="empty-line" />
        <p>还没有对话记录</p>
        <span>从一个小小的好奇开始吧</span>
      </div>
    </div>
    <div class="sidebar-bottom">
      <div class="inspiration-note">
        <AppIcon name="leaf" />
        <p>给想法一点生长的空间</p>
        <span>写作、探索、创造，都可以从这里开始。</span>
        <div class="note-lines"><i /><i /><i /></div>
      </div>
      <div class="sidebar-footer">
        <span class="mini-mark"><AppIcon name="spark" /></span><span>Built with element-ai-vue</span
        ><span class="version">DEMO</span>
      </div>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { useConfigStore } from '@/stores/config'
import { useChatStore } from '@/stores/chat'
import { useUploadFileStore } from '@/stores/uploadFile'
const config = useConfigStore()
const chat = useChatStore()
const upload = useUploadFileStore()
const sidebarRef = useTemplateRef('sidebarRef')
const closeSidebar = () => {
  config.sidebarOpen = false
}
const newChat = () => {
  chat.newChat()
  upload.fileList = []
  closeSidebar()
}
const selectChat = (id: string) => {
  if (chat.activeId !== id) {
    chat.selectChat(id)
    upload.fileList = []
  }
  closeSidebar()
}
const handleKeydown = (event: KeyboardEvent) => {
  if (!config.sidebarOpen) return
  if (event.key === 'Escape') closeSidebar()
  if (event.key !== 'Tab') return
  const buttons = Array.from(
    sidebarRef.value?.querySelectorAll<HTMLButtonElement>('button') ?? [],
  ).filter((button) => !button.disabled && button.getClientRects().length > 0)
  const first = buttons[0]
  const last = buttons[buttons.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}
watch(
  () => config.sidebarOpen,
  async (open) => {
    await nextTick()
    if (open) sidebarRef.value?.querySelector<HTMLButtonElement>('.mobile-close')?.focus()
    else document.querySelector<HTMLButtonElement>('.sidebar-toggle')?.focus()
  },
)
let mobileQuery: MediaQueryList | undefined
const closeOnDesktop = () => {
  if (!mobileQuery?.matches) closeSidebar()
}
onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 760px)')
  mobileQuery.addEventListener('change', closeOnDesktop)
})
onUnmounted(() => mobileQuery?.removeEventListener('change', closeOnDesktop))
</script>
<style scoped>
.sidebar {
  width: 246px;
  flex: 0 0 246px;
  background: var(--sidebar);
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  padding: 31px 18px 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  font-size: 23px;
  letter-spacing: -0.8px;
  font-weight: 650;
}
.brand-ai {
  color: var(--accent-text);
  font-weight: 400;
}
.brand small {
  display: block;
  color: var(--muted);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 1.2px;
  margin-top: 5px;
}
.brand-mark {
  width: 34px;
  height: 40px;
  color: var(--accent-text);
  display: grid;
  place-items: center;
}
.brand-mark svg {
  width: 32px;
  height: 32px;
  stroke-width: 1.8;
}
.new-chat {
  margin-top: 35px;
  height: 43px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  text-align: left;
  transition:
    background 0.2s,
    transform 0.2s;
}
.new-chat:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}
.new-chat svg {
  width: 18px;
  height: 18px;
}
.new-chat-hint {
  margin-left: auto;
  opacity: 0.55;
  font-size: 16px;
}
.navigation {
  margin-top: 24px;
  padding-bottom: 25px;
}
.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 41px;
  padding: 0 14px;
  gap: 11px;
  border: 0;
  border-radius: 8px;
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 13px;
  font-weight: 550;
}
.nav-item svg {
  width: 18px;
  height: 18px;
}
.active-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-text);
  margin-left: auto;
}
.history-heading {
  display: flex;
  justify-content: space-between;
  padding: 0 13px;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.6px;
}
.session-note {
  color: var(--subtle);
  font-size: 9px;
}
.history-list {
  flex: 1;
  min-height: 70px;
  overflow-y: auto;
  padding-top: 14px;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 0;
  border-radius: 7px;
  font-size: 12px;
  color: var(--muted);
  text-align: left;
}
.history-item span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.history-item svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.history-item:hover,
.history-item.selected {
  background: var(--accent-soft);
  color: var(--accent-text);
}
.history-empty {
  padding: 19px 13px;
  color: var(--subtle);
  font-size: 11px;
}
.history-empty p {
  margin: 15px 0 7px;
  color: var(--muted);
  font-size: 12px;
}
.empty-line {
  display: block;
  height: 2px;
  width: 23px;
  background: var(--line);
}
.sidebar-bottom {
  padding-top: 20px;
}
.inspiration-note {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 17px 15px 21px;
}
.inspiration-note > svg {
  width: 23px;
  height: 23px;
  color: var(--accent-text);
}
.inspiration-note p {
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 550;
  margin: 12px 0 7px;
}
.inspiration-note > span {
  position: relative;
  z-index: 1;
  display: block;
  max-width: 148px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.9;
}
.note-lines {
  position: absolute;
  right: -34px;
  bottom: -54px;
  width: 117px;
  height: 151px;
  transform: rotate(32deg);
  opacity: 0.55;
}
.note-lines i {
  position: absolute;
  inset: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
}
.note-lines i:nth-child(2) {
  inset: 10px;
}
.note-lines i:nth-child(3) {
  inset: 20px;
}
.sidebar-footer {
  height: 66px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--subtle);
  font-size: 9px;
  white-space: nowrap;
}
.mini-mark svg {
  width: 13px;
  height: 13px;
  display: block;
}
.version {
  margin-left: auto;
  font-size: 8px;
  letter-spacing: 1px;
}
.mobile-close,
.sidebar-overlay {
  display: none;
}
@media (max-width: 1100px) and (min-width: 761px) {
  .sidebar {
    width: 220px;
    flex-basis: 220px;
    padding-left: 14px;
    padding-right: 14px;
  }
}
@media (max-width: 760px) {
  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 30;
    width: 270px;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    visibility: hidden;
  }
  .sidebar.open {
    transform: translateX(0);
    visibility: visible;
  }
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: #11251e55;
    border: 0;
    z-index: 29;
    backdrop-filter: blur(3px);
  }
  .mobile-close {
    display: inline-flex;
    margin-left: auto;
  }
}
</style>
