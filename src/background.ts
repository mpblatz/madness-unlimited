interface ClearCookiesMessage {
    action: "clearCookies";
}

interface ClearCookiesResponse {
    total: number;
}

type Message = ClearCookiesMessage;

chrome.runtime.onMessage.addListener(
    (msg: Message, _sender: chrome.runtime.MessageSender, sendResponse: (response: ClearCookiesResponse) => void) => {
        if (msg.action === "clearCookies") {
            chrome.cookies.getAll({ domain: ".ncaa.com" }, (cookies) => {
                let count = 0;
                const total = cookies.length;

                if (total === 0) {
                    sendResponse({ total: 0 });
                    return;
                }

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
    }
);
