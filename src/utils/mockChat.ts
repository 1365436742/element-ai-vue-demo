/**
 * 模拟流式聊天返回的工具
 */

// 模拟的语料库
const THINKING_STEPS = [
  {
    key: 1,
    title: '第一步：理解需求',
    description:
      '分析用户需求，明确目标和功能。分析用户需求，明确目标和功能。分析用户需求，明确目标和功能。分析用户需求，明确目标和功能。分析用户需求，明确目标和功能。分析用户需求，明确目标和功能。分析用户需求，明确目标和功能。分析用户需求，明确目标和功能。',
    icon: `/assets/book-icon.png`,
  },
  {
    key: 2,
    title: '第二步：设计架构',
    description: '制定系统架构，选择技术栈和工具。',
    icon: `/assets/book-icon.png`,
  },
  {
    key: 3,
    title: '第三步：编写代码',
    description: '根据设计文档编写高质量代码，遵循编码规范。',
    icon: `/assets/book-icon.png`,
  },
  {
    key: 4,
    title: '第四步：测试验证',
    description: '编写单元测试和集成测试，确保功能正确性。',
    icon: `/assets/book-icon.png`,
  },
  {
    key: 5,
    title: '第五步：部署上线',
    description: '配置生产环境，执行部署脚本，监控系统运行状态。',
    icon: `/assets/book-icon.png`,
  },
]

const TEXT_TEMPLATES = [
  '根据您的请求，我为您整理了以下信息。',
  '这是一个非常有趣的问题，涉及到多个层面的考量。',
  '在计算机科学中，这是一个经典的问题。',
  '我们可以从以下几个方面来解决这个问题：',
  '通常情况下，最佳实践建议我们这样做：',
  '这就好比是在迷宫中寻找出口，我们需要一种启发式算法。',
  '让我们深入探讨一下这个概念的本质。',
]

const CODE_SNIPPETS = [
  {
    lang: 'typescript',
    code: `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  },
  {
    lang: 'python',
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
  },
  {
    lang: 'vue',
    code: `<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <button @click="count++">Count is: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const title = ref('Hello World');
const count = ref(0);
</script>`,
  },
]

const MATH_FORMULAS = [
  // '$$E = mc^2$$',
  // '$$e^{i\\pi} + 1 = 0$$',
  '$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$',
  '$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$',
  '$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$',
  '$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$',
  // '$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t} dt$$',
]

const MERMAID_CHARTS = [
  `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B`,
  `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`,
  `mindmap
  root((Problem))
    Origins
      Long history
      Popularization
    Impact
      Society
      Economy`,
]

export type StreamMessageType = 'thinking' | 'text' | 'code' | 'chart'

export interface MockStreamEvent {
  type: StreamMessageType
  content: string // 增量内容
  meta?: any // 额外信息，如代码语言、引用链接等
  done?: boolean // 当前块是否结束
}

// 简单的伪随机数生成器，基于种子
class Random {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  // 生成 0-1 之间的随机数
  next(): number {
    const x = Math.sin(this.seed++) * 10000
    return x - Math.floor(x)
  }

  // 生成指定范围的整数
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  // 从数组中随机选择一个
  pick<T>(arr: T[]): any {
    return arr[this.nextInt(0, arr.length - 1)]
  }

  // 随机布尔值
  bool(probability: number = 0.5): boolean {
    return this.next() < probability
  }
}

/**
 * 模拟流式聊天函数
 * @param input 用户输入
 * @param onChunk 回调函数，接收增量数据
 */
export async function* mockChatStream(
  input: string,
): AsyncGenerator<MockStreamEvent, void, unknown> {
  // 基于输入长度生成种子，保证相同的输入有相对固定的随机模式（可选，这里为了演示随机性，也可以加时间戳）
  const seed = input.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + Date.now()
  const rng = new Random(seed)

  // 1. 模拟思考过程 (Thinking)
  // 80% 概率出现思考过程
  // if (rng.bool(0.8)) {
  //   for (let i = 0; i < THINKING_STEPS.length; i++) {
  //     const step = THINKING_STEPS[i]

  //     // 模拟打字机效果
  //     for (const char of step!.description) {
  //       yield {
  //         type: 'thinking',
  //         content: char,
  //         meta: {
  //           stepIndex: i,
  //           key: step!.key,
  //           title: step!.title,
  //           icon: step!.icon,
  //         },
  //       }
  //       await delay(rng.nextInt(10, 50))
  //     }
  //   }
  //   yield { type: 'thinking', content: '', done: true }
  // }

  // 2. 模拟正文生成 (Text + Code + Chart + Math)
  const paragraphs = rng.nextInt(2, 5)

  for (let i = 0; i < paragraphs; i++) {
    // 文本段落
    const text = rng.pick(TEXT_TEMPLATES) + (rng.bool(0.5) ? ` 关于 "${input}" 的分析如下：` : '')
    for (const char of text) {
      yield { type: 'text', content: char }
      await delay(rng.nextInt(20, 60))
    }
    yield { type: 'text', content: '\n\n' }

    // 随机插入代码块
    if (rng.bool(0.4)) {
      const snippet = rng.pick(CODE_SNIPPETS)
      const codeBlock = `\`\`\`${snippet.lang}\n${snippet.code}\n\`\`\`\n\n`
      // 这里可以选择一次性返回代码块，或者流式返回。为了效果，流式返回。
      for (const char of codeBlock) {
        yield { type: 'text', content: char } // 代码块通常作为 markdown 文本的一部分渲染
        await delay(rng.nextInt(5, 20)) // 代码打字快一点
      }
    }

    // 随机插入流程图
    if (rng.bool(0.9)) {
      const chart = rng.pick(MERMAID_CHARTS)
      const chartBlock = `\`\`\`mermaid\n${chart}\n\`\`\`\n\n`
      for (const char of chartBlock) {
        yield { type: 'text', content: char }
        await delay(rng.nextInt(5, 20))
      }
    }

    // 随机插入数学公式
    if (rng.bool(0.9)) {
      const formula = rng.pick(MATH_FORMULAS)
      const formulaText = `根据 ${formula} 可知...\n\n`
      for (const char of formulaText) {
        yield { type: 'text', content: char }
        await delay(rng.nextInt(20, 60))
      }
    }
  }

  yield { type: 'text', content: '', done: true }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
