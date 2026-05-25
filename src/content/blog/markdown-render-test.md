---
title: Markdown 渲染测试
description: 用一篇文章检查高亮、上下标、代码块、表格、脚注等 Markdown 元素的显示效果。
pubDate: 2026-05-25
category: 测试
tags:
  - Markdown
  - 测试
draft: true
---

这是一篇用于检查 Markdown 渲染效果的测试文章。这里包含 ==高亮文本==、**加粗文本**、*斜体文本*、~~删除线文本~~、`行内代码`，以及上下标：水的化学式是 H~2~O，面积单位可以写成 m^2^。

## 段落与链接

普通段落应该有舒服的行高和间距。文字不应该太挤，也不应该松散到读不下去。

这里有一个外部链接：[Astro 官方网站](https://astro.build/)，也有一个站内链接：[关于 Hex Notes](/about/)。

## 引用

> 好的引用块应该安静地从正文里分出来。
> 它不需要太夸张，但要让读者一眼知道这是被强调或摘出的内容。

## 列表

无序列表：

- 支持普通项目。
- 支持 `行内代码`。
- 支持 ==高亮== 和 H~2~O 这样的扩展语法。

有序列表：

1. 先写下问题。
2. 再记录尝试。
3. 最后留下可以复查的结论。

任务列表：

- [x] 高亮
- [x] 上标
- [x] 下标
- [ ] 继续观察移动端效果

## 表格

| 元素 | 写法 | 期望效果 |
| --- | --- | --- |
| 高亮 | `==文本==` | ==文本== |
| 下标 | `H~2~O` | H~2~O |
| 上标 | `m^2^` | m^2^ |
| 删除线 | `~~文本~~` | ~~文本~~ |

## 代码块

```ts
type Note = {
  title: string;
  published: boolean;
};

const note: Note = {
  title: 'Markdown 渲染测试',
  published: true,
};

console.log(note.title);
```

```abap
REPORT zhex_notes_demo.

TYPES: BEGIN OF ty_note,
         id        TYPE i,
         title     TYPE string,
         published TYPE abap_bool,
       END OF ty_note.

DATA lt_notes TYPE STANDARD TABLE OF ty_note WITH EMPTY KEY.

lt_notes = VALUE #(
  ( id = 1 title = 'Markdown Render Test' published = abap_true )
  ( id = 2 title = 'ABAP Syntax Highlight' published = abap_false )
).

LOOP AT lt_notes INTO DATA(ls_note) WHERE published = abap_true.
  WRITE: / |#{ ls_note-id } { ls_note-title }|.
ENDLOOP.

CLASS lcl_note_counter DEFINITION FINAL.
  PUBLIC SECTION.
    CLASS-METHODS count_published
      IMPORTING it_notes TYPE STANDARD TABLE OF ty_note
      RETURNING VALUE(rv_count) TYPE i.
ENDCLASS.

CLASS lcl_note_counter IMPLEMENTATION.
  METHOD count_published.
    rv_count = REDUCE i(
      INIT total = 0
      FOR note IN it_notes
      WHERE ( published = abap_true )
      NEXT total = total + 1
    ).
  ENDMETHOD.
ENDCLASS.
```

## 图片

![一张测试图片](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80)

图片点击后应该可以打开大图预览。

## 脚注

这里有一个脚注引用。[^note]

[^note]: 这是脚注内容。点击正文里的脚注标记后，页面应该平滑滚动到这里，并且不会把位置顶到浏览器最上方。

## 分割线

---

最后一段用于观察文章收尾的间距。读到这里时，页面不应该显得拥挤，也不应该出现奇怪的横向滚动条。
