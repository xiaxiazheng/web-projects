# 装载推送到服务器的包
yarn docker:load

# 装载完删掉这个包
rm -rf xiaxiazheng-next-app.tar

# 停止容器
docker stop next-app

# 删除容器
docker rm next-app

# 生成新容器
docker run -d --name next-app -p 3000:3000 xiaxiazheng/nextapp