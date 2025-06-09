# Daily Session Saver

## Overview
Daily Session Saver is a Firefox extension designed to automatically save your browser sessions on a daily basis. It allows you to easily restore previous browsing sessions, providing a convenient way to manage and revisit your daily web activities.

![Ekran görüntüsü 2025-06-09 095552](https://github.com/user-attachments/assets/052f0bfd-f14d-4397-b78c-2cf60db6f143)

## Features
- **Automated Daily Backups**: Captures all open tabs in your browser each day.
- **User-Friendly Interface**: View a list of saved sessions organized by date in a popup.
- **Easy Restoration**: Click on a specific date to restore that day's session, reopening all tabs active at the time of saving.
- **Local Storage**: Utilizes Firefox's `browser.storage.local` API for secure and persistent storage of session data, available even after browser restarts.
- **Future Potential**: Plans for cloud synchronization to enable cross-device access.

## Use Case
This extension is ideal for users who:
- Work with multiple tabs daily.
- Need a reliable way to recover their browsing context from previous days.
- Want enhanced session management beyond Firefox's built-in capabilities.

## Installation
1. Download the extension from the Firefox Add-ons store (link to be added).
2. Click "Add to Firefox" and follow the prompts to install.
3. The extension will automatically start saving your daily sessions.

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
