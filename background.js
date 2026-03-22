chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === "clearCookies") {
        chrome.cookies.getAll({ domain: ".ncaa.com" }, (cookies) => {
            let count = 0;
            const total = cookies.length;
            if (total === 0) return sendResponse({ total: 0 });

            cookies.forEach((cookie) => {
                const protocol = cookie.secure ? "https" : "http";
                const url = `${protocol}://${cookie.domain.replace(/^\./, "")}${cookie.path}`;
                chrome.cookies.remove({ url, name: cookie.name }, () => {
                    count++;
                    if (count === total) sendResponse({ total });
                });
            });
        });
        return true;
    }
});
