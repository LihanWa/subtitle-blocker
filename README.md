# subtitle-blocker - 字幕遮蔽器（通常可用于英语学习）

可以作为插件使用。可以实现选择遮蔽内容大小，并且按 Q 键可以切换字幕遮蔽的显示/隐藏。

## 方法一：直接使用脚本

把 `content.js` 的内容放到网页的 console 里并运行，缺点是每次网页刷新后都要来一次。

## 方法二：作为插件使用

具体方式如下：

1. 打开 Chrome 浏览器，地址栏输入 `chrome://extensions/`。
2. 右上角开启 **开发者模式** (Developer mode)。
3. 点击左上角的 **加载已解压的扩展程序** (Load unpacked)。
4. 选择本地创建的 `subtitle-blocker` 文件夹（里面包含content.js和manifest.json两个文件）。

## 使用方法

- **Ctrl + B**：进入画框模式，可以拖动鼠标选择要遮蔽的区域
- **Q 键**：切换字幕遮蔽的显示/隐藏

