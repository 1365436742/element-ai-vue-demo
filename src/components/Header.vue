<template>
  <header class="header">
    <div class="breadcrumb">
      <button
        class="icon-button sidebar-toggle"
        aria-label="打开侧边栏"
        aria-controls="chat-sidebar"
        :aria-expanded="config.sidebarOpen"
        @click="config.sidebarOpen = true"
      >
        <AppIcon name="panel" />
      </button>
      <span class="workspace-name">工作空间</span><span class="breadcrumb-divider">/</span>
      <span class="page-name">AI 对话</span><span class="workspace-badge">个人</span>
    </div>
    <div class="header-actions">
      <span class="demo-badge"><i />演示模式</span>
      <span class="header-divider" />
      <button
        class="icon-button"
        :aria-label="config.isDark ? '切换浅色模式' : '切换深色模式'"
        :title="config.isDark ? '切换浅色模式' : '切换深色模式'"
        @click="config.toggleDark(!config.isDark)"
      >
        <AppIcon :name="config.isDark ? 'sun' : 'moon'" />
      </button>
      <span class="avatar" aria-label="访客">E</span>
    </div>
  </header>
</template>
<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { useConfigStore } from '@/stores/config'
const config = useConfigStore()
</script>
<style scoped>
.header {
  height: 76px;
  flex: 0 0 76px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
}
.breadcrumb,
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
}
.workspace-name,
.breadcrumb-divider {
  color: var(--subtle);
}
.page-name {
  font-weight: 550;
}
.workspace-badge {
  font-size: 10px;
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 2px 5px;
  margin-left: -8px;
}
.demo-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--muted);
  font-size: 11px;
}
.demo-badge i {
  width: 6px;
  height: 6px;
  background: #77a582;
  border-radius: 50%;
}
.header-divider {
  height: 18px;
  width: 1px;
  background: var(--line);
}
.header-actions {
  gap: 12px;
}
.avatar {
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background: #ebe9e0;
  color: #746d58;
  border: 3px solid var(--surface);
  box-shadow: 0 0 0 1px var(--line);
  display: grid;
  place-items: center;
  font:
    600 13px Georgia,
    serif;
}
.sidebar-toggle {
  display: none;
}
@media (max-width: 760px) {
  .header {
    height: 64px;
    flex-basis: 64px;
    padding: 0 18px;
    border-bottom: 1px solid var(--line);
  }
  .sidebar-toggle {
    display: inline-flex;
    margin-left: -6px;
  }
  .workspace-name,
  .breadcrumb-divider,
  .workspace-badge,
  .header-divider {
    display: none;
  }
  .breadcrumb,
  .header-actions {
    gap: 8px;
  }
}
</style>
