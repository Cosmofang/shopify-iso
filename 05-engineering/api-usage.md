# API 使用 Admin API

> 用 **GraphQL Admin API**(REST 已弃)。按「一段时间内的成本」而非「请求数」思考。
> 官方:https://shopify.dev/docs/api/usage/limits

---

## 速率限制（计算成本 + 漏桶）

- 成本按返回类型计:Scalar/Enum=0、Object=1、Connection 按 `first/last`、**Mutation=10**。
- **漏桶**:按套餐恢复速率回补(Standard 100、Advanced 200、Plus 1000 点/秒);桶满即 throttle。
- **单查询 ≤ 1000 点**(与套餐无关);**输入数组 ≤ 250**;**分页 ≤ 25000 对象**。
- 成本/节流状态在响应 `extensions` 里;加头 `Shopify-GraphQL-Cost-Debug=1` 看逐字段成本。

## API 版本

- 保持**当前 API 版本**(`shopify.app.toml` 的 `api_version`,如 `2026-07`);季度更新,别用过期版本。
- 用 **GraphQL codegen**(`@shopify/api-codegen-preset` + `.graphqlrc.ts`)生成类型化查询。

---

## ✅ Do
- 大数据量用 **bulk operations**(无成本上限/速率限制)。
- 只取需要的字段;高频数据缓存。
- 捕获 throttle 错误并**退避(建议等 1 秒)**;读响应元数据动态调节。
- 加过滤让用户先缩小结果,再深分页。

## ❌ Don't
- ❌ 忽略错误一直重试(无法优雅恢复)。
- ❌ 分页超 25000 / 输入数组超 250。
- ❌ 假设限额恒定(Shopify 可能临时降额保平台)。
- ❌ 还在用 REST 写新功能。

## 自检
- [ ] 新代码走 GraphQL,非 REST。
- [ ] 有 throttle 退避逻辑。
- [ ] 大批量用 bulk operations。
- [ ] `api_version` 为当前季度版本。
