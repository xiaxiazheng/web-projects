# blog-libs

## 定位

复用 reactblog 和 next-app 两个项目里能共用的组件和逻辑。

## 本地开发

### 最笨的
快捷引入项目的方式，有改动都是直接发版，然后手动改 next-app 和 reactblog 项目的依赖版本，然后调试的。这个之后再搞，先跑通先。

### 新的开发方式
1. 第一次使用本项目用 yarn init, 也就是跑 yalc publish，注册库到本地“链接”
2. 在目标项目（用这个库的项目）用 yalc add @xiaxiazheng/blog-libs，用来“链接”库到 node_modules(原理是复制)
3. 需要开发时，运行 yarn watch，也就是 rslib 的 watch，监听本地文件变化并重新打包
4. 开发完需要看效果，运行手动 yarn patch，将本地库的修改推送到目标项目，目标项目的文件变化 watch 就能重新编译了

### 废弃的开发方式（别用）
1. 本项目用 npm link 或者 yarn link
2. 目标项目（用这个库的项目）用 npm link @xiaxiazheng/blog-libs 或者 yarn link @xiaxiazheng/blog-libs
3. 本项目跑 yarn watch，就可以动态修改了

## 发布
直接跑 `yarn publish` 就行，就能直接发布了，然后输入一个新的版本。
会发现有报错，不要管，其实已经发上去的。报错的貌似是发到 yarn 的库里所以报错了，但 npm 是已经发到了的。
如果本地没有登录 npm，就用 `npm adduser` 登录一下就好了，用户名就是 xiaxiazheng，密码是大写的那个。

## 其他
这个库在 npm 的地址是：
<https://www.npmjs.com/package/@xiaxiazheng/blog-libs>
