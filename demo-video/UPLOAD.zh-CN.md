# YouTube 非公开视频上传步骤

本指南用于把本地生成的视频上传到 YouTube，并拿到可填入 DoraHacks 的链接。

## 1. 准备文件

本地视频文件：

```text
C:\Users\三雨林\Desktop\codex2\croo-buidl-readiness-reviewer\demo-video\buidl-readiness-demo.avi
```

封面图：

```text
C:\Users\三雨林\Desktop\codex2\croo-buidl-readiness-reviewer\demo-video\youtube-cover.png
```

字幕文件：

```text
C:\Users\三雨林\Desktop\codex2\croo-buidl-readiness-reviewer\demo-video\subtitles.srt
```

`.avi` 是 YouTube 支持的视频格式之一。官方帮助页也说明上传时可以在 YouTube Studio 选择视频文件、填写标题和简介、设置可见性。

参考：

- YouTube upload help: https://support.google.com/youtube/answer/57407
- Supported formats: https://support.google.com/youtube/troubleshooter/2888402

## 2. 打开上传页面

1. 打开 https://studio.youtube.com
2. 登录你的 Google/YouTube 账号。
3. 右上角点击 `CREATE` / `创建`。
4. 选择 `Upload videos` / `上传视频`。
5. 选择本地视频文件 `buidl-readiness-demo.avi`。

如果 YouTube 要求创建频道、手机验证或二次验证，请按页面提示自己完成。不要把账号密码或验证码发给任何人。

## 3. 填标题和简介

标题：

```text
BUIDL Readiness Reviewer - CROO Agent Hackathon Demo
```

简介复制 `demo-video/youtube-metadata.md` 里的 Description。

核心 GitHub 链接一定要保留：

```text
https://github.com/sanyulin/croo-buidl-readiness-reviewer
```

## 4. 上传封面和字幕

封面选择：

```text
demo-video/youtube-cover.png
```

字幕选择：

```text
demo-video/subtitles.srt
```

语言选 `English`。

## 5. 设置可见性

在 Visibility / 可见性页面选择：

```text
Unlisted
```

不要选 `Private`，因为 DoraHacks 评委打不开 Private 视频。

保存后复制 YouTube 链接。

## 6. 上传后验证

1. 用无痕窗口打开复制出来的链接。
2. 确认不用登录也能看到视频。
3. 确认视频时长小于 5 分钟。
4. 把该链接填到 DoraHacks BUIDL 的 Demo Video 字段。

当前视频是保守版：只展示本地可运行项目和 CROO Provider 模板，不声称已经完成真实 CAP 上链结算。等 CROO Dashboard 的 Provider Online 和 Requester 调用成功后，可以再补录最终版。

