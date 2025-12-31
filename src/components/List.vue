<template>
  <ElABubbleList class="scroll-area">
    <ElABubble v-for="(item, index) in list" :key="index" v-bind="item" footer-trigger="hover">
      <template #footer>
        <div class="actions" :class="item.placement">
          <span class="element-ai-vue-iconfont icon-copy"></span>
          <span class="element-ai-vue-iconfont icon-regen"></span>
        </div>
      </template>
    </ElABubble>
  </ElABubbleList>
</template>

<script setup lang="ts">
import { ElABubbleList, ElABubble } from 'element-ai-vue'

defineProps({
  list: {
    type: Array as () => Array<any>,
    required: true,
  },
})

// const start = () => {
//   const role = list.value.length % 2 === 0 ? 'user' : 'assistant'
//   list.value.push({
//     content: '你好我是element-ai-vue',
//     placement: role === 'user' ? 'end' : 'start',
//     isMarkdown: role === 'assistant',
//     typing: role === 'assistant',
//     variant: role === 'assistant' ? 'borderless' : 'default',
//   })
// }
// onMounted(() => {
//   for (let i = 0; i < 10; i++) {
//     start()
//   }
// })
</script>

<style scoped lang="scss">
.scroll-area {
  width: 100%;
}
.base-list {
  height: 400px;
  border: 1px solid #000;
  padding: 8px;
  box-sizing: border-box;
  .lite-item {
    line-height: 50px;
  }
}
.actions {
  display: flex;
  gap: 8px;
  font-size: 16px;
  &.end {
    justify-content: flex-end;
  }
  & > span {
    cursor: pointer;
    padding: 0 5px;
  }
}
</style>
