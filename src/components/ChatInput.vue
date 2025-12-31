<template>
  <div class="wapper" :class="{ 'focus-class': focusClass }">
    <div class="file-card" v-if="uploadInfo.fileList.length">
      <ElAFilesCard v-model="uploadInfo.fileList"></ElAFilesCard>
    </div>
    <ElASender
      class="sender"
      v-model="content"
      ref="senderRef"
      placeholder="请输入聊天内容"
      variant="updown"
      :loading
      @focus="focusClass = true"
      @blur="focusClass = false"
      @paste-file="uploadInfo.handleFileUpload"
      @send="onSend"
    >
      <template #action-list>
        <ElSelect v-model="selectValue" placeholder="模型选择" style="width: 160px">
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
import { ref, useTemplateRef } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['send'])

const options = [
  {
    value: 'Gpt-3.5-turbo',
    label: 'Gpt-3.5-turbo',
  },
  {
    value: 'Gemini 3 Pro',
    label: 'Gemini 3 Pro',
  },
  {
    value: 'Claude Opus 4.5',
    label: 'Claude Opus 4.5',
  },
]
const senderRef = useTemplateRef('senderRef')
const selectValue = ref('Gpt-3.5-turbo')
const content = ref('')
const focusClass = ref(false)

const uploadInfo = useUploadFileStore()

const onSend = () => {
  const sendContent = senderRef.value?.editor()?.getText()
  emits('send', sendContent || '')
  content.value = ''
  uploadInfo.fileList = []
}
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
