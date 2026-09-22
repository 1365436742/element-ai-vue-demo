<template>
  <span class="skill-tag">
    <button
      type="button"
      class="skill-tag-label"
      :aria-label="`了解${skill.name}技能`"
      :title="`点击了解「${skill.name}」的作用`"
      @click="emit('info')"
    >
      <AppIcon name="layers" /><span>{{ skill.name }}</span>
    </button>
    <button
      v-if="removable"
      type="button"
      class="skill-tag-remove"
      :disabled="disabled"
      :aria-label="`移除${skill.name}技能`"
      title="移除技能"
      @click.stop="emit('remove')"
    >
      <AppIcon name="close" />
    </button>
  </span>
</template>
<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import type { ChatSkill } from '@/data/skills'
defineProps<{ skill: ChatSkill; removable?: boolean; disabled?: boolean }>()
const emit = defineEmits<{ info: []; remove: [] }>()
</script>
<style scoped>
.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  max-width: 100%;
  height: 27px;
  padding: 0 3px 0 2px;
  border: 1px solid #a7bfac66;
  border-radius: 7px;
  background: var(--accent-soft);
  color: var(--accent-text);
  vertical-align: middle;
}
.skill-tag-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 23px;
  padding: 0 5px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font-size: 12px;
  font-weight: 550;
  white-space: nowrap;
}
.skill-tag-label:hover {
  background: var(--surface);
}
.skill-tag-label > svg {
  width: 14px;
  height: 14px;
}
.skill-tag-remove {
  display: grid;
  place-items: center;
  width: 19px;
  height: 19px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  color: inherit;
  background: transparent;
  opacity: 0.65;
}
.skill-tag-remove:hover {
  opacity: 1;
  background: var(--surface);
}
.skill-tag-remove > svg {
  width: 11px;
  height: 11px;
}
</style>
