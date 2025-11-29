
(function () {
    'use strict';

    // 1. 清理旧的实例，防止重复运行
    if (window.__subtitle_tool_cleanup__) {
        window.__subtitle_tool_cleanup__();
    }

    let finalBar = null; // 最终的黑条
    let isDrawing = false; // 是否正在画图

    // 获取当前应该把黑条贴在哪里的函数（关键：全屏兼容）
    function getMountNode() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.body;
    }

    // --- 核心监听器 (使用 Capture 模式，拥有最高优先级) ---
    function handleKey(e) {
        // 1. 唤醒画图模式：Ctrl + B
        if (e.ctrlKey && e.code === "KeyB") {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件传给播放器
            startDrawingMode();
        }

        // 2. 开关显示：Q 键 (仅当黑条存在时生效)
        if (e.code === "KeyQ" && finalBar) {
            // 避免在输入框打字时误触
            if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

            e.stopPropagation();
            const isHidden = finalBar.style.display === "none";
            finalBar.style.display = isHidden ? "block" : "none";

            // 确保全屏切换时，黑条依然能保持在最顶层
            if (isHidden) {
                const mount = getMountNode();
                if (finalBar.parentNode !== mount) {
                    mount.appendChild(finalBar);
                }
            }
        }
    }

    document.addEventListener("keydown", handleKey, true);

    // --- 画图模式逻辑 ---
    function startDrawingMode() {
        if (isDrawing) return;
        isDrawing = true;

        const mountNode = getMountNode();

        // 创建全屏透明遮罩
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 2147483647; cursor: crosshair; background: rgba(0,0,0,0.1);
        `;
        mountNode.appendChild(overlay);

        let startX, startY, tempBox;

        function onMouseDown(e) {
            startX = e.clientX;
            startY = e.clientY;

            if (finalBar) finalBar.remove();

            tempBox = document.createElement("div");
            tempBox.style.cssText = `
                position: fixed; border: 2px solid red; background: rgba(255, 0, 0, 0.3);
                left: ${startX}px; top: ${startY}px; z-index: 2147483647; pointer-events: none;
            `;
            mountNode.appendChild(tempBox);

            window.addEventListener("mousemove", onMouseMove, true);
            window.addEventListener("mouseup", onMouseUp, true);
        }

        function onMouseMove(e) {
            if (!tempBox) return;
            const currentX = e.clientX;
            const currentY = e.clientY;

            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            const left = Math.min(startX, currentX);
            const top = Math.min(startY, currentY);

            tempBox.style.width = width + "px";
            tempBox.style.height = height + "px";
            tempBox.style.left = left + "px";
            tempBox.style.top = top + "px";
        }

        function onMouseUp() {
            window.removeEventListener("mousemove", onMouseMove, true);
            window.removeEventListener("mouseup", onMouseUp, true);
            overlay.removeEventListener("mousedown", onMouseDown, true);

            overlay.remove();
            isDrawing = false;

            if (tempBox) {
                finalBar = tempBox;
                finalBar.style.border = "none";
                finalBar.style.background = "black";
                finalBar.style.opacity = "1.0";
                finalBar.style.pointerEvents = "none";
                console.log("✅ 遮挡条已生成");
            }
        }

        overlay.addEventListener("mousedown", onMouseDown, true);
    }

    // 清理函数
    window.__subtitle_tool_cleanup__ = function() {
        document.removeEventListener("keydown", handleKey, true);
        if(finalBar) finalBar.remove();
    };
})();