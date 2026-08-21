# Room Monster Battle

A static, installable PWA that turns a shared-bedroom cleanup into a cooperative battle against a silly monster. It uses vanilla HTML/CSS/JavaScript, IndexedDB, Web Crypto, speech synthesis and a service worker. No accounts, analytics, advertising, remote APIs, CDNs, package manager or cloud database are used.

## Local use
Run `python3 -m http.server 8000 --directory room-monster-battle` from the parent directory, then open `http://localhost:8000/`. Do not double-click `index.html`, because service workers and ES modules require an HTTP(S) origin.

## GitHub Pages
Upload the project contents so `index.html` is at the repository root. In Settings → Pages, deploy the `main` branch from `/ (root)`. All application paths are relative so a project subdirectory works. `_headers` is included for compatible hosts but GitHub Pages does not apply it.

## iPad
Open the HTTPS site in Safari once while online, complete parent setup, start a short battle to activate audio, then Share → Add to Home Screen. After the first complete online load, the application shell is cached for offline use. Avoid Private Browsing for normal family use.

## Data and backups
Family settings, PIN verifier, current battle and history live in IndexedDB on the device. Parent → Data exports a versioned JSON backup. Export before updates and periodically thereafter. Changing domain/repository path changes the browser origin/context and can affect access to stored data.

## Security
The four-digit PIN is never stored directly. PBKDF2-SHA-256 with a random 16-byte salt and 160,000 iterations is used through Web Crypto. Five unsuccessful attempts cause a 30-second lockout. Dynamic user text is rendered with DOM text APIs.

## English / Spanish language switch

Room Monster Battle supports English and Spanish without an internet translation service. Tap **ES** in the top-right header to switch from English to Spanish; when Spanish is active the button shows **EN** to switch back. Parents can also choose the interface language during first-run setup or under **Parent → Settings**. The preference is saved in IndexedDB and survives reloads, Home Screen launches, and offline use. The factory missions include authored Spanish titles, instructions, and safety notes. Custom family text falls back to the wording entered by the parent when no translated version is stored.
