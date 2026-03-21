(() => {
    const container = document.getElementById("mu-container");
    const tab = document.getElementById("mu-tab");
    const resetBtn = document.getElementById("mu-reset");
    const status = document.getElementById("mu-status");

    // mock for local preview
    const isMock = typeof chrome === "undefined" || !chrome.cookies;

    // open / close popup
    let isOpen = false;

    function toggle() {
        isOpen = !isOpen;
        container.classList.toggle("open", isOpen);
    }

    tab.addEventListener("click", (e) => {
        // only toggle if not dragging
        if (!wasDragged) toggle();
    });

    // drag to reposition vertically
    let isDragging = false;
    let wasDragged = false;
    let dragStartY = 0;
    let containerStartTop = 0;

    // initialize position
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
            // reset wasDragged after a tick so click handler can check it
            setTimeout(() => {
                wasDragged = false;
            }, 0);
        }
    });

    // reset button
    async function clearCookies() {
        if (isMock) {
            // simulate a delay and fake result for local preview
            await new Promise((r) => setTimeout(r, 800));
            return { total: 14, domains: { ".ncaa.com": 14 } };
        }

        const result = { total: 0, domains: {} };
        const cookies = await chrome.cookies.getAll({ domain: "ncaa.com" });
        for (const cookie of cookies) {
            const protocol = cookie.secure ? "https" : "http";
            const url = `${protocol}://${cookie.domain.replace(/^\./, "")}${cookie.path}`;
            await chrome.cookies.remove({ url, name: cookie.name });
            result.total++;
            result.domains[cookie.domain] = (result.domains[cookie.domain] || 0) + 1;
        }
        return result;
    }

    resetBtn.addEventListener("click", async () => {
        resetBtn.disabled = true;
        resetBtn.textContent = "Resetting...";

        try {
            await clearCookies();
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
