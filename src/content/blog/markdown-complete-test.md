---
title: Markdown 元素完整测试
description: 用于检查标题、列表、表格、代码、图片、链接和脚注的样式。
pubDate: 2026-05-22
category: 技术
tags:
  - Markdown
  - 测试
  - 排版
featured: false
---

# 一级标题

这是段落文本。**粗体** 和 *斜体* 以及 ***粗斜体***。

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

---

## 列表

### 无序列表

- 第一项
- 第二项
  - 子项目 A
  - 子项目 B
    - 深層子項目
- 第三项

### 有序列表

1. 步骤一
2. 步骤二
   1. 子步骤 2.1
   2. 子步骤 2.2
3. 步骤三

### 任务列表

- [x] 已完成的任务
- [ ] 未完成的任务
- [x] 另一个已完成

---

## 表格

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格1 | 单元格2 | 单元格3 |
| 对齐左 | 居中 | 对齐右 |
| 内容A | 内容B | 内容C |

| 功能 | 支持情况 | 备注 |
|------|---------|------|
| 粗体 | ✅ | 使用 `**` |
| 斜体 | ✅ | 使用 `*` |
| 代码 | ✅ | 使用 `` ` `` |

---

## 代码块

### 行内代码

这是 `行内代码` 示例。

### 块级代码（无语言）

```
这是一个普通的代码块
没有指定语言
```

### 块级代码（指定语言）

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

const result = greet('World');
```

### Python 示例

```python
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 生成前10个斐波那契数
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

### Shell 示例

```bash
#!/bin/bash
echo "Hello World"
ls -la
```

### JSON 示例

```json
{
  "name": "Hex Notes",
  "version": "1.0.0",
  "features": [
    "Markdown 支持",
    "代码高亮",
    "响应式设计"
  ]
}
```

---

## 引用

> 这是一段引用文字。
> 可以有多行。

> **提示：** 这是一个重要的提示引用。

> 多级引用：
> > 第一层
> > > 第二层
> > > > 第三层

---

## 链接

### 普通链接

[百度](https://www.baidu.com)

[GitHub](https://github.com)

### 带标题的链接

[访问我的博客](https://example.com "点击访问")

### 参考式链接

这是 [链接一][ref1] 和 [链接二][ref2]。

[ref1]: https://example.com/first
[ref2]: https://example.com/second

---

## 图片

### 普通图片

![替代文本](/placeholder-1.jpg)

### 带标题的图片

![风景图片](/placeholder-2.jpg "美丽的风景")

---

## 脚注

这是一个包含脚注的句子。[^1]

[^1]: 这是脚注的内容。

另一个使用脚注的句子。[^note]

[^note]: 这是另一个脚注的定义。

---

## 水平线

---

***

* * *

---

## 其他格式

### 删除线

~~这是删除线文本~~

### 高亮

==这是高亮文本==

### 上标下标

上标: 2^10^ = 1024

下标: H~2~O

---

## 复杂嵌套

### 列表中的代码

- 项目一
  ```javascript
  const x = 10;
  console.log(x);
  ```
- 项目二
  ```python
  def hello():
      print("Hello")
  ```

### 表格中的代码

| 语言 | 示例 |
|------|------|
| JavaScript | `const x = 1;` |
| Python | `x = 1` |

### 引用中的列表

> - 列表项 A
> - 列表项 B
>   1. 有序子项
>   2. 有序子项

---

## 结论

以上就是 Markdown 的主要元素测试。如果所有元素都正常显示，说明渲染引擎工作正常。

- [x] 标题
- [x] 段落
- [x] 列表
- [x] 表格
- [x] 代码块
- [x] 引用
- [x] 链接
- [x] 图片
- [x] 脚注
- [x] 水平线