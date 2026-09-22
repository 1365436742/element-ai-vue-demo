<template>
  <div
    class="skill-picker-panel"
    role="region"
    aria-label="技能选择"
    @keydown.esc.stop="emit('close')"
  >
    <div class="skill-picker-heading">
      <div><strong>选择技能</strong><span>为这次对话添加一个专属助手</span></div>
      <button class="icon-button" aria-label="关闭技能选择" @click="emit('close')">
        <AppIcon name="close" />
      </button>
    </div>
    <div ref="results" class="skill-results" @keydown="navigateResults">
      <section
        v-for="group in groups"
        :key="group.name"
        class="skill-group"
        :aria-label="group.name"
      >
        <h3>
          {{ group.name }}<span>{{ group.skills.length }}</span>
        </h3>
        <button
          v-for="skill in group.skills"
          :key="skill.id"
          class="skill-option"
          :class="{ selected: selected?.id === skill.id }"
          :aria-pressed="selected?.id === skill.id"
          @click="choose(skill)"
        >
          <span class="skill-option-icon" :class="skill.color"><AppIcon :name="skill.icon" /></span
          ><span class="skill-option-copy"
            ><strong>{{ skill.name }}</strong
            ><span>{{ skill.description }}</span></span
          ><AppIcon v-if="selected?.id === skill.id" name="check" class="skill-option-check" />
        </button>
      </section>
      <div v-if="!groups.length" class="skill-empty">
        <AppIcon name="search" /><strong>没有找到相关技能</strong
        ><span>试试「代码」「学习」或其他关键词</span
        ><button @click="query = ''">查看全部技能</button>
      </div>
    </div>
    <div class="skill-search">
      <ElInput
        ref="searchInput"
        v-model="query"
        placeholder="搜索技能名称或用途…"
        aria-label="搜索技能"
        clearable
        @keydown.down="focusFirstResult"
        @keydown.enter="chooseFirst"
        ><template #prefix><AppIcon name="search" /></template
      ></ElInput>
    </div>
    <div class="skill-picker-footer"><span>选择后会添加到输入框前缀</span><kbd>ESC 关闭</kbd></div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { ElInput } from 'element-plus'
import AppIcon from './AppIcon.vue'
import { chatSkills, type ChatSkill } from '@/data/skills'
const selected = defineModel<ChatSkill | null>({ default: null })
const emit = defineEmits<{ select: []; close: [] }>()
const query = ref('')
const searchInput = useTemplateRef('searchInput')
const results = useTemplateRef('results')
const filtered = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  return chatSkills.filter((skill) =>
    `${skill.name} ${skill.description} ${skill.group}`.toLocaleLowerCase().includes(keyword),
  )
})
const groups = computed(() =>
  [...new Set(filtered.value.map((skill) => skill.group))].map((name) => ({
    name,
    skills: filtered.value.filter((skill) => skill.group === name),
  })),
)
function choose(skill: ChatSkill) {
  selected.value = skill
  emit('select')
}
function chooseFirst(event: Event | KeyboardEvent) {
  if (!(event instanceof KeyboardEvent) || event.isComposing || event.keyCode === 229) return
  event.preventDefault()
  if (filtered.value[0]) choose(filtered.value[0])
}
function focusFirstResult(event: Event | KeyboardEvent) {
  if (!(event instanceof KeyboardEvent) || event.isComposing) return
  event.preventDefault()
  results.value?.querySelector<HTMLButtonElement>('.skill-option')?.focus()
}
function navigateResults(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  const options = Array.from(
    results.value?.querySelectorAll<HTMLButtonElement>('.skill-option') ?? [],
  )
  const index = options.findIndex((button) => button === document.activeElement)
  const next = index + (event.key === 'ArrowDown' ? 1 : -1)
  if (next < 0 || next >= options.length) searchInput.value?.focus()
  else options[next]?.focus()
}
onMounted(() => searchInput.value?.focus())
</script>
<style scoped>
.skill-picker-panel {
  width: 100%;
  color: var(--text);
  text-align: left;
  margin-bottom: 12px;
}
.skill-picker-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3px 12px;
}
.skill-picker-heading > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.skill-picker-heading strong {
  font-size: 14px;
  font-weight: 600;
}
.skill-picker-heading span {
  color: var(--muted);
  font-size: 11px;
}
.skill-picker-heading .icon-button {
  width: 27px;
  height: 27px;
}
.skill-picker-heading .icon-button > svg {
  width: 16px;
  height: 16px;
}
.skill-results {
  max-height: min(300px, 35dvh);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 2px 9px;
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
.skill-group h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  margin: 0;
  color: var(--muted);
  font-size: 10px;
  font-weight: 500;
}
.skill-group h3 span {
  opacity: 0.65;
}
.skill-group + .skill-group {
  margin-top: 7px;
}
.skill-option {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  text-align: left;
  padding: 9px 10px;
  background: transparent;
  border: 0;
  border-radius: 9px;
}
.skill-option:hover,
.skill-option:focus-visible,
.skill-option.selected {
  background: var(--accent-soft);
}
.skill-option:focus-visible {
  outline: 2px solid #8aaa93;
  outline-offset: -2px;
}
.skill-option-icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--accent-text);
}
.skill-option-icon svg {
  width: 18px;
  height: 18px;
}
.skill-option-icon.blue {
  color: #7694bb;
}
.skill-option-icon.rose {
  color: #bd8877;
}
.skill-option-icon.sand {
  color: #ad975e;
}
.skill-option-copy {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: baseline;
  gap: 12px;
}
.skill-option-copy strong {
  flex-shrink: 0;
  color: var(--text);
  font-size: 12px;
  font-weight: 550;
}
.skill-option-copy > span {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.65;
}
.skill-option-check {
  width: 16px;
  height: 16px;
  color: var(--accent-text);
  flex-shrink: 0;
}
.skill-search {
  border-top: 1px solid var(--line);
  padding: 9px 0 1px;
}
.skill-search :deep(.el-input__wrapper) {
  padding: 4px 2px;
  background: transparent;
  border: 1px solid transparent;
  box-shadow: none;
  border-radius: 8px;
}
.skill-search :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
}
.skill-search :deep(.el-input__inner) {
  font-size: 12px;
  color: var(--text);
}
.skill-search :deep(.el-input__prefix-inner > svg) {
  width: 16px;
  height: 16px;
  margin-right: 7px;
  color: var(--subtle);
}
.skill-picker-footer {
  display: flex;
  justify-content: space-between;
  padding: 6px 4px 0;
  color: var(--subtle);
  font-size: 10px;
}
.skill-picker-footer kbd {
  font: inherit;
}
.skill-empty {
  padding: 28px 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  color: var(--muted);
}
.skill-empty > svg {
  width: 24px;
  height: 24px;
}
.skill-empty strong {
  font-size: 13px;
  font-weight: 500;
}
.skill-empty > span {
  font-size: 11px;
}
.skill-empty > button {
  border: 0;
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 11px;
  border-radius: 6px;
  padding: 6px 10px;
}
@media (max-width: 760px) {
  .skill-option-copy {
    flex-direction: column;
    gap: 2px;
  }
  .skill-option-copy > span {
    font-size: 10px;
  }
  .skill-results {
    max-height: min(220px, 30dvh);
  }
  .skill-picker-heading {
    padding: 0 2px 10px;
  }
}
</style>
