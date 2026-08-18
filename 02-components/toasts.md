# 轻提示 Toast

> Toast 是短暂、非阻断的 task alert，主要确认商家刚完成的操作。它不是 BFS 错误信息的替代品。

## 当前 App Bridge 写法

```js
shopify.toast.show('Changes saved');
```

官方 Alerts 指南要求 toast 文案尽量 **3 个词或更少**，只表达当下相关的非关键成功结果，例如 `Message sent`、`Image deleted`。

## 使用规则

- 用户发起的保存、复制、删除或发送成功后，用 toast 立即确认。
- Toast 不需要商家输入即可消失，不承载必须阅读、必须操作或长期有效的信息。
- 错误优先放在出错字段、列表项、section 或页面范围内，并保持到解决。
- 仅持久连接错误等特殊情况可考虑 error toast；它仍不能成为 BFS 4.2.4 的唯一错误证据。
- 延迟、持续或包含 CTA 的成功反馈用 success banner。

## Don't

- 不在页面加载时用 toast 做欢迎、促销或 onboarding。
- 不把字段校验、上传失败或订阅故障只放进会自动消失的 toast。
- 不堆叠多条 toast，不写长句，不放与当前操作无关的信息。
- 不因 `isError` 可用就把所有失败都实现成 error toast。

## BFS 与 ISO 验证

- BFS 4.2.4 明确拒绝定时自动消失的错误信息；错误必须持久、红色且就近。
- BFS 4.3.3 禁止加载、延时或无关操作触发干扰性提示。
- ISO 检查 toast 是否由直接操作触发、是否简短、是否只承担非关键成功确认。

需要持续或可操作的反馈见 [banners.md](banners.md)，字段错误见 [forms-fields.md](forms-fields.md)。
