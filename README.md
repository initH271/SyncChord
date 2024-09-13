This is a [Next.js](https://nextjs.org/) project bootstrapped with [
`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
# node >= 20
corepack enable pnpm

cd workdirectory

corepack use pnpm@latest

pnpm i

# then run the server
pnpm dlx convex dev

# and run the web
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and
load Inter, a custom Google Font.

## Todo Task List

- [ ] 微信登录
- [ ] 频道页面
- [ ] 消息编辑组件
- [ ] 表情选择组件
- [ ] 图片选择上传
- [ ] 消息列表和API
- [ ] 成员面板
- [ ] 对话搜索