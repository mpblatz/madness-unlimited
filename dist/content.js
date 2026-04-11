"use strict";
(() => {
    // ── Load font ─────────────────────────────────────────────────────
    const fontUrl = chrome.runtime.getURL("fonts/united-italic.otf");
    const fontStyle = document.createElement("style");
    fontStyle.textContent = `
        @font-face {
            font-family: "United Italic";
            src: url("${fontUrl}") format("opentype");
            font-weight: 700;
            font-style: italic;
        }
    `;
    document.head.appendChild(fontStyle);
    // ── Build UI ──────────────────────────────────────────────────────
    const container = document.createElement("div");
    container.id = "mu-container";
    container.innerHTML = `
        <div id="mu-tab">
            <img id="mu-tab-icon" src="${chrome.runtime.getURL("icons/icon128-transparent.png")}" width="32" height="32" />
        </div>
        <div id="mu-panel">
            <div class="panel-body">
                <div class="panel-title">Madness Unlimited</div>
                <div class="panel-sub">Refresh the page after resetting</div>
                <button id="mu-reset">Reset Free Access</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);
    const tab = document.getElementById("mu-tab");
    const resetBtn = document.getElementById("mu-reset");
    // ── Panel toggle ──────────────────────────────────────────────────
    let isOpen = false;
    function toggle() {
        isOpen = !isOpen;
        container.classList.toggle("open", isOpen);
    }
    tab.addEventListener("click", () => {
        if (!wasDragged)
            toggle();
    });
    // ── Drag to reposition ────────────────────────────────────────────
    let isDragging = false;
    let wasDragged = false;
    let dragStartY = 0;
    let containerStartTop = 0;
    const savedY = localStorage.getItem("mu-pos-y");
    container.style.top = savedY ? `${savedY}px` : "30%";
    tab.addEventListener("mousedown", (e) => {
        isDragging = true;
        wasDragged = false;
        dragStartY = e.clientY;
        containerStartTop = container.getBoundingClientRect().top;
        document.body.style.cursor = "grabbing";
        e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
        if (!isDragging)
            return;
        const dy = e.clientY - dragStartY;
        if (Math.abs(dy) > 4)
            wasDragged = true;
        const newTop = Math.max(0, Math.min(window.innerHeight - 120, containerStartTop + dy));
        container.style.top = `${newTop}px`;
    });
    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = "";
            localStorage.setItem("mu-pos-y", String(parseInt(container.style.top)));
            setTimeout(() => {
                wasDragged = false;
            }, 0);
        }
    });
    // ── Reset button ──────────────────────────────────────────────────
    resetBtn.addEventListener("click", async () => {
        resetBtn.disabled = true;
        resetBtn.textContent = "Resetting...";
        try {
            await chrome.runtime.sendMessage({ action: "clearCookies" });
            resetBtn.textContent = "Access Reset";
            resetBtn.classList.add("success");
        }
        catch {
            resetBtn.textContent = "Error — Try Again";
            resetBtn.classList.add("error");
        }
        finally {
            setTimeout(() => {
                resetBtn.disabled = false;
                resetBtn.textContent = "Reset Free Access";
                resetBtn.classList.remove("success", "error");
            }, 2500);
        }
    });
})();
