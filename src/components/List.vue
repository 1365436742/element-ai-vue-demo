<template>
  <div class="scroll-area">
    <ElABubbleList>
      <div class="message-list" role="log" aria-label="对话记录">
        <div
          v-for="(item, index) in list"
          :key="item.id"
          class="message"
          :class="item.placement === 'end' ? 'user-message' : 'assistant-message'"
        >
          <div class="message-heading">
            <span v-if="item.placement === 'start'" class="assistant-avatar"
              ><AppIcon name="spark" /></span
            ><span>{{ item.placement === 'start' ? 'element ai' : '你' }}</span
            ><span v-if="item.placement === 'start'" class="message-model">{{
              item.model || '灵感伙伴'
            }}</span>
          </div>
          <div v-if="item.skill" class="message-skill">
            <SkillTag :skill="item.skill" @info="showSkillInfo(item.skill)" />
          </div>
          <div v-if="item.attachments?.length" class="message-files">
            <span v-for="file in item.attachments" :key="file"
              ><AppIcon name="clip" />{{ file }}</span
            >
          </div>
          <ElABubble v-bind="item" :footer-trigger="'none'">
            <template #footer>
              <div class="message-actions" :class="item.placement">
                <template v-if="item.content && !item.loading">
                  <button
                    class="icon-button"
                    :aria-label="copiedId === item.id ? '已复制' : '复制消息'"
                    :title="copiedId === item.id ? '已复制' : '复制消息'"
                    @click="copyMessage(item)"
                  >
                    <AppIcon :name="copiedId === item.id ? 'check' : 'copy'" />
                  </button>
                  <button
                    v-if="item.placement === 'start' && index === list.length - 1 && !loading"
                    class="icon-button"
                    aria-label="重新生成"
                    title="重新生成"
                    @click="emit('regenerate')"
                  >
                    <AppIcon name="refresh" />
                  </button>
                  <span v-if="item.stopped" class="message-state">已停止</span
                  ><span v-else-if="item.error" class="message-state">生成失败，可重试</span>
                </template>
              </div>
            </template>
          </ElABubble>
        </div>
      </div>
    </ElABubbleList>
    <span class="sr-only" role="status">{{ copyStatus }}</span>
    <SkillInfoDialog v-model="skillInfoOpen" :skill="infoSkill" />
  </div>
</template>
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { ElABubbleList, ElABubble } from 'element-ai-vue'
import { ElMessage } from 'element-plus'
import AppIcon from './AppIcon.vue'
import type { ChatMessage } from '@/stores/chat'
import type { ChatSkill } from '@/data/skills'
import SkillTag from './SkillTag.vue'
import SkillInfoDialog from './SkillInfoDialog.vue'
defineProps<{ list: ChatMessage[]; loading: boolean }>()
const emit = defineEmits<{ regenerate: [] }>()
const copiedId = ref('')
const copyStatus = ref('')
const infoSkill = ref<ChatSkill | null>(null)
const skillInfoOpen = ref(false)
const showSkillInfo = (skill: ChatSkill) => {
  infoSkill.value = skill
  skillInfoOpen.value = true
}
let copyTimer: ReturnType<typeof setTimeout> | undefined
const copyMessage = async (item: ChatMessage) => {
  try {
    await navigator.clipboard.writeText(item.content)
    copiedId.value = item.id
    copyStatus.value = '消息已复制'
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copiedId.value = ''
      copyStatus.value = ''
    }, 2000)
  } catch {
    ElMessage.warning('复制未成功，请选择文字后手动复制。')
  }
}
onUnmounted(() => clearTimeout(copyTimer))
</script>
<style scoped>
.scroll-area {
  flex: 1;
  min-height: 0;
  width: 100%;
}
.message-list {
  padding: 12px 12px 10px 0;
}
.message {
  padding: 10px 0 19px;
}
.message-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 13px;
  font-size: 12px;
  font-weight: 600;
}
.assistant-avatar {
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  color: var(--accent-text);
  background: var(--accent-soft);
  border-radius: 8px;
}
.assistant-avatar svg {
  width: 17px;
  height: 17px;
}
.message-model {
  margin-left: 2px;
  font-size: 10px;
  color: var(--subtle);
  font-weight: 400;
}
.user-message .message-heading {
  justify-content: flex-end;
  color: var(--muted);
  font-size: 11px;
}
.message :deep(.el-ai-bubble__content--text) {
  font-size: 14px;
  line-height: 1.9;
  border-radius: 13px;
  overflow-wrap: anywhere;
  max-width: 100%;
}
.user-message :deep(.el-ai-bubble__content--text) {
  background: var(--accent-soft);
  color: var(--text);
  padding: 13px 19px;
  white-space: pre-wrap;
}
.assistant-message :deep(.el-ai-bubble__content--text) {
  color: var(--text);
}
.message :deep(.el-ai-markdown) {
  color: var(--text);
  font-size: 14px;
  line-height: 1.9;
}
.message :deep(.el-ai-bubble__footer) {
  padding-top: 6px;
}
.message-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 26px;
}
.message-actions.end {
  justify-content: flex-end;
}
.message-actions .icon-button {
  width: 27px;
  height: 27px;
  border-radius: 6px;
}
.message-actions svg {
  width: 13px;
  height: 13px;
}
.message-state {
  color: var(--subtle);
  font-size: 10px;
  margin-left: 6px;
}
.message-skill {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 9px;
}
.message-files {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
  margin-bottom: 8px;
}
.message-files span {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--line);
  font-size: 11px;
  overflow-wrap: anywhere;
}
.message-files svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
@media (max-width: 760px) {
  .message-list {
    padding-right: 6px;
  }
  .message :deep(.el-ai-markdown) {
    font-size: 13px;
  }
}
</style>
