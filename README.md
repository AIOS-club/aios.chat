<div align="center">
  <a href="https://github.com/AIOS-club/lite.aios.chat">
    <img src="src/assets/img/AIOS-LOGO.png" alt="Logo" width="120" height="80">
  </a>

  <h3 align="center">lite aios chat</h3>

  <p align="center">
    和ai对话的lite版网页端
    <br />
    <br />
    <a href="">View Demo</a>
    ·
    <a href="https://github.com/AIOS-club/lite.aios.chat/issues">Report Bug</a>
    ·
    <a href="https://github.com/AIOS-club/lite.aios.chat/issues">Request Feature</a>
  </p>
</div>

> 本项目基于 **MIT** 协议

## Preview
<br />
<img src="src/assets/img/screenshot.png" />
<br />
<br />

## Get Started
```bash
npm run inst # 安装

npm run dev # 运行

npm run dev:env # 运行时自动生成.env.development
```

> 当你运行 npm run dev:env 时会自动在根目录和server目录下生成一个.env.development文件。
> 你需要在server目录下的.env.development填写正确可用的API_KEY。

## 环境变量
请参考 **.env.example** 文件。<br />
```bash
# 输入框的提示词
VITE_DEFAULT_PLACEHOLDER='发消息给AI'

# 输入框底部的消息
VITE_DEFAULT_BOTTOM_TIPS=''

# API_HOST
VITE_API_HOST='http://localhost:3000/aios-chat'

# 最多缓存的对话次数 不包括system信息
VITE_CACHE_TIMES=10

# BASE_URL
VITE_BASE_URL='/' # BASE_URL

# ai avator
VITE_AI_AVATOR_URL=''

# user avator
VITE_USER_USER_URL=''
```


## 已支持的功能
- 上下文对话
- 历史会话
- markdown渲染
- katex数学公式支持
- 可一键分享当前会话
- 流式传输
- 暗夜模式

## TODO
- 预设场景化机器人system应用
- prompt store
- 添加后端BFF层
- 添加http和socks代理配置或提供一些预置的openai接口代理
- 访问权限控制
- 可修改openai的模型（3.5、3.0）可修改接口参数temperature、model、temperature、frequency_penalty、presence_penalty
- 多语言支持
- 一键部署文档
- github action（打包验证，代码规范eslint等）
- GitHub pages自动部署
- docker-compose编写
- 使用自定义API Key

## License

MIT License © [AIOS-club](./LICENSE)