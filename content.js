(() => {
    // build the UI
    const container = document.createElement("div");
    container.id = "mu-container";
    container.innerHTML = `
        <div id="mu-tab">
            <img id="mu-tab-icon" src="${chrome.runtime.getURL("icons/icon128-transparent.png")}" width="40" height="40" />
        </div>
        <div id="mu-panel">
            <div class="panel-body">
                <div class="panel-title">Madness<br/>Unlimited</div>
                <div class="panel-sub">Refresh the page after your access is reset</div>
                <button id="mu-reset">Reset Free Access</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const tab = document.getElementById("mu-tab");
    const resetBtn = document.getElementById("mu-reset");

    // open / close panel
    let isOpen = false;

    function toggle() {
        isOpen = !isOpen;
        container.classList.toggle("open", isOpen);
    }

    tab.addEventListener("click", () => {
        if (!wasDragged) toggle();
    });

    // drag to reposition vertically
    let isDragging = false;
    let wasDragged = false;
    let dragStartY = 0;
    let containerStartTop = 0;

    const savedY = localStorage.getItem("mu-pos-y");
    container.style.top = savedY ? savedY + "px" : "30%";

    tab.addEventListener("mousedown", (e) => {
        isDragging = true;
        wasDragged = false;
        dragStartY = e.clientY;
        containerStartTop = container.getBoundingClientRect().top;
        document.body.style.cursor = "grabbing";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dy = e.clientY - dragStartY;
        if (Math.abs(dy) > 4) wasDragged = true;
        const newTop = Math.max(0, Math.min(window.innerHeight - 120, containerStartTop + dy));
        container.style.top = newTop + "px";
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = "";
            localStorage.setItem("mu-pos-y", parseInt(container.style.top));
            setTimeout(() => {
                wasDragged = false;
            }, 0);
        }
    });

    // reset button — sends message to background service worker
    resetBtn.addEventListener("click", async () => {
        resetBtn.disabled = true;
        resetBtn.textContent = "Resetting...";

        try {
            const response = await chrome.runtime.sendMessage({ action: "clearCookies" });
            resetBtn.textContent = "Free Access Reset ✓";
            resetBtn.classList.add("success");
        } catch (err) {
            resetBtn.textContent = "Error — Try Again";
            resetBtn.classList.add("error");
        } finally {
            setTimeout(() => {
                resetBtn.disabled = false;
                resetBtn.textContent = "Reset Free Access";
                resetBtn.classList.remove("success", "error");
            }, 2500);
        }
    });
})();
