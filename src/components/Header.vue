<template>
  <ElHeader class="header">
    <div class="title">
      <img src="https://element-ai-vue.com/logo.svg" alt="" />
      element-ai-vue 聊天室
    </div>
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

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
  .title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    img {
      height: 32px;
      margin-right: 8px;
    }
  }
}
</style>
