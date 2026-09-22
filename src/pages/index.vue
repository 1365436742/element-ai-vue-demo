<template>
  <section class="chat-page" :class="{ 'has-messages': chat.messages.length }">
    <div class="chat-stack">
      <div v-if="!chat.messages.length" class="welcome">
        <div class="welcome-mark"><AppIcon name="spark" /><span class="little-spark">✧</span></div>
        <p class="eyebrow">A LITTLE CURIOSITY, ENDLESS POSSIBILITIES</p>
        <h1>你好，<span>今天想聊点什么？</span></h1>
        <p class="welcome-description">从一个问题，到一个好想法。让灵感在对话中发生。</p>
      </div>
      <List
        v-if="chat.messages.length"
        :key="chat.activeId ?? 'new'"
        :list="chat.messages"
        :loading="chat.loading"
        @regenerate="chat.regenerate"
      />
      <div class="composer-area">
        <ChatInput
          :key="chat.draftKey"
          ref="chatInput"
          :loading="chat.loading"
          @send="chat.send"
          @stop="chat.stop"
        />
        <div v-if="!chat.messages.length" class="composer-caption">
          <span class="tiny-dot" />支持文字与附件交互体验，当前使用模拟数据
        </div>
      </div>
      <div v-if="!chat.messages.length" class="suggestions">
        <div class="suggestions-heading">
          <span>给灵感一个起点</span
          ><button @click="suggestionPage = (suggestionPage + 1) % suggestionGroups.length">
            <AppIcon name="refresh" />换一组
          </button>
        </div>
        <div class="suggestion-grid">
          <button
            v-for="suggestion in suggestionGroups[suggestionPage]"
            :key="suggestion.title"
            class="suggestion-card"
            :class="suggestion.color"
            @click="chatInput?.fill(suggestion.prompt)"
          >
            <span class="suggestion-icon"><AppIcon :name="suggestion.icon" /></span
            ><AppIcon name="diagonal" class="card-arrow" />
            <span class="suggestion-title">{{ suggestion.title }}</span
            ><span class="suggestion-description">{{ suggestion.description }}</span>
          </button>
        </div>
      </div>
    </div>
    <footer class="page-footer">
      <span>一点好奇，无限可能</span><i />{{
        chat.loading ? '正在生成演示内容，你可以随时停止' : '内容由模拟数据生成，仅供体验参考'
      }}
    </footer>
  </section>
</template>
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import ChatInput from '@/components/ChatInput.vue'
import AppIcon from '@/components/AppIcon.vue'
import List from '@/components/List.vue'
import { useChatStore } from '@/stores/chat'
const chat = useChatStore()
const chatInput = useTemplateRef('chatInput')
const suggestionPage = ref(0)
const suggestionGroups = [
  [
    {
      icon: 'write',
      color: 'sage',
      title: '让文字更出彩',
      description: '打磨文案，找到恰好的表达',
      prompt: '帮我写一段关于春日咖啡馆的文案，语气温暖自然，有生活感。',
    },
    {
      icon: 'code',
      color: 'blue',
      title: '和代码交个朋友',
      description: '理清思路，解决开发难题',
      prompt: '请用简单的例子解释 Vue 3 的 ref 和 reactive 有什么区别。',
    },
    {
      icon: 'book',
      color: 'sand',
      title: '打开新的视角',
      description: '拆解知识，把复杂变简单',
      prompt: '请用生活中的例子解释什么是复利，并给我一个学习中的应用方法。',
    },
    {
      icon: 'compass',
      color: 'rose',
      title: '给生活一点灵感',
      description: '旅行、日常与意料外的惊喜',
      prompt: '帮我安排一个轻松的周末计划，包含户外散步、阅读和一顿自己做的晚餐。',
    },
  ],
  [
    {
      icon: 'write',
      color: 'sage',
      title: '告别空白文档',
      description: '从零开始，写出第一段',
      prompt: '帮我拟一份个人年度总结的大纲，从工作、学习和生活三个维度展开。',
    },
    {
      icon: 'code',
      color: 'blue',
      title: '把想法变成代码',
      description: '一步一步，做一个小工具',
      prompt: '用 TypeScript 写一个防抖函数，并解释每一步的作用。',
    },
    {
      icon: 'book',
      color: 'sand',
      title: '开启学习新计划',
      description: '小小进步，也能积累成改变',
      prompt: '帮我制定一个每天 30 分钟、持续四周的英语口语学习计划。',
    },
    {
      icon: 'compass',
      color: 'rose',
      title: '发现日常的小美好',
      description: '为平凡的一天增加新意',
      prompt: '推荐五种不需要花很多钱、在家就能尝试的创意爱好。',
    },
  ],
] as const
</script>
<style scoped>
.chat-page {
  height: 100%;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.chat-stack {
  width: 100%;
  max-width: 790px;
  margin: auto;
  padding: 35px 0 70px;
  flex-shrink: 0;
}
.welcome {
  text-align: center;
  margin-bottom: 34px;
  animation: welcome-in 0.55s ease both;
}
.welcome-mark {
  width: 64px;
  height: 64px;
  position: relative;
  margin: 0 auto 22px;
  display: grid;
  place-items: center;
  color: var(--accent-text);
}
.welcome-mark::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--icon-bg);
  border: 1px solid var(--line);
  border-radius: 21px;
  transform: rotate(-8deg);
}
.welcome-mark > svg {
  position: relative;
  width: 36px;
  height: 36px;
  stroke-width: 1.5;
}
.little-spark {
  position: absolute;
  right: -13px;
  top: -9px;
  color: #93a789;
  font-size: 25px;
}
.eyebrow {
  color: var(--subtle);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 2.4px;
  margin: 0 0 15px;
}
.welcome h1 {
  margin: 0;
  color: var(--accent-text);
  font-size: clamp(26px, 3vw, 37px);
  line-height: 1.45;
  font-weight: 550;
  letter-spacing: -1px;
}
.welcome h1 span {
  color: var(--text);
}
.welcome-description {
  color: var(--muted);
  margin: 15px 0 0;
  font-size: 13px;
  line-height: 1.8;
  letter-spacing: 0.4px;
}
.composer-area {
  width: 100%;
}
.composer-caption {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 13px 0 0;
  color: var(--subtle);
  font-size: 10px;
}
.tiny-dot {
  width: 4px;
  height: 4px;
  background: #95aa99;
  border-radius: 50%;
}
.suggestions {
  margin-top: 36px;
}
.suggestions-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
  color: var(--muted);
  font-size: 11px;
  margin-bottom: 13px;
}
.suggestions-heading > button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 0 4px 10px;
  background: transparent;
  border: 0;
  color: var(--muted);
  font-size: 10px;
}
.suggestions-heading > button:hover {
  color: var(--accent-text);
}
.suggestions-heading svg {
  width: 12px;
  height: 12px;
}
.suggestion-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.suggestion-card {
  position: relative;
  text-align: left;
  min-width: 0;
  padding: 17px 14px 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 11px;
  transition:
    transform 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}
.suggestion-card:hover {
  transform: translateY(-4px);
  border-color: #a6bca8;
  box-shadow: 0 6px 18px #1f452b08;
}
.suggestion-icon {
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  border-radius: 9px;
  color: #5c8364;
  background: #edf3e9;
  margin-bottom: 16px;
}
.suggestion-icon svg {
  width: 17px;
  height: 17px;
}
.blue .suggestion-icon {
  background: #edf1f7;
  color: #697f9c;
}
.sand .suggestion-icon {
  background: #f6f0e3;
  color: #a48b50;
}
.rose .suggestion-icon {
  background: #f5ece8;
  color: #b18873;
}
:global(html.dark .suggestion-icon) {
  background: #344636;
  color: #add0a5;
}
:global(html.dark .blue .suggestion-icon) {
  background: #313e50;
  color: #a7bbd6;
}
:global(html.dark .sand .suggestion-icon) {
  background: #463f30;
  color: #d5c18f;
}
:global(html.dark .rose .suggestion-icon) {
  background: #493932;
  color: #d7b39d;
}
.card-arrow {
  position: absolute;
  right: 14px;
  top: 21px;
  width: 14px;
  height: 14px;
  color: var(--subtle);
  opacity: 0;
  transition: opacity 0.2s;
}
.suggestion-card:hover .card-arrow,
.suggestion-card:focus-visible .card-arrow {
  opacity: 1;
}
.suggestion-title {
  display: block;
  font-size: 13px;
  font-weight: 550;
  margin-bottom: 7px;
}
.suggestion-description {
  display: block;
  font-size: 11px;
  line-height: 1.7;
  color: var(--muted);
}
.page-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  flex-shrink: 0;
  color: var(--subtle);
  padding: 16px 0 23px;
  font-size: 9px;
  letter-spacing: 0.3px;
}
.page-footer i {
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: var(--subtle);
}
.has-messages {
  overflow: hidden;
}
.has-messages .chat-stack {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 15px 0 0;
  margin: 0 auto;
}
.has-messages .composer-area {
  flex-shrink: 0;
  padding-top: 12px;
}
.has-messages .page-footer {
  padding-top: 14px;
  padding-bottom: 17px;
}
@keyframes welcome-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (min-width: 1440px) {
  .chat-stack {
    max-width: 830px;
  }
}
@media (max-width: 1100px) {
  .chat-page {
    padding: 0 30px;
  }
  .suggestion-grid {
    gap: 9px;
  }
  .suggestion-card {
    padding-left: 12px;
    padding-right: 12px;
  }
  .suggestion-description {
    font-size: 10px;
  }
}
@media (max-width: 760px) {
  .chat-page {
    padding: 0 20px;
  }
  .chat-stack {
    padding-top: 38px;
    padding-bottom: 24px;
  }
  .welcome {
    margin-bottom: 26px;
  }
  .welcome-mark {
    width: 52px;
    height: 52px;
    margin-bottom: 21px;
  }
  .welcome-mark::before {
    border-radius: 16px;
  }
  .welcome-mark > svg {
    width: 30px;
    height: 30px;
  }
  .eyebrow {
    font-size: 8px;
    letter-spacing: 1.5px;
  }
  .welcome h1 {
    font-size: 27px;
    letter-spacing: -0.8px;
  }
  .welcome-description {
    font-size: 11px;
    margin-top: 12px;
    letter-spacing: 0;
  }
  .composer-caption {
    font-size: 9px;
    gap: 4px;
  }
  .suggestions {
    margin-top: 29px;
  }
  .suggestion-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .suggestion-card {
    padding: 14px;
  }
  .suggestion-icon {
    width: 27px;
    height: 27px;
    margin-bottom: 12px;
  }
  .suggestion-description {
    font-size: 10px;
  }
  .card-arrow {
    opacity: 0.55;
    top: 20px;
  }
  .page-footer {
    font-size: 10px;
    padding-bottom: 18px;
    gap: 6px;
  }
  .has-messages .chat-stack {
    padding-top: 16px;
  }
  .has-messages .page-footer > span,
  .has-messages .page-footer > i {
    display: none;
  }
}
@media (max-width: 370px) {
  .chat-page {
    padding: 0 14px;
  }
  .welcome h1 {
    font-size: 24px;
  }
  .welcome-description {
    font-size: 10px;
  }
  .suggestion-description {
    font-size: 10px;
  }
}
</style>
