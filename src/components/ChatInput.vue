<template>
  <div class="wapper" :class="{ 'focus-class': focusClass }">
    <div class="file-card" v-if="uploadInfo.fileList.length">
      <ElAFilesCard v-model="uploadInfo.fileList"></ElAFilesCard>
    </div>
    <ElASender
      class="sender"
      v-model="content"
      placeholder="请输入聊天内容"
      variant="updown"
      @focus="focusClass = true"
      @blur="focusClass = false"
      @paste-file="uploadInfo.handleFileUpload"
    >
      <template #action-list>
        <ElSelect v-model="value" placeholder="模型选择" style="width: 160px">
          <ElOption
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <ElButton
          class="icon-btn"
          :style="{ marginLeft: 'auto' }"
          text
          :icon="Microphone"
          circle
        ></ElButton>
      </template>
      <template #prefix>
        <ElAFilesUpload v-bind="uploadInfo.commonProps" v-model="uploadInfo.fileList">
          <ElButton class="icon-btn" text :icon="Paperclip" circle></ElButton>
        </ElAFilesUpload>
      </template>
    </ElASender>
  </div>
</template>

<script setup lang="ts">
import { useUploadFileStore } from '@/stores/uploadFile'
import { ElASender, ElAFilesUpload, ElAFilesCard } from 'element-ai-vue'
import { ElSelect, ElOption, ElButton } from 'element-plus'
import { Microphone, Paperclip } from '@element-plus/icons-vue'
import { ref } from 'vue'

const value = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
]

const content = ref(``)
const focusClass = ref(false)

const uploadInfo = useUploadFileStore()
</script>

<style scoped lang="scss">
html.dark {
  .wapper {
    border-color: rgba(121, 121, 121, 0.6);

    &.focus-class {
      border-color: rgba($color: #fff, $alpha: 0.6);
    }
  }
}

.sender {
  min-height: 122px;
  :deep(.el-ai-sender__content) {
    max-height: 200px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(144, 147, 153, 0.3);
      &:hover {
        background-color: rgba(144, 147, 153, 0.5);
      }
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
}

.wapper {
  width: 100%;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(17, 25, 37, 0.15);
  .file-card {
    margin-bottom: 10px;
  }
  &.focus-class {
    border-color: rgba(17, 25, 37, 0.45);
  }
}

.icon-btn {
  font-size: 18px;
}
</style>
