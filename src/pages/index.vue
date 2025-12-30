<template>
  <div class="index-page">
    <div class="chat-content">
      <div class="center-content">
        <SplitText
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
        <ChatInput @send="onSend"></ChatInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatInput from '@/components/ChatInput.vue'
import SplitText from '@/components/SplitText.vue'

const onSend = (content: string) => {
  console.log('发送的内容：', content)
}
</script>

<style scoped lang="scss">
.index-page {
  width: 100%;
  height: 100%;
  .chat-content {
    width: 100%;
    height: 100%;
    max-width: 848px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .center-content {
      width: 100%;
      .title-text {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
