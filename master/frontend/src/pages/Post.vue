<template>
  <article class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-8">
      <RouterLink
        to="/"
        class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← 返回首页
      </RouterLink>

      <div class="flex items-center gap-4 mb-4">
        <RouterLink
          :to="`/category/${encodeURIComponent(post.category)}`"
          class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          {{ post.category }}
        </RouterLink>
        <span class="text-gray-500 text-sm">{{ post.date }}</span>
      </div>

      <h1 class="text-4xl font-bold text-gray-800 mb-6">{{ post.title }}</h1>

      <div class="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
        <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
          作者
        </div>
        <div>
          <p class="font-medium text-gray-800">博主</p>
          <p class="text-sm text-gray-500">技术爱好者 | 全栈开发者</p>
        </div>
      </div>

      <div class="prose prose-lg max-w-none">
        <p v-for="(paragraph, index) in post.content" :key="index" class="mb-4 leading-relaxed text-gray-700">
          {{ paragraph }}
        </p>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">标签</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
          >
            # {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
const postId = route.params.id as string;

const posts: Record<string, {
  title: string;
  category: string;
  date: string;
  content: string[];
  tags: string[];
}> = {
  '1': {
    title: 'Vue 3 Composition API 深入理解',
    category: '技术',
    date: '2024-01-15',
    content: [
      'Vue 3 的 Composition API 是一个重要的新特性，它改变了我们组织 Vue 组件代码的方式。与传统的 Options API 相比，Composition API 提供了更好的代码组织、逻辑复用和类型推断能力。',
      'Composition API 的核心是 setup() 函数，这是组件中所有组合式 API 的入口点。在 setup 函数中，我们可以定义响应式状态、计算属性、方法，并将它们返回给模板使用。',
      '使用 ref 和 reactive 是创建响应式数据的两种主要方式。ref 用于创建包装对象的响应式引用，通常用于基本类型值；而 reactive 则用于创建响应式对象。理解它们之间的区别和使用场景是非常重要的。',
      'computed 和 watch 是 Composition API 中的两个重要工具。computed 用于创建计算属性，它会自动缓存结果，只有依赖项变化时才会重新计算。watch 则用于监听响应式数据的变化，并执行相应的副作用操作。',
      '除了这些基础的 API，Vue 3 还提供了许多强大的组合式 API，如 toRefs、toRef、provide/inject、生命周期钩子等。掌握这些 API 能够让我们编写更加优雅和高效的代码。',
      '在实际项目中，我们可以通过自定义 Hooks（组合式函数）来提取和复用逻辑。这种方式比传统的 Mixin 更加清晰和类型安全，是 Composition API 的一大优势。',
    ],
    tags: ['Vue', 'JavaScript', '前端开发'],
  },
  '2': {
    title: 'TypeScript 高级类型技巧',
    category: '技术',
    date: '2024-01-10',
    content: [
      'TypeScript 的类型系统非常强大，除了基本的类型注解外，还提供了许多高级类型特性。掌握这些特性可以让我们写出更加健壮和类型安全的代码。',
      '泛型（Generics）是 TypeScript 中最重要的特性之一。它允许我们编写可以适用于多种类型的代码，同时保持类型安全。我们可以使用泛型来创建可复用的函数、类和接口。',
      '条件类型（Conditional Types）允许我们根据类型关系选择不同的类型。使用 extends 关键字，我们可以实现类似三元表达式的类型逻辑。这在类型推断和类型转换中非常有用。',
      '映射类型（Mapped Types）允许我们基于现有类型创建新类型。通过 keyof 操作符和 in 操作符，我们可以遍历类型的键，并对每个键进行类型转换。Partial、Required、Readonly 等内置类型就是使用映射类型实现的。',
      '类型推断（Type Inference）是 TypeScript 的另一个强大功能。编译器可以根据上下文自动推断变量的类型。理解类型推断的工作原理，可以帮助我们写出更简洁的代码。',
      '模板字面量类型（Template Literal Types）是 TypeScript 4.1 引入的新特性。它允许我们基于字符串字面量类型创建复杂的类型，这对于动态生成类型非常有用。',
    ],
    tags: ['TypeScript', '类型系统', '编程技巧'],
  },
  '3': {
    title: '我的程序员工涯感悟',
    category: '随笔',
    date: '2024-01-05',
    content: [
      '从大学时代开始接触编程，到现在已经过去了五年时间。这五年里，我从一个对代码一无所知的新手，成长为能够独立完成项目的开发者。',
      '刚开始学习编程的时候，我觉得非常困难。那些复杂的语法、抽象的概念，让我一度想要放弃。但是当我第一次成功运行自己写的程序时，那种成就感让我坚定了继续学习的决心。',
      '大学期间，我接触了多种编程语言和框架。C 语言让我理解了计算机底层的工作原理，Python 让我感受到了编程的简洁和优雅，Java 则教会了我面向对象的设计思想。',
      '进入职场后，我才发现真正的挑战才刚刚开始。学校里学到的知识只是基础，工作中遇到的问题往往更加复杂和实际。我学会了如何阅读别人的代码，如何与团队成员协作，如何快速学习新技术。',
      '技术更新换代的速度让我感到压力，但也让我保持了学习的动力。我意识到，作为一个程序员，持续学习是必不可少的。这不仅是为了跟上技术发展的步伐，更是为了保持竞争力。',
      '现在回想起来，我庆幸自己选择了这个职业。编程不仅让我掌握了一门技能，更培养了我逻辑思维和解决问题的能力。这些能力无论在未来做什么工作，都会对我有所帮助。',
    ],
    tags: ['职业发展', '人生感悟', '程序员'],
  },
  '4': {
    title: '如何保持高效的学习状态',
    category: '生活',
    date: '2024-01-01',
    content: [
      '在快速变化的技术领域，保持高效的学习状态是非常重要的。作为一个程序员，我每天都在面对新的技术和挑战，如何才能高效地学习呢？',
      '首先，要有明确的学习目标。在开始学习之前，先问问自己：我想学什么？为什么要学它？学会之后能用它做什么？明确的目标能够让我们保持学习的动力和方向。',
      '其次，要选择合适的学习方法。不同的人适合不同的学习方法，有些人喜欢通过阅读文档和书籍学习，有些人则更喜欢通过实际动手来学习。找到适合自己的方法，可以大大提高学习效率。',
      '实践是最好的老师。在学习理论知识的同时，一定要多动手实践。通过编写实际的代码，我们能够更好地理解和掌握所学知识，也能发现自己的不足之处。',
      '保持好奇心和求知欲也很重要。对于新技术和新概念，不要因为陌生就产生恐惧。抱着探索的心态去学习，会发现学习的过程其实很有趣。',
      '最后，要学会总结和分享。将学到的知识整理成笔记或博客，不仅能够加深理解，还能帮助他人。在与他人的交流中，我们也能够获得新的见解和启发。',
    ],
    tags: ['学习方法', '自我提升', '生活技巧'],
  },
  '5': {
    title: '前端性能优化实战指南',
    category: '技术',
    date: '2023-12-28',
    content: [
      '前端性能优化是提升用户体验的关键因素之一。一个快速响应的网站不仅能让用户感到满意，还能提高搜索引擎排名和转化率。本文将介绍一些实用的前端性能优化技巧。',
      '代码分割和懒加载是优化首屏加载时间的重要手段。通过将代码拆分成多个小块，我们可以按需加载资源，减少初始加载时间。Webpack 的动态 import 语法和 Vue 的异步组件是实现代码分割的常用方式。',
      '图片优化也不容忽视。使用现代图片格式如 WebP，可以大幅减少图片体积。同时，通过响应式图片和懒加载技术，我们可以根据设备屏幕尺寸加载合适的图片，进一步提高加载速度。',
      '缓存策略是性能优化的重要环节。合理使用浏览器缓存、CDN 缓存和 Service Worker，可以减少网络请求，提升页面加载速度。对于不经常变化的资源，设置较长的缓存时间可以显著提升性能。',
      '减少重排和重绘也是优化性能的关键。通过使用 CSS transform 和 opacity 来实现动画，可以避免触发重排。使用虚拟 DOM 和批量更新策略，可以减少不必要的 DOM 操作。',
      '最后，要定期进行性能检测和分析。使用 Chrome DevTools 的 Performance 面板和 Lighthouse 工具，可以帮助我们找出性能瓶颈，并有针对性地进行优化。',
    ],
    tags: ['前端开发', '性能优化', 'Web'],
  },
  '6': {
    title: '周末的咖啡时光',
    category: '生活',
    date: '2023-12-25',
    content: [
      '这是一个阳光明媚的周末，我决定给自己放个假，来到城市角落里的一家安静咖啡馆。推开木门，浓郁的咖啡香气扑面而来，让人瞬间放松下来。',
      '点了一杯拿铁，找了一个靠窗的位置坐下。阳光透过玻璃窗洒在桌面上，给整个空间镀上了一层金色的光晕。街道上行人稀少，偶尔有几辆车驶过，打破了午后的宁静。',
      '打开笔记本，开始整理这一周的思绪。工作中遇到的问题、学习到的新知识、生活中的感悟，都被我记录下来。在这样的环境下写作，感觉思路格外清晰。',
      '咖啡馆里放着轻柔的爵士乐，与服务员的低语声、研磨咖啡机的声音交织在一起，形成了一种独特的氛围。我闭上眼睛，享受这难得的宁静时刻。',
      '时间过得很快，不知不觉已经过去了两个小时。喝完最后一口拿铁，我收拾好东西，准备离开。虽然只是短暂的休息，但感觉整个人都焕然一新。',
      '走出咖啡馆，阳光依旧温暖。我深吸一口气，满怀信心地走向新的一周。生活中需要这样的时刻，让我们停下脚步，感受当下的美好。',
    ],
    tags: ['生活', '休闲', '咖啡'],
  },
};

const post = computed(() => {
  return posts[postId] || posts['1'];
});
</script>

<style scoped>
.prose p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}
</style>
