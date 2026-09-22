<template>
  <ElAConfigProvider :theme="config.theme">
    <div class="app-shell">
      <Sidebar />
      <div class="workspace" :inert="config.sidebarOpen">
        <Header />
        <ElADragUpload
          v-model="upload.fileList"
          v-bind="upload.commonProps"
          class="upload-area"
          :disabled="chat.loading"
        >
          <main id="main-content"><router-view /></main>
        </ElADragUpload>
      </div>
    </div>
  </ElAConfigProvider>
</template>

<script setup lang="ts">
import { ElAConfigProvider, ElADragUpload } from 'element-ai-vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import { useConfigStore } from './stores/config'
import { useUploadFileStore } from './stores/uploadFile'
import { useChatStore } from './stores/chat'
import './styles.css'
const config = useConfigStore()
const upload = useUploadFileStore()
const chat = useChatStore()
</script>
