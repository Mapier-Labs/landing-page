# Mapier Landing Page

Mapier AI驱动的智能导航应用落地页。

## 项目简介

Mapier是一款创新的AI地图导航应用，利用大型语言模型（LLM）技术理解用户意图，提供个性化、智能化的导航体验。

### 核心功能

- **AI理解用户意图**：通过LLM技术理解复杂的自然语言导航需求
- **个性化导航**：根据用户偏好提供定制化路线推荐
- **丰富的POI信息**：整合海量兴趣点数据
- **用户内容上传**：支持用户上传地点信息和评论
- **语音控制**：支持语音指令操作
- **智能路线规划**：综合考虑多维度因素提供最优路线

## 技术栈

- **Next.js 16** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 开发状态

- ✅ MVP阶段：核心功能已基本实现
- 🚧 封闭测试：计划在未来几个月内启动
- 📅 公开测试：基于用户反馈优化后推出

## 团队

- **Jinyi Bruce Li** - 联合创始人 & CEO
- **Homin Luo** - 联合创始人 & CTO
- **Mido Sang** - 首席开发工程师
- **Mark Xiong** - 产品经理
- **Neo Shangguan** - UX/UI 设计师

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看页面。

## 部署

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

或者使用 Vercel CLI：

```bash
npm install -g vercel
vercel
```

## 等待列表API

等待列表提交API位于 `/api/waitlist`，当前实现为基本版本。可以根据需要集成：

- Vercel KV (Redis)
- Airtable
- Google Sheets API
- 自定义数据库

## 许可证

私有项目，保留所有权利。

## 联系方式

- GitHub: [Mapier-AI/Mapier-Landing-Page](https://github.com/Mapier-AI/Mapier-Landing-Page)
