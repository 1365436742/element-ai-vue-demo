<template>
  <ElDialog
    v-model="visible"
    :title="`${skill?.name ?? ''} · 技能说明`"
    width="440px"
    align-center
    append-to-body
    class="skill-info-dialog"
    :close-on-click-modal="true"
  >
    <template v-if="skill">
      <div class="skill-info-intro">
        <span class="skill-info-icon"><AppIcon :name="skill.icon" /></span>
        <p>{{ skill.description }}</p>
      </div>
      <div class="skill-info-section">
        <h3>这个技能有什么用？</h3>
        <p>{{ skill.instruction }}</p>
      </div>
      <div class="skill-info-example">
        <span>你可以这样问</span>
        <p>“{{ skill.example }}”</p>
      </div>
      <div class="skill-info-note">
        <AppIcon name="info" />
        <p>
          技能标签会作为本次消息的任务背景，帮助助手按指定方式组织回答。点击 ×
          可移除，发送后输入框中的标签会自动清空。<span>当前为交互演示，不会调用外部工具。</span>
        </p>
      </div>
    </template>
    <template #footer
      ><button class="skill-info-confirm" @click="visible = false">知道了</button></template
    >
  </ElDialog>
</template>
<script setup lang="ts">
import { ElDialog } from 'element-plus'
import AppIcon from './AppIcon.vue'
import type { ChatSkill } from '@/data/skills'
const visible = defineModel<boolean>({ required: true })
defineProps<{ skill: ChatSkill | null }>()
</script>
<style>
.skill-info-dialog.el-dialog {
  max-width: calc(100vw - 32px);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: var(--surface);
  box-shadow: 0 20px 70px #10261a33;
}
.skill-info-dialog .el-dialog__header {
  padding: 0 28px 19px 0;
  margin: 0;
}
.skill-info-dialog .el-dialog__title {
  color: var(--text);
  font-size: 16px;
  font-weight: 600;
}
.skill-info-dialog .el-dialog__headerbtn {
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
}
.skill-info-dialog .el-dialog__body {
  color: var(--text);
  padding: 0;
}
.skill-info-dialog .el-dialog__footer {
  padding: 20px 0 0;
}
.skill-info-intro {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}
.skill-info-intro p {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
}
.skill-info-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent-text);
}
.skill-info-icon > svg {
  width: 24px;
  height: 24px;
}
.skill-info-section {
  margin: 19px 0;
}
.skill-info-section h3 {
  font-size: 12px;
  font-weight: 600;
  margin: 0 0 8px;
}
.skill-info-section p {
  font-size: 12px;
  line-height: 1.9;
  margin: 0;
  color: var(--muted);
}
.skill-info-example {
  border: 1px solid var(--line);
  background: var(--canvas);
  border-radius: 10px;
  padding: 13px 15px;
}
.skill-info-example > span {
  color: var(--muted);
  font-size: 10px;
}
.skill-info-example p {
  color: var(--text);
  font-size: 12px;
  line-height: 1.8;
  margin: 7px 0 0;
}
.skill-info-note {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  color: var(--muted);
}
.skill-info-note > svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  margin-top: 3px;
}
.skill-info-note p {
  margin: 0;
  font-size: 11px;
  line-height: 1.85;
}
.skill-info-note span {
  display: block;
  margin-top: 5px;
  color: var(--subtle);
}
.skill-info-confirm {
  padding: 9px 23px;
  color: white;
  background: var(--accent);
  border: 0;
  border-radius: 8px;
  font-size: 12px;
}
.skill-info-confirm:hover {
  background: var(--accent-hover);
}
@media (max-width: 760px) {
  .skill-info-dialog.el-dialog {
    padding: 20px;
  }
  .skill-info-dialog .el-dialog__headerbtn {
    right: 10px;
    top: 10px;
  }
}
</style>
