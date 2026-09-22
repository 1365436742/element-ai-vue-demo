export interface ChatSkill {
  id: string
  name: string
  group: string
  description: string
  instruction: string
  example: string
  icon: 'chart' | 'code' | 'write' | 'book' | 'compass' | 'spark'
  color: 'sage' | 'blue' | 'sand' | 'rose'
}

export const chatSkills: ChatSkill[] = [
  {
    id: 'visualize',
    name: '可视化',
    group: '效率与创作',
    icon: 'chart',
    color: 'sage',
    description: '把数据、流程与复杂关系变成清晰的图表',
    instruction:
      '根据问题选择合适的图表或流程图，先解释结构，再给出可视化方案；如果数据不足，先说明需要补充的信息。',
    example: '把产品从需求到上线的过程整理成一张流程图。',
  },
  {
    id: 'coding',
    name: '代码助手',
    group: '效率与创作',
    icon: 'code',
    color: 'blue',
    description: '解释代码、排查问题，梳理实现思路',
    instruction: '先分析需求或错误原因，再给出易读的代码示例和验证步骤，并解释关键实现。',
    example: '用 Vue 3 实现一个支持搜索的列表，并解释实现思路。',
  },
  {
    id: 'writing',
    name: '文案润色',
    group: '效率与创作',
    icon: 'write',
    color: 'rose',
    description: '调整措辞与语气，让文字表达更自然',
    instruction:
      '保留原文的核心意思，根据使用场景调整结构、语气和措辞，给出润色版本及简短的修改说明。',
    example: '把这段产品介绍改得更简洁、更有亲和力。',
  },
  {
    id: 'explain',
    name: '知识讲解',
    group: '学习与生活',
    icon: 'book',
    color: 'sand',
    description: '拆解复杂概念，用例子帮助理解',
    instruction: '从基础概念开始，使用日常类比和具体例子逐步解释，最后总结关键点。',
    example: '用生活中的例子向初学者解释什么是递归。',
  },
  {
    id: 'study',
    name: '学习计划',
    group: '学习与生活',
    icon: 'spark',
    color: 'sage',
    description: '拆分学习目标，安排可执行的每日计划',
    instruction: '结合学习目标、现有水平和可用时间，按阶段安排任务，给出练习方式和检查进度的方法。',
    example: '每天半小时，帮我安排四周的英语口语学习计划。',
  },
  {
    id: 'travel',
    name: '旅行规划',
    group: '学习与生活',
    icon: 'compass',
    color: 'blue',
    description: '整理目的地、行程节奏与出行清单',
    instruction:
      '根据目的地、天数和偏好安排合理的行程，保留休息与交通时间，并标明需要另行确认的信息。',
    example: '安排一个节奏轻松、适合步行的三日城市旅行。',
  },
]
