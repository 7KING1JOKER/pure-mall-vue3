# Vue3项目CI/CD流程配置指南

## 1. 文档概述

本文档详细介绍如何为Vue3项目（基于Vite构建）配置CI/CD（持续集成/持续部署）流程，实现代码提交后自动构建、测试和部署的全自动化流程。

## 2. CI/CD概念介绍

### 2.1 持续集成(CI)

持续集成是指开发人员频繁地将代码集成到主干分支，每次集成都会触发自动构建和测试，确保代码质量和兼容性。

### 2.2 持续部署(CD)

持续部署是在持续集成的基础上，将通过测试的代码自动部署到生产环境或预生产环境，实现快速交付。

## 3. 技术选型

### 3.1 CI/CD工具

| 工具 | 优势 | 适用场景 |
|------|------|----------|
| GitHub Actions | 与GitHub深度集成，配置简单，免费额度充足 | 代码托管在GitHub的项目 |
| GitLab CI | 功能强大，与GitLab集成，支持自托管 | 代码托管在GitLab的项目 |
| Jenkins | 高度可定制，插件丰富 | 需要复杂定制化CI/CD流程的项目 |

### 3.2 部署目标

| 平台 | 优势 | 适用场景 |
|------|------|----------|
| GitHub Pages | 免费，与GitHub集成 | 静态网站、文档网站 |
| Vercel | 免费，自动优化，CDN加速 | 前端项目、Next.js项目 |
| Netlify | 免费，自动部署，表单功能 | 静态网站、前端项目 |
| 私有服务器 | 完全控制，自定义配置 | 需要高度定制化的项目 |

## 4. GitHub Actions配置

### 4.1 创建工作流文件

在项目根目录创建`.github/workflows`目录，然后创建CI/CD配置文件，例如`ci-cd.yml`。

```yaml
name: Vue3 CI/CD

# 触发条件：main分支有push或pull_request事件时触发
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

# 工作流任务\ njobs:
  # 构建任务
  build:
    # 运行环境
    runs-on: ubuntu-latest

    steps:
    # 检出代码
    - name: Checkout code
      uses: actions/checkout@v3

    # 设置Node.js环境
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'

    # 安装依赖
    - name: Install dependencies
      run: npm install

    # 运行构建命令
    - name: Build project
      run: npm run build

    # 运行测试（如果有）
    - name: Run tests
      run: npm run test

    # 上传构建产物
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist

  # 部署任务（仅在main分支push时触发）
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
    # 检出代码
    - name: Checkout code
      uses: actions/checkout@v3

    # 下载构建产物
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist

    # 部署到GitHub Pages
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        force_orphan: true
```

### 4.2 配置说明

1. **触发条件**：当main分支有push或pull_request事件时触发工作流
2. **构建任务**：
   - 检出代码
   - 设置Node.js环境
   - 安装依赖
   - 运行构建命令
   - 运行测试（如果项目有测试）
   - 上传构建产物
3. **部署任务**：
   - 依赖构建任务完成
   - 仅在main分支push时触发
   - 下载构建产物
   - 部署到GitHub Pages

### 4.3 环境变量配置

在GitHub仓库的`Settings > Secrets > Actions`中配置以下环境变量：

- `GITHUB_TOKEN`：GitHub自动生成，无需手动配置
- 如果部署到其他平台，可能需要配置额外的环境变量，如`VERCEL_TOKEN`、`NETLIFY_AUTH_TOKEN`等

## 5. GitLab CI配置

### 5.1 创建.gitlab-ci.yml文件

在项目根目录创建`.gitlab-ci.yml`文件：

```yaml
stages:
  - install
  - build
  - test
  - deploy

# 安装依赖
install:
  stage: install
  image: node:18-alpine
  script:
    - npm install
  artifacts:
    paths:
      - node_modules/

# 构建项目
build:
  stage: build
  image: node:18-alpine
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
  dependencies:
    - install

# 运行测试
test:
  stage: test
  image: node:18-alpine
  script:
    - npm run test
  dependencies:
    - install

# 部署到服务器
deploy:
  stage: deploy
  image: node:18-alpine
  script:
    - npm install -g ssh2
    - node deploy.js
  dependencies:
    - build
  only:
    - main
```

### 5.2 部署脚本示例

创建`deploy.js`文件用于部署到私有服务器：

```javascript
const Client = require('ssh2').Client;
const fs = require('fs');
const path = require('path');

const conn = new Client();

// 服务器配置
const config = {
  host: process.env.SERVER_HOST,
  port: process.env.SERVER_PORT || 22,
  username: process.env.SERVER_USER,
  password: process.env.SERVER_PASSWORD
};

conn.on('ready', () => {
  console.log('Connected to server');
  
  // 创建远程目录
  conn.exec('mkdir -p /var/www/vue3-project', (err, stream) => {
    if (err) throw err;
    
    stream.on('close', () => {
      console.log('Remote directory created');
      
      // 上传构建产物
      conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const distPath = path.join(__dirname, 'dist');
        
        // 上传目录函数
        function uploadDir(localPath, remotePath) {
          fs.readdirSync(localPath).forEach(file => {
            const localFile = path.join(localPath, file);
            const remoteFile = `${remotePath}/${file}`;
            
            if (fs.statSync(localFile).isDirectory()) {
              sftp.mkdir(remoteFile, (err) => {
                if (err && err.code !== 4) throw err;
                uploadDir(localFile, remoteFile);
              });
            } else {
              sftp.fastPut(localFile, remoteFile, (err) => {
                if (err) throw err;
                console.log(`Uploaded: ${file}`);
              });
            }
          });
        }
        
        uploadDir(distPath, '/var/www/vue3-project');
        
        // 上传完成后断开连接
        setTimeout(() => {
          conn.end();
          console.log('Deployment completed');
        }, 5000);
      });
    });
  });
}).connect(config);
```

### 5.3 环境变量配置

在GitLab项目的`Settings > CI/CD > Variables`中配置以下环境变量：

- `SERVER_HOST`：服务器IP地址
- `SERVER_PORT`：SSH端口（默认22）
- `SERVER_USER`：服务器用户名
- `SERVER_PASSWORD`：服务器密码

## 6. 部署到其他平台

### 6.1 部署到Vercel

1. 在Vercel官网注册账号
2. 连接GitHub/GitLab仓库
3. 配置构建命令：`npm run build`
4. 配置输出目录：`dist`
5. 点击"Deploy"按钮完成部署

### 6.2 部署到Netlify

1. 在Netlify官网注册账号
2. 连接GitHub/GitLab仓库
3. 配置构建命令：`npm run build`
4. 配置输出目录：`dist`
5. 点击"Deploy site"按钮完成部署

### 6.3 部署到私有服务器

1. 配置服务器环境（安装Node.js、Nginx等）
2. 配置Nginx虚拟主机：

```nginx
server {
    listen 80;
    server_name example.com;
    
    root /var/www/vue3-project;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. 使用SSH上传构建产物到服务器
4. 重启Nginx服务：`sudo systemctl restart nginx`

## 7. 最佳实践

### 7.1 分支管理策略

- 使用main分支作为生产分支
- 使用develop分支作为开发分支
- 使用feature/*分支开发新功能
- 使用bugfix/*分支修复bug
- 使用release/*分支准备发布

### 7.2 代码质量检查

在CI流程中添加代码质量检查：

```yaml
# 代码质量检查
lint:
  stage: test
  image: node:18-alpine
  script:
    - npm run lint
  dependencies:
    - install
```

### 7.3 自动化测试

在CI流程中添加自动化测试：

```yaml
# 单元测试
test:unit:
  stage: test
  image: node:18-alpine
  script:
    - npm run test:unit
  dependencies:
    - install

# E2E测试
test:e2e:
  stage: test
  image: cypress/base:16.13.0
  script:
    - npm run test:e2e
  dependencies:
    - install
```

### 7.4 构建缓存

使用缓存加速构建过程：

```yaml
# GitHub Actions缓存配置
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# GitLab CI缓存配置
cache:
  paths:
    - node_modules/
  key: ${CI_COMMIT_REF_SLUG}-${CI_COMMIT_SHA}
```

## 8. 常见问题与解决方案

### 8.1 构建失败

- **问题**：依赖安装失败
  **解决方案**：检查package.json文件是否正确，尝试删除node_modules和package-lock.json后重新安装

- **问题**：构建命令执行失败
  **解决方案**：检查构建命令是否正确，确保项目可以在本地正常构建

### 8.2 部署失败

- **问题**：权限不足
  **解决方案**：检查服务器登录凭证是否正确，确保有足够的权限访问目标目录

- **问题**：页面访问404
  **解决方案**：检查Nginx配置是否正确，确保root目录指向正确的构建产物目录

### 8.3 性能问题

- **问题**：构建时间过长
  **解决方案**：使用缓存机制，优化构建脚本，考虑使用更强大的构建机器

- **问题**：部署时间过长
  **解决方案**：优化部署脚本，考虑使用增量部署，减少上传文件大小

## 9. 总结

通过配置CI/CD流程，可以实现代码提交后的自动构建、测试和部署，提高开发效率，确保代码质量，实现快速交付。本文档介绍了基于GitHub Actions和GitLab CI的CI/CD配置方案，以及部署到不同平台的方法，希望对您有所帮助。

## 10. 参考资料

- [GitHub Actions官方文档](https://docs.github.com/zh/actions)
- [GitLab CI/CD官方文档](https://docs.gitlab.com/ee/ci/)
- [Vite官方文档](https://vitejs.dev/guide/)
- [Vue3官方文档](https://v3.vuejs.org/guide/introduction.html)