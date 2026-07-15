# MemLang — VS Code Extension

MemLang 语法高亮、智能补全与代码片段支持。

## 功能

- **语法高亮**：`.mem` 文件的完整语法着色（`@where` / `@topics` / `@text` / `@overlap` / `@ties`）
- **智能补全**：上下文感知的字段键值补全
  - `@where` 内：`room` / `scope` / `state` / `purpose` / `owner` / `speaker` / `authority`
  - `@topics` 内：已用标签补全
  - `@ties` 内：EID 索引补全
- **代码片段**：`mem` 快速创建记忆模板（7 字段 `@where` + `@text` + `@topics` + `@ties`）
- **折叠与括号匹配**：`{}` 块级折叠、注释高亮

## 安装

### 从 Marketplace 安装

打开 VS Code，搜索 `Mem Lang` 安装。

### 手动安装

```bash
git clone https://github.com/LozinLilis/vscode-memlang
cd vscode-memlang
vsce package
```

然后从 `.vsix` 文件安装。

## 开发

```bash
vsce package          # 打包
vsce publish          # 发布到市场（需 PAT）
```

## 许可证

MIT
