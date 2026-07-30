# 输入、列表与表格

## Selection and input 映射

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Autocomplete | 输入时筛选并选择大量建议 | Composition：`s-search-field` + 当前 option/menu/select 能力；无直接一对一 |
| Checkbox | 零个、一个或多个独立选择，也可表达同意 | Direct：`s-checkbox`；同意文案必须说明内容 |
| Choice list | 一组 radio/checkbox 选择 | Direct：`s-choice-list` + `s-choice` |
| Color picker | 视觉或数值选择颜色 | Direct：`s-color-picker` + `s-color-field` |
| Combobox | 可访问的筛选输入与 option list | Composition；按当前 search/select/menu 合同实现，不移植旧 ARIA |
| Date picker | 日历选择日期/范围 | Direct：`s-date-picker`，结合 `s-date-field` 与业务时区 |
| Drop zone | 拖放或按钮选择文件 | Direct：`s-drop-zone`；补格式、大小、进度、失败和删除 |
| Filters | 列表/表格过滤组合 | Current Index pattern；按资源和查询模型组合控件 |
| Form | 提交表单的语义包装 | Native `<form>` + Remix/React Router action；字段用当前组件 |
| Index filters | 查询、排序、保存视图的索引控制 | Current Index composition/Pattern，不复制旧复合组件 API |
| Inline error | 字段或字段组的就地错误 | 使用当前字段 `error` 合同；页面级问题再用 `s-banner` |
| Radio button | 一组互斥选择 | `s-choice-list` + `s-choice` 的单选语义 |
| Range slider | 在连续范围内选数值 | 无直接当前标签；优先数字字段/预设，确需 slider 时自定义并完整测试 |
| Select | 从四个以上选项选一个 | Direct：`s-select` + `s-option`/`s-option-group` |
| Tag | 商家提供的分类关键词 | Current：`s-chip`/`s-clickable-chip`；区分标签值与状态 badge |
| Text field | 单行文本及数字等格式 | Direct family：`s-text-field`、`s-email-field`、`s-url-field`、`s-number-field`、`s-money-field`、`s-password-field`、`s-search-field` |

## 字段合同

每个字段都需要：持久 label、当前 value、必要 help、验证时机、字段错误、是否 required、autocomplete/input mode、本地化格式和禁用原因。Placeholder 不能承担 label 或唯一格式说明。

### 验证

- 能在输入时安全判断的问题可以就地验证，但不要每个字符都报错。
- 提交后把焦点移到错误摘要或第一个错误字段，并保留商家输入。
- 客户端验证改善体验，服务器仍必须验证权限、业务规则和并发状态。
- 错误文本说明怎样改，不使用 `invalid value`。
- 异步唯一性/连接验证显示 checking、success、failure，并防止旧请求覆盖新值。

### 选择控件

- Checkbox 表示独立开关或多选；radio/choice list 表示必须从同组中选一个。
- Select 适合紧凑的已知选项；需要比较长描述时直接展示 choice list。
- 只有两个状态且立即生效时可使用 `s-switch`；需要保存或有复杂后果时用 checkbox/choice + save flow。
- 选择数量大时采用搜索、排序、分页或官方 resource picker，不把数百项塞进 select。

## Lists 映射

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Action list | Popover 中的命令/可选项 | `s-menu`/`s-option` 组合或当前 App Bridge menu；按动作语义分组 |
| Description list | 名称和值、术语和定义配对 | Native `<dl>` 或 `s-grid`/`s-stack` 组合 |
| List | 有序或无序文字列表 | Direct：`s-ordered-list` / `s-unordered-list` + `s-list-item` |
| Listbox | 带图标/描述的交互 option 列表 | Current select/menu/composition；无通用直接替代 |
| Option list | 单选或多选的独立菜单列表 | `s-select`、`s-menu` 或 composition，按是否表单输入决定 |
| Resource item | 一个资源的识别、状态与动作 | Current Index table/row 或资源 composition |
| Resource list | 同类资源集合与选择 | Current Index Pattern + `s-table` family；小集合可用 list composition |

### 列表原则

- 列表项语法和信息结构一致；识别字段始终在同一位置。
- 选中、active、hover 和 focus 是不同状态。
- 行点击进入详情时，行内按钮不能意外触发导航。
- 行级动作保持触摸可达；仅 hover 显示不能成为移动端唯一入口。
- 空列表、过滤无结果和分页末尾分别表达。

## Tables 映射

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Data table | 展示数据集并支持精确比较 | Direct family：`s-table`、header/body/row/cell；保留真实 table 语义 |
| Index table | 管理同类资源、选择与批量动作 | Current Index Pattern + `s-table` family；实现筛选、选择和导航合同 |

### 表格原则

- 每列标题描述数据含义和单位；数字按小数/位数对齐。
- 默认排序和可排序列必须可发现，排序状态可被辅助技术读取。
- 复选框选择与行导航是独立目标。
- 横向溢出只作为最后手段；窄屏优先降列、重组或切换资源行布局。
- 大数据集使用服务器分页/游标、稳定排序和可恢复筛选。
- Skeleton 行数和列宽接近真实内容，避免加载后大幅位移。

## 文件上传

`s-drop-zone` 只解决选取入口，完整流程还包括：允许类型与大小、单/多文件、上传进度、取消、重试、病毒/内容处理状态、失败原因、已上传预览、替代文本以及删除。不要在文件实际失败时显示成功缩略图。

## 日期与货币

存储格式、API 格式和展示格式分离。日期明确 date-only 或 timestamp；timestamp 明确时区。货币输入保留 currency 上下文和 minor unit 规则。不能用字符串截取代替本地化与业务验证。
