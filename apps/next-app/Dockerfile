# 使用 node 镜像
FROM node:20-alpine

WORKDIR /app

# 复制 next-app package.json 并安装依赖（移除 workspace:* 依赖，Next.js 构建时已打包）
COPY package.json ./
RUN sed -i 's/"@xiaxiazheng\/blog-libs": "workspace:\*",//g' package.json && \
    npm install --omit=dev --ignore-scripts

# 复制 .next 和 next.config.ts（包含 basePath: "/m" 配置）
COPY .next/ ./.next/
COPY next.config.ts ./

EXPOSE 3000

CMD ["npm", "run", "start"]