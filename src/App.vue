<template>
  <ElAConfigProvider :theme="config.theme">
    <ElContainer direction="vertical">
      <Header></Header>
      <ElADragUpload class="upload-area">
        <ElMain>
          <router-view></router-view>
        </ElMain>
      </ElADragUpload>
    </ElContainer>
  </ElAConfigProvider>
</template>

<script setup lang="ts">
import { ElAConfigProvider, ElADragUpload } from 'element-ai-vue'
import { ElContainer, ElMain } from 'element-plus'
import Header from './components/Header.vue'
import { useConfigStore } from './stores/config'

const config = useConfigStore()
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html.dark .el-ai-markdown .el-ai-code-mermaid {
  background-color: #2d2d2d !important;
}
html,
body,
#app,
.el-container {
  height: 100%;
}
body {
  overflow: hidden;
}
.el-main {
  width: 100%;
  height: 100%;
}
.el-ai-drag-upload.upload-area {
  flex: 1;
  height: 0;
}
</style>
