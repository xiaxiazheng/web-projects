# 使用 node 镜像
FROM node:20-alpine

# 准备工作目录
WORKDIR /app

# 复制文件
COPY package*.json yarn.lock next.config.ts /app/
COPY .next/ /app/.next
COPY node_modules/ /app/node_modules

# 安装依赖
# RUN yarn config set strict-ssl false && yarn --prod

EXPOSE  3000

# 启动服务
CMD ["yarn", "start"]