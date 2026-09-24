# KOOBONE 漫画键盘翻页

为 KOOBONE 网页漫画阅读器提供左右方向键翻页功能的 Tampermonkey/Greasemonkey 用户脚本。

## 功能

- 在漫画阅读页面按 `ArrowLeft` 翻到上一页。
- 按 `ArrowRight` 翻到下一页。
- 编辑输入框、组合键和已取消的键盘事件不会被拦截。
- 不依赖框架或第三方运行时。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或兼容的用户脚本管理器。
2. 新建用户脚本。
3. 将 [`koobone-comic.user.js`](./koobone-comic.user.js) 的完整内容粘贴进去并保存。
4. 登录 KOOBONE，打开一本漫画后使用左右方向键翻页。

脚本只匹配 `https://koobone.com/wpage.htm*` 阅读 iframe，不会作用于书库页面。

## 本地验证

需要 Node.js：

```bash
npm run check
npm test
```

## 许可证

[MIT License](./LICENSE)
