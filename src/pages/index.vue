<template>
  <div class="index-page">
    <div class="chat-content">
      <List :list="messageList" v-if="messageList.length > 0"></List>
      <div class="center-content" :class="{ haveMessage: !!messageList.length }">
        <SplitText
          v-if="!messageList.length"
          text="欢迎使用 element-ai-vue 聊天示例"
          class="title-text"
          :delay="100"
          :duration="0.6"
          ease="power3.out"
          split-type="chars"
          :from="{ opacity: 0, y: 40 }"
          :to="{ opacity: 1, y: 0 }"
          :threshold="0.1"
          root-margin="-100px"
          text-align="center"
        />
        <ChatInput :loading @send="onSend"></ChatInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatInput from '@/components/ChatInput.vue'
import SplitText from '@/components/SplitText.vue'
import List from '@/components/List.vue'
import { mockChatStream } from '@/utils/mockChat'

const messageList = ref<Array<any>>([])
const loading = ref(false)

async function handleSend(input: string) {
  const stream = mockChatStream(input)
  messageList.value.push({
    content: '',
    placement: 'start',
    isMarkdown: true,
    // typing: false,
    // typingOver: false,
    variant: 'borderless',
    loading: true,
    thinkingContent: '',
    thinkingSteps: [],
  })
  const currentMessage = messageList.value[messageList.value.length - 1]

  for await (const chunk of stream) {
    currentMessage.loading = false
    if (chunk.done) {
      continue
    }
    if (chunk.type === 'thinking') {
      if (currentMessage.thinkExpanded === undefined) {
        currentMessage.thinkExpanded = true
      }

      const { stepIndex, key, title, icon } = chunk.meta
      // 确保数组长度足够，防止跳跃索引（虽然 mock 不会跳跃）
      if (!currentMessage.thinkingSteps[stepIndex]) {
        currentMessage.thinkingSteps[stepIndex] = {
          key,
          title,
          description: '',
          icon,
        }
      }
      // 累加内容
      currentMessage.thinkingSteps[stepIndex].description += chunk.content
    } else if (chunk.type === 'text') {
      // 正文内容（包含 Markdown, 代码块, 流程图, 公式）
      currentMessage.content += chunk.content
    }
  }
  currentMessage.typingOver = true
  loading.value = false
}

const onSend = (content: string) => {
  messageList.value.push({
    content,
    placement: 'end',
  })
  loading.value = true
  handleSend(content)
}
</script>

<style scoped lang="scss">
.index-page {
  width: 100%;
  height: 100%;
  .chat-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .center-content {
      width: 100%;
      max-width: 848px;
      margin: 0 auto;
      margin-top: -60px;
      &.haveMessage {
        margin-top: 0;
      }
      .title-text {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
