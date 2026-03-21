## Madness Unlimited — Chrome Extension For March Madness Live 

Watch every game of the NCAA March Madness tournament without hitting the free preview limit. One click resets your access so you never miss a buzzer beater.

## Usage
 
Click the 🏀 icon in your Chrome toolbar to open the panel, then hit **Reset Free Access**. The button will flash green when your access has been reset. Head back to [March Madness Live](https://www.ncaa.com/march-madness-live) and enjoy.
 
## How It Works
 
The extension uses Chrome's `cookies` API to clear all cookies associated with `ncaa.com`. March Madness Live uses cookies to track your free preview usage — clearing them resets the counter.

## Permissions
 
- `cookies` — required to read and remove NCAA.com cookies
- `*://*.ncaa.com/*` — host permission scoped only to NCAA domains
