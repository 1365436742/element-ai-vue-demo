<template>
  <ElHeader class="header">
    <div class="title">element-ai-vue 聊天</div>
    <ElSwitch
      v-model="config.isDark"
      inline-prompt
      :active-action-icon="Moon"
      :inactive-action-icon="Sunny"
      @change="config.toggleDark"
    />
  </ElHeader>
</template>

<script setup lang="ts">
import { ElHeader, ElSwitch } from 'element-plus'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/config'

const config = useConfigStore()
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
}
</style>
