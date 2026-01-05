<template>
  <div class="scroll-area">
    <ElABubbleList>
      <div class="box-area">
        <ElABubble v-for="(item, index) in list" :key="index" v-bind="item" footer-trigger="hover">
          <template #header v-if="item?.thinkingSteps?.length">
            <ElAThinking title="思考内容" v-model="item.thinkExpanded">
              <div class="thought-chain">
                <ElAThoughtChain :list="item.thinkingSteps"></ElAThoughtChain>
              </div>
            </ElAThinking>
          </template>
          <template #footer>
            <div class="actions" :class="item.placement">
              <span class="element-ai-vue-iconfont icon-copy"></span>
              <span class="element-ai-vue-iconfont icon-regen"></span>
            </div>
          </template>
        </ElABubble>
      </div>
    </ElABubbleList>
  </div>
</template>

<script setup lang="ts">
import { ElABubbleList, ElABubble, ElAThinking, ElAThoughtChain } from 'element-ai-vue'

defineProps({
  list: {
    type: Array as () => Array<any>,
    required: true,
  },
})
</script>

<style scoped lang="scss">
.scroll-area {
  flex: 1;
  height: 0;
  width: 100%;
  padding-bottom: 20px;
  // :deep(.el-ai-bubble-list) {
  //   padding: 0 20px;
  // }
  .box-area {
    max-width: 848px;
    margin: 0 auto;
  }
}
.thought-chain {
  padding: 0 13px 13px;
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
