<template>
  <div
    ref="composerRef"
    class="composer"
    :class="{ focused: focusClass, 'skills-expanded': skillsOpen }"
  >
    <SkillPicker
      v-if="skillsOpen"
      :id="skillPanelId"
      v-model="selectedSkill"
      @select="selectSkill"
      @close="closeSkills"
    />
    <div v-if="upload.fileList.length" class="file-card">
      <ElAFilesCard v-model="upload.fileList" />
      <p>附件仅作界面演示，不会上传或解析</p>
    </div>
    <ElASender
      ref="senderRef"
      v-model="content"
      v-model:show-input-tag-prefix="showInputTagPrefix"
      :input-tag-prefix-value="inputTagPrefixValue"
      class="sender"
      placeholder="有什么想法？尽管问我…"
      variant="updown"
      :loading="loading"
      :disabled="loading"
      :on-handle-key-down="handleKeyDown"
      @focus="focusClass = true"
      @blur="focusClass = false"
      @paste-file="upload.handleFileUpload"
      @send="onSend"
    >
      <template #input-tag-prefix>
        <SkillTag
          v-if="showInputTagPrefix && selectedSkill"
          class="input-skill-tag"
          :skill="selectedSkill"
          removable
          :disabled="loading"
          @info="skillInfoOpen = true"
          @remove="removeSkill"
        />
      </template>
      <template #prefix>
        <ElAFilesUpload v-bind="upload.commonProps" v-model="upload.fileList" :disabled="loading">
          <button
            class="icon-button attachment-button"
            :disabled="loading"
            aria-label="添加附件"
            title="添加附件 · PDF、Word 或图片 · 每个不超过 10MB"
          >
            <AppIcon name="plus" />
          </button>
        </ElAFilesUpload>
        <span class="toolbar-divider" />
      </template>
      <template #action-list>
        <ModelSelector v-model="selectedModel" :disabled="loading" />
        <button
          ref="skillTrigger"
          class="skill-trigger"
          :class="{ active: selectedSkill || skillsOpen }"
          :disabled="loading"
          aria-label="选择技能"
          :aria-controls="skillPanelId"
          :aria-expanded="skillsOpen"
          @click="toggleSkills"
        >
          <AppIcon name="layers" /><span>技能</span>
          <span v-if="selectedSkill" class="skill-trigger-dot" />
          <AppIcon v-else name="down" class="skill-chevron" :class="{ expanded: skillsOpen }" />
        </button>
        <span class="input-hint">{{
          loading ? '正在为你生成…' : skillsOpen ? '选择技能 · Esc 收起' : 'Shift + Enter 换行'
        }}</span>
      </template>
      <template #send-btn="{ disabled }">
        <button
          class="send-button"
          :disabled="disabled || !hasText || uploading || skillsOpen"
          aria-label="发送消息"
          :title="uploading ? '请等待附件准备完成' : '发送消息'"
          @click="onSend"
        >
          <AppIcon name="arrow" />
        </button>
      </template>
      <template #send-btn-loading
        ><button
          class="send-button stop-button"
          aria-label="停止生成"
          title="停止生成"
          @click="emit('stop')"
        >
          <span /></button
      ></template>
    </ElASender>
    <SkillInfoDialog v-model="skillInfoOpen" :skill="selectedSkill" />
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { ElASender, ElAFilesUpload, ElAFilesCard } from 'element-ai-vue'
import { useUploadFileStore } from '@/stores/uploadFile'
import AppIcon from './AppIcon.vue'
import ModelSelector from './ModelSelector.vue'
import SkillPicker from './SkillPicker.vue'
import SkillTag from './SkillTag.vue'
import SkillInfoDialog from './SkillInfoDialog.vue'
import type { ChatSkill } from '@/data/skills'
import type { ChatContext } from '@/stores/chat'
const props = defineProps<{ loading: boolean }>()
const emit = defineEmits<{
  send: [content: string, attachments: string[], context: ChatContext]
  stop: []
}>()
const upload = useUploadFileStore()
const senderRef = useTemplateRef('senderRef')
const composerRef = useTemplateRef('composerRef')
const skillTrigger = useTemplateRef('skillTrigger')
const skillPanelId = useId()
const skillsOpen = ref(false)
const selectedModel = ref('GPT-3.5 Turbo')
const selectedSkill = ref<ChatSkill | null>(null)
const skillInfoOpen = ref(false)
const inputTagPrefixValue = computed(() => selectedSkill.value?.name ?? '')
const showInputTagPrefix = computed({
  get: () => !!selectedSkill.value,
  set: (visible: boolean) => {
    if (!visible) selectedSkill.value = null
  },
})
const focusEditor = async () => {
  await nextTick()
  senderRef.value?.focus()
}
const toggleSkills = async () => {
  skillsOpen.value = !skillsOpen.value
  if (skillsOpen.value) {
    await nextTick()
    composerRef.value?.scrollIntoView({ block: 'nearest' })
  }
}
const closeSkills = async () => {
  skillsOpen.value = false
  await nextTick()
  skillTrigger.value?.focus()
}
const selectSkill = () => {
  skillsOpen.value = false
  void focusEditor()
}
watch(
  () => props.loading,
  (loading) => {
    if (loading) skillsOpen.value = false
  },
)
const removeSkill = () => {
  selectedSkill.value = null
  void focusEditor()
}
const content = ref('')
const focusClass = ref(false)
const hasText = computed(() => !!content.value && !!senderRef.value?.editor()?.getText().trim())
const uploading = computed(() =>
  upload.fileList.some((file) => file.uploadingStatus === 'progress'),
)
const onSend = () => {
  const text = senderRef.value?.editor()?.getText().trim()
  if (!text || props.loading || uploading.value || skillsOpen.value) return
  emit(
    'send',
    text,
    upload.fileList.map((file) => file.fileName),
    { model: selectedModel.value, skill: selectedSkill.value ?? undefined },
  )
  senderRef.value?.editor()?.commands.clearContent()
  content.value = ''
  upload.fileList = []
  selectedSkill.value = null
}
const handleKeyDown = (_view: unknown, event: KeyboardEvent) => {
  if (event.isComposing || event.keyCode === 229) return false
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    onSend()
    return true
  }
  return false
}
const fill = (text: string) => {
  senderRef.value?.editor()?.commands.setContent({
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  })
  senderRef.value?.focus()
}
onMounted(() => {
  const editor = senderRef.value?.editor()
  if (editor)
    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        attributes: {
          class: 'el-ai-base-sender-input__editor',
          role: 'textbox',
          'aria-label': '聊天内容',
          'aria-multiline': 'true',
        },
      },
    })
})
defineExpose({ fill })
</script>
<style scoped>
.composer {
  width: 100%;
  padding: 21px 20px 15px;
  border: 1px solid #dce4db;
  background: var(--surface);
  border-radius: 17px;
  box-shadow: var(--shadow);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.composer.focused {
  border-color: #86ac90;
  box-shadow:
    0 0 0 3px #83a88e12,
    var(--shadow);
}
.composer.skills-expanded {
  border-color: #86ac90;
  max-height: calc(100dvh - 120px);
  overflow-y: auto;
}
.skills-expanded .sender {
  min-height: 0;
}
.skills-expanded .sender :deep(.el-ai-sender__content) {
  display: none;
}
.skill-trigger {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 33px;
  padding: 0 10px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--muted);
  font-size: 12px;
  transition:
    background 0.2s,
    color 0.2s;
}
.skill-trigger:hover,
.skill-trigger.active {
  background: var(--accent-soft);
  color: var(--accent-text);
}
.skill-trigger > svg {
  width: 16px;
  height: 16px;
}
.skill-trigger .skill-chevron {
  width: 12px;
  height: 12px;
  transition: transform 0.2s;
}
.skill-chevron.expanded {
  transform: rotate(180deg);
}
.skill-trigger-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-text);
  margin: 0 3px;
}
.skill-trigger:disabled {
  opacity: 0.5;
}
:global(html.dark .composer) {
  border-color: var(--line);
}
:global(html.dark .composer.focused) {
  border-color: #6b9379;
}
.input-skill-tag {
  float: left;
  position: relative;
  z-index: 2;
  margin: 0 8px 3px 0;
}
.sender {
  min-height: 119px;
}
.sender :deep(.el-ai-sender__content) {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 21px;
  padding: 2px 3px;
  color: var(--text);
  font-size: 15px;
  line-height: 1.75;
}
.sender :deep(.el-ai-base-sender-input__editor) {
  min-height: 53px;
  outline: none;
}
.sender :deep(.el-ai-base-sender-input__editor p.is-editor-empty:first-child::before) {
  color: var(--subtle);
  font-size: 15px;
  line-height: 1.75;
}
.sender :deep(.el-ai-sender__action) {
  gap: 11px;
}
.sender :deep(.el-ai-sender__action--other) {
  min-width: 0;
}
.file-card {
  margin-bottom: 15px;
}
.file-card p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 11px;
}
.attachment-button {
  width: 30px;
  height: 30px;
  border: 1px solid var(--line);
  border-radius: 50%;
}
.attachment-button svg {
  width: 17px;
  height: 17px;
}
.toolbar-divider {
  height: 16px;
  width: 1px;
  background: var(--line);
}
.input-hint {
  margin-left: auto;
  padding-right: 5px;
  color: var(--subtle);
  font-size: 10px;
  white-space: nowrap;
}
.send-button {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  background: var(--accent);
  color: white;
  border: 0;
  border-radius: 10px;
  transition:
    background 0.2s,
    transform 0.2s;
}
.send-button svg {
  width: 21px;
  height: 21px;
}
.send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--accent-hover);
}
.send-button:disabled {
  background: var(--accent-soft);
  color: #93a999;
}
.stop-button span {
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 3px;
}
@media (max-width: 1100px) {
  .input-hint {
    display: none;
  }
}
@media (max-width: 760px) {
  .skill-trigger {
    padding: 0 7px;
    gap: 4px;
    font-size: 11px;
  }
  .composer {
    padding: 17px 15px 13px;
    border-radius: 14px;
  }
  .input-hint {
    display: none;
  }
  .sender :deep(.el-ai-sender__action),
  .sender :deep(.el-ai-sender__action--other) {
    gap: 5px;
  }
  .toolbar-divider {
    display: none;
  }
  .attachment-button {
    width: 27px;
    height: 27px;
  }
  .send-button {
    width: 31px;
    height: 33px;
  }
  .sender :deep(.el-ai-sender__content) {
    font-size: 14px;
    margin-bottom: 16px;
  }
  .sender :deep(.el-ai-base-sender-input__editor p.is-editor-empty:first-child::before) {
    font-size: 14px;
  }
}
@media (max-width: 370px) {
  .skill-trigger .skill-chevron,
  .skill-trigger-dot {
    display: none;
  }
}
</style>
