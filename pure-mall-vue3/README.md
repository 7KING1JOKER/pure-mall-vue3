# Pure Mall Vue3

## 项目简介

Pure Mall Vue3是一个基于Vue 3 + TypeScript + Spring Boot开发的前后端分离电商商城系统。该系统采用现代化的技术栈，具有良好的可扩展性和可维护性，适用于中小型电商平台的开发和部署。

## 技术栈

### 前端技术栈
- **框架**: Vue 3.5.18
- **语言**: TypeScript 5.8.3
- **构建工具**: Vite 7.1.0
- **状态管理**: Pinia 3.0.3
- **路由管理**: Vue Router 4.5.1
- **HTTP请求**: Axios 1.12.1
- **UI组件库**: 
  - Element Plus 2.12.0 (桌面端)
- **样式**: Sass 1.90.0
- **工具库**: 
  - SortableJS 1.15.6 (拖拽排序)
  - AMap JSAPI Loader 1.0.1 (地图API)

### 后端技术栈
- **框架**: Spring Boot
- **数据库**: MySQL
- **ORM**: MyBatis/MyBatis Plus
- **认证**: JWT
- **授权**: Spring Security
- **链接**: 
  - [项目仓库](https://github.com/7KING1JOKER/pure-mall-vue3-api)
## 项目结构

```
e:/vue-project/pure-mall-vue3/pure-mall-vue3/
├── .env                    # 环境变量配置
├── .gitignore              # Git忽略文件
├── README.md               # 项目说明文档
├── 说明文档.md              # 详细开发文档
├── auto-imports.d.ts       # 自动导入类型声明
├── components.d.ts         # 组件类型声明
├── index.html              # HTML入口文件
├── package.json            # 项目依赖配置
├── public/                 # 静态资源目录
├── src/                    # 源代码目录
│   ├── App.vue             # 根组件
│   ├── api/                # API请求相关
│   │   ├── interfaces.ts   # 接口类型定义
│   │   ├── productDatabase.js  # 产品数据模拟
│   │   └── request.js      # Axios封装
│   ├── assets/             # 静态资源
│   ├── components/         # 通用组件
│   │   ├── Carousel.vue    # 轮播图组件
│   │   ├── ImageCard.vue   # 图片卡片组件
│   │   └── ProductCard.vue # 产品卡片组件
│   ├── layouts/            # 布局组件
│   │   ├── AddressDialog.vue   # 地址对话框
│   │   ├── CardSteps.vue       # 卡片式步骤条
│   │   ├── CategoryNavDialog.vue # 分类导航对话框
│   │   ├── EditProfileDialog.vue # 编辑个人信息对话框
│   │   ├── Footer.vue          # 页脚组件
│   │   ├── Loading.vue         # 加载组件
│   │   ├── LoginDialog.vue     # 登录对话框
│   │   ├── PcMenu.vue          # 桌面端菜单
│   │   ├── ProductDetailsDialog.vue # 产品详情对话框
│   │   ├── ProductSizeDialog.vue # 产品尺寸对话框
│   │   └── RegisterDialog.vue # 注册对话框
│   ├── main.ts             # 入口文件
│   ├── pages/              # 页面组件
│   │   ├── Cart.vue        # 购物车页面
│   │   ├── Category.vue    # 分类页面
│   │   ├── Checkout.vue    # 结算页面
│   │   ├── Home.vue        # 首页
│   │   ├── OrderComplete.vue # 订单完成页面
│   │   ├── OrderDetail.vue # 订单详情页面
│   │   ├── Payment.vue     # 支付页面
│   │   ├── ProductDetail.vue # 产品详情页面
│   │   └── User.vue        # 用户中心页面
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由定义
│   ├── store/              # 状态管理
│   │   ├── cart.ts         # 购物车状态
│   │   ├── category.ts     # 分类状态
│   │   ├── order.ts        # 订单状态
│   │   ├── product.ts      # 产品状态
│   │   └── user.ts         # 用户状态
│   ├── styles/             # 样式文件
│   ├── utils/              # 工具函数
│   │   └── HorizontalScroll.js # 水平滚动工具
│   └── vite-env.d.ts       # Vite环境类型声明
├── tsconfig.app.json       # TypeScript应用配置
├── tsconfig.json           # TypeScript基础配置
├── tsconfig.node.json      # TypeScript Node配置
└── vite.config.ts          # Vite配置
```

## 安装和运行

### 环境要求
- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/7KING1JOKER/pure-mall-vue3.git
   cd pure-mall-vue3
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   创建 `.env` 文件，配置后端接口地址等环境变量：
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **运行开发服务器**
   ```bash
   npm run dev
   ```
   项目将在 `http://localhost:5173` 启动

5. **构建生产版本**
   ```bash
   npm run build
   ```
   构建结果将输出到 `dist` 目录

6. **预览生产版本**
   ```bash
   npm run preview
   ```

## 功能模块

### 用户管理
- 用户注册
- 用户登录
- 个人信息管理
- 地址管理

### 商品管理
- 商品分类
- 商品列表
- 商品详情
- 商品搜索

### 购物车
- 添加商品到购物车
- 修改购物车商品数量
- 删除购物车商品
- 购物车结算

### 订单管理
- 创建订单
- 订单支付
- 订单列表
- 订单详情

### 收藏夹
- 添加商品到收藏夹
- 查看收藏夹
- 取消收藏

### 未完善功能
- 支付功能未完善，仅模拟支付过程
- 数据库数据不完善，product.brief 和 product.detail 字段为默认值
- 移动端样式未完善，仅有基础样式

## 开发规范

### 代码规范
- 使用 TypeScript 进行开发，严格类型检查
- 组件命名使用 PascalCase
- 变量和函数命名使用 camelCase
- 常量命名使用 UPPER_SNAKE_CASE
- 代码缩进使用 2 个空格
- 每行代码不超过 120 个字符

### 提交规范
- 提交信息格式：`类型: 描述`
- 类型包括：
  - feat：新功能
  - fix：修复 bug
  - docs：文档更新
  - style：代码风格
  - refactor：代码重构
  - test：测试
  - chore：构建工具

### 接口规范
- 所有 API 请求统一使用 Axios 封装
- 接口地址配置在 .env 文件中
- 请求和响应数据要有明确的类型定义
- 错误处理要统一，提供友好的错误提示

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

项目负责人：[7KING1JOKER]
负责人邮箱：[3290086504@qq.com]

## 致谢

感谢所有为该项目做出贡献的开发者！
