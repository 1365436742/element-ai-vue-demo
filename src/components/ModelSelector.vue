<template>
  <ElSelect
    v-model="model"
    class="model-select"
    aria-label="选择演示模型"
    :disabled="disabled"
    placement="top-start"
    :offset="10"
    :popper-options="{
      modifiers: [
        { name: 'preventOverflow', options: { padding: 16, altAxis: true, tether: false } },
      ],
    }"
    :show-arrow="false"
    popper-class="model-select-popper"
    :fit-input-width="false"
  >
    <template #prefix><AppIcon name="spark" /></template>
    <template #header
      ><div class="model-menu-heading"><span>选择模型</span><span>演示</span></div></template
    >
    <ElOption v-for="option in models" :key="option.name" :label="option.name" :value="option.name">
      <div class="model-option">
        <span class="model-avatar" :class="option.color">{{ option.initial }}</span
        ><span class="model-option-copy"
          ><strong>{{ option.name }}</strong
          ><small>{{ option.description }}</small></span
        ><AppIcon v-if="model === option.name" name="check" class="model-check" />
      </div>
    </ElOption>
    <template #footer><p class="model-menu-note">当前为演示模式，不连接真实模型</p></template>
  </ElSelect>
</template>
<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import AppIcon from './AppIcon.vue'
const model = defineModel<string>({ required: true })
defineProps<{ disabled?: boolean }>()
const models = [
  { name: 'GPT-3.5 Turbo', initial: 'G', color: 'green', description: '日常问答 · 灵感交流' },
  { name: 'Gemini 3 Pro', initial: 'G', color: 'blue', description: '多角度探索 · 内容创作' },
  { name: 'Claude Opus 4.5', initial: 'C', color: 'sand', description: '长文写作 · 思路梳理' },
]
</script>
<style scoped>
.model-select {
  width: 173px;
  flex-shrink: 0;
}
.model-select :deep(.el-select__wrapper) {
  min-height: 33px;
  padding: 5px 9px;
  gap: 6px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--canvas);
  box-shadow: none;
  font-size: 11px;
}
.model-select :deep(.el-select__wrapper:hover),
.model-select :deep(.el-select__wrapper.is-focused) {
  border-color: #95b29e;
  background: var(--accent-soft);
  box-shadow: none;
}
.model-select :deep(.el-select__placeholder) {
  color: var(--text);
  font-weight: 500;
}
.model-select :deep(.el-select__prefix) {
  color: var(--accent-text);
}
.model-select :deep(.el-select__prefix > svg) {
  width: 15px;
  height: 15px;
}
.model-select :deep(.el-select__caret) {
  color: var(--muted);
  font-size: 11px;
}
.model-select :deep(.el-select__wrapper.is-disabled) {
  opacity: 0.55;
  background: var(--canvas);
}
@media (max-width: 760px) {
  .model-select {
    flex: 1;
    width: 0;
    min-width: 0;
    max-width: 156px;
  }
  .model-select :deep(.el-select__wrapper) {
    padding: 5px 7px;
    gap: 4px;
    font-size: 10px;
  }
}
@media (max-width: 370px) {
  .model-select :deep(.el-select__prefix) {
    display: none;
  }
}
</style>
<style>
.model-select-popper.el-popper {
  width: 292px;
  max-width: calc(100vw - 32px);
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--surface);
  box-shadow: 0 12px 40px #10261a1f;
  overflow: hidden;
}
.model-select-popper .el-select-dropdown__header {
  border-bottom: 1px solid var(--line);
  padding: 13px 16px;
}
.model-menu-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
}
.model-menu-heading > span:last-child {
  font-size: 10px;
  font-weight: 400;
  color: var(--muted);
  background: var(--sidebar);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 1px 5px;
}
.model-select-popper .el-select-dropdown__list {
  padding: 6px;
}
.model-select-popper .el-select-dropdown__item {
  height: 60px;
  padding: 8px 9px;
  margin: 2px 0;
  border-radius: 8px;
  color: var(--text);
}
.model-select-popper .el-select-dropdown__item.is-hovering,
.model-select-popper .el-select-dropdown__item.is-selected {
  background: var(--accent-soft);
}
.model-option {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  line-height: 1.4;
}
.model-avatar {
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface);
  color: var(--accent-text);
  font-size: 15px;
  font-weight: 600;
}
.model-avatar.blue {
  color: #6e85ac;
}
.model-avatar.sand {
  color: #ad8665;
}
.model-option-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.model-option-copy strong {
  font-size: 12px;
  font-weight: 550;
}
.model-option-copy small {
  color: var(--muted);
  font-size: 10px;
  font-weight: 400;
}
.model-check {
  width: 16px;
  height: 16px;
  color: var(--accent-text);
}
.model-select-popper .el-select-dropdown__footer {
  padding: 10px 16px;
  border-top: 1px solid var(--line);
}
.model-menu-note {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.5;
  margin: 0;
}
</style>
