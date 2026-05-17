# 用于代码编译打包好了，也生成镜像了，但是没能成功推送到服务器的情况

# 镜像保存成 tar 包
yarn docker:save

# 上传到服务器
scp xiaxiazheng-next-app.tar root@111.230.47.60:/root/myproject/next-app/xiaxiazheng-next-app.tar

# 推送完删除本地的 tar 包
rm -rf xiaxiazheng-next-app.tar