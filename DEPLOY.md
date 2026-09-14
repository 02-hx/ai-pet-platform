# 它伴 TaBan - 部署脚本

## 🚀 部署到公网

> 当前项目是静态原型。所有数据保存在访客自己的浏览器中，GitHub Pages 不会提供用户登录、数据库、多人同步或真实 AI 接口。

### 方法一：Netlify（推荐，最简单）
1. 访问 https://app.netlify.com/drop
2. 将整个 `public-website` 文件夹拖拽到网页中
3. 等待上传完成（约2-3分钟）
4. 获得访问地址：https://xxxxx.netlify.app

### 方法二：GitHub Pages
1. 创建GitHub仓库
2. 将 public-website 文件夹中的所有文件上传到仓库根目录
3. 推送到 `main` 分支后，仓库内的 GitHub Actions 会自动发布 Pages
4. 访问：`https://02-hx.github.io/ai-pet-platform/`

### 方法三：Vercel
1. 访问 https://vercel.com/import
2. 选择 public-website 文件夹
3. 自动构建完成
4. 获得访问地址：https://your-project.vercel.app

## 📋 部署检查清单

- [ ] 所有HTML文件已复制
- [ ] JavaScript文件已复制
- [ ] CSS文件已复制
- [ ] robots.txt已创建
- [ ] 404页面已创建
- [ ] README.md已创建

## 🎯 部署后验证

### 页面访问测试
- [ ] 主入口页面正常
- [ ] 品牌首页正常
- [ ] AI陪伴功能正常
- [ ] 健康管理功能正常
- [ ] 社区互动功能正常

### 移动端测试
- [ ] 手机访问正常
- [ ] 平板访问正常
- [ ] 响应式布局正常

### 可选：配置 sitemap

当前 `sitemap.xml` 已使用最终 GitHub Pages 地址：
`https://02-hx.github.io/ai-pet-platform/...`

---

🎉 部署完成！评委可以访问您的公网网站了！
