# Daily Session Saver

![Firefox](https://img.shields.io/badge/Firefox-109%2B-orange?style=flat&logo=firefox)
![Version](https://img.shields.io/amo/v/daily-session-saver?style=flat&label=addons.mozilla.org)
![License](https://img.shields.io/badge/license-GPL--3.0-green?style=flat)

## Overview
Daily Session Saver is a Firefox extension designed to automatically save your browser sessions on a daily basis. It allows you to easily restore previous browsing sessions, providing a convenient way to manage and revisit your daily web activities.

![Ekran görüntüsü 2025-06-09 163446](https://github.com/user-attachments/assets/85f13b65-4a6d-4f96-a788-967fba79937f)

## Features
- **Automated Daily Backups**: Captures all open tabs in your browser each day.
- **User-Friendly Interface**: View a list of saved sessions organized by date in a popup.
- **Easy Restoration**: Click on a specific date to restore that day's session, reopening all tabs active at the time of saving.
- **Local Storage**: Utilizes Firefox's `browser.storage.local` API for secure and persistent storage of session data, available even after browser restarts.

## Use Case
This extension is ideal for users who:
- Work with multiple tabs daily.
- Need a reliable way to recover their browsing context from previous days.
- Want enhanced session management beyond Firefox's built-in capabilities.

## Installation

### From Mozilla Add-ons (recommended)

[![Get the Add-on](https://img.shields.io/badge/Firefox%20Add--ons-Daily%20Session%20Saver-ff7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/daily-session-saver/)

1. Open the [Daily Session Saver page on addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/daily-session-saver/).
2. Click **Add to Firefox** and confirm the prompt.
3. The extension will automatically start saving your daily sessions.

> **Direct file:** [`daily-session-saver-1.1.xpi`](https://github.com/cangurel81/Daily-Session-Saver/releases/latest/download/daily-session-saver-1.1.xpi) — the unsigned build attached to the release. Firefox only loads it temporarily (`about:debugging` → **Load Temporary Add-on…** → pick the `.xpi`); a permanent install has to come from addons.mozilla.org.

### From source (temporary / development)

1. Clone or download this repository.
2. Open `about:debugging#/runtime/this-firefox` in Firefox.
3. Click **Load Temporary Add-on…** and select `manifest.json`.
4. The extension loads immediately — note that temporary add-ons are removed when Firefox restarts.

> This repository tracks the published **v1.1** build: same code and the same `browser_specific_settings.gecko.id`, so loading it from source behaves like the store version.

## Usage
- **Saving Sessions**: The extension automatically saves all open tabs daily.
- **Viewing Sessions**: Open the extension popup from the Firefox toolbar to see a list of saved sessions by date.
- **Restoring Sessions**: Click on a date in the popup to restore all tabs from that day's session.

## Technical Details
- **Storage**: Session data is stored locally using Firefox's `browser.storage.local` API.
- **Privacy**: All data is kept on your device, ensuring security and privacy.
- **Future Enhancements**: Cloud sync for cross-device access is under consideration for future releases.

## Contributing
Contributions are welcome! To contribute:
1. Fork this repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

## 🇹🇷 Türkçe

**Daily Session Saver**, Firefox oturumlarınızı her gün otomatik olarak yedekleyen bir eklentidir.
O gün açık olan tüm sekmeler kaydedilir; popup'tan tarih seçip o günün oturumunu tek tıkla geri
yükleyebilirsiniz.

- **Kurulum (önerilen):** [addons.mozilla.org — Daily Session Saver](https://addons.mozilla.org/en-US/firefox/addon/daily-session-saver/) → **Add to Firefox**.
- **Doğrudan dosya:** [`.xpi` sürümü](https://github.com/cangurel81/Daily-Session-Saver/releases/latest/download/daily-session-saver-1.1.xpi) — imzasız derleme; Firefox yalnızca geçici yükler (`about:debugging`).
- **Kaynaktan yükleme:** `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → `manifest.json`.
  Geçici eklentiler Firefox kapanınca silinir.
- **Depo sürümü:** Mağazadaki **v1.1** ile aynı kod ve aynı `gecko.id` — kaynaktan yüklediğinizde mağaza sürümü gibi davranır.
- **Gizlilik:** Tüm veri `browser.storage.local` içinde, kendi cihazınızda kalır. Hiçbir veri dışarı gönderilmez.
- **Lisans:** GPL-3.0.
