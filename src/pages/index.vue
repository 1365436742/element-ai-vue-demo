<template>
  <div class="index-page">
    <div class="chat-content">
      <ChatInput></ChatInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatInput from '@/components/ChatInput.vue'
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
  }
}
</style>
