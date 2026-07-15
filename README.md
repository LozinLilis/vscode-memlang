# Mem Lang — VS Code 扩展

MemLang 的 Visual Studio Code 语言支持扩展，提供 `.mem` 文件的语法高亮、智能补全、代码片段和专用文件图标主题。

## 功能

- **语法高亮**：支持 `.mem` 文件的核心语法着色
  - 包括 `@where` / `@topics` / `@text` / `@overlap` / `@ties` 等区块
- **智能补全**：根据上下文提供字段和值补全
  - `@where` 内：`room` / `scope` / `state` / `purpose` / `owner` / `speaker` / `authority`
  - `authority` 使用浮点权重，例如 `0.5`、`0.75`、`1.0`
  - `@topics` 内：已使用过的标签补全
  - `@ties` 内：EID 索引补全
- **代码片段**：输入 `@mem` 快速创建标准记忆模板
- **编辑辅助**：
  - `{}` 块级折叠
  - 括号匹配
  - 注释高亮
- **文件图标主题**：在 VS Code 内为 `.mem` 文件提供专用图标

## 安装

### 从 Visual Studio Marketplace 安装

打开 VS Code，在扩展市场中搜索：

```text
Mem Lang
```

扩展标识：

```text
LozinLilis.mem-lang
```

### 从 VSIX 手动安装

下载或构建 `.vsix` 文件后，在 VS Code 中安装：

1. 打开扩展面板。
2. 点击右上角 `...` 菜单。
3. 选择 **Install from VSIX...**。
4. 选择生成的 `mem-lang-*.vsix` 文件。

## 启用 `.mem` 文件图标

本扩展内置了一个 VS Code 文件图标主题：

```text
MemLang Icons
```

启用方式：

1. 打开命令面板。
2. 执行 **Preferences: File Icon Theme**。
3. 选择 **MemLang Icons**。

启用后，VS Code 内的 `.mem` 文件会显示 MemLang 专用图标。

> 注意：这个图标只影响 VS Code 内部的文件显示，不会修改 Windows 文件管理器、macOS Finder 或 Linux 文件管理器中的系统级文件图标。

## 开发

```bash
git clone https://github.com/LozinLilis/vscode-memlang
cd vscode-memlang
vsce package
```

常用命令：

```bash
vsce package          # 构建 VSIX 包
vsce publish          # 发布到 Marketplace，需要 PAT
```

## 仓库

```text
https://github.com/LozinLilis/vscode-memlang
```

## 许可证

MIT
