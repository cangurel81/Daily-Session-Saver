// popup.js

  document.addEventListener('DOMContentLoaded', async () => {
    const sessionList = document.getElementById('session-list');
    const openTabsCount = document.getElementById('open-tabs-count');
    const themeSwitch = document.getElementById('theme-switch');
    const autoSaveSwitch = document.getElementById('auto-save-switch');

    // Load saved theme preference
    const savedTheme = await browser.storage.local.get('theme');
    if (savedTheme.theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeSwitch.checked = true;
    }

    // Toggle theme on switch change
    themeSwitch.addEventListener('change', () => {
      if (themeSwitch.checked) {
        document.body.classList.add('dark-mode');
        browser.storage.local.set({ theme: 'dark' });
      } else {
        document.body.classList.remove('dark-mode');
        browser.storage.local.set({ theme: 'light' });
      }
    });

    // Load saved auto-save preference, default to true
    const savedAutoSave = await browser.storage.local.get({ autoSave: true });
    autoSaveSwitch.checked = savedAutoSave.autoSave;

    // Initial message to background script for auto-save state
    browser.runtime.sendMessage({ command: "toggle_auto_save", enabled: autoSaveSwitch.checked });

    // Toggle auto-save on switch change
    autoSaveSwitch.addEventListener('change', () => {
      browser.storage.local.set({ autoSave: autoSaveSwitch.checked });
      browser.runtime.sendMessage({ command: "toggle_auto_save", enabled: autoSaveSwitch.checked });
    });

    // Display open tab count
    const tabs = await browser.tabs.query({ currentWindow: true });
    openTabsCount.textContent = `Open Tabs: ${tabs.length}`;

    // Export functionality
    const exportButton = document.getElementById('export-button');
    exportButton.addEventListener('click', async () => {
      const allSessions = await browser.runtime.sendMessage({ command: "get_all_sessions" });
      const dataStr = JSON.stringify(allSessions, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'daily_sessions.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Import functionality
    const importButton = document.getElementById('import-button');
    const importFileInput = document.getElementById('import-file-input');

    importButton.addEventListener('click', () => {
      importFileInput.click(); // Trigger the hidden file input
    });

    importFileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            await browser.runtime.sendMessage({ command: "import_sessions", data: importedData });
            alert('Sessions imported successfully! Please refresh the popup.');
            window.close();
          } catch (error) {
            alert('Error importing sessions: Invalid JSON file.');
            console.error('Import error:', error);
          }
        };
        reader.readAsText(file);
      }
    });

    // Delete selected sessions functionality
    const deleteSelectedSessionsButton = document.getElementById('delete-selected-sessions-button');
    deleteSelectedSessionsButton.addEventListener('click', async () => {
      const selectedCheckboxes = document.querySelectorAll('.session-checkbox:checked');
      const datesToDelete = Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.date);

      if (datesToDelete.length > 0) {
        if (confirm(`Are you sure you want to delete ${datesToDelete.length} sessions?`)) {
          for (const date of datesToDelete) {
            await browser.runtime.sendMessage({ command: "delete_session", date: date });
          }
          loadAndDisplaySessions(); // Reload sessions after deletion
        }
      } else {
        alert('Please select at least one session to delete.');
      }
    });

    loadAndDisplaySessions(); // Initial load of sessions

    // Save current session functionality
    const saveCurrentSessionButton = document.getElementById('save-current-session-button');
    saveCurrentSessionButton.addEventListener('click', async () => {
      const tabs = await browser.tabs.query({ currentWindow: true });
      const tabUrls = tabs.map(tab => tab.url);
      await browser.runtime.sendMessage({ command: "save_session", urls: tabUrls });
      loadAndDisplaySessions(); // Reload sessions after saving
      window.close(); // Close popup after saving
    });
  });

  async function loadAndDisplaySessions() {
    const sessionList = document.getElementById('session-list');
    sessionList.innerHTML = ''; // Clear existing list

    const savedSessions = await browser.runtime.sendMessage({ command: "get_saved_sessions" });

    if (Object.keys(savedSessions).length === 0) {
      sessionList.innerHTML = '<p>No sessions saved yet.</p>';
      return;
    }

    const sortedDates = Object.keys(savedSessions).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(date => {
      const sessionItem = document.createElement('div');
      sessionItem.classList.add('session-item');
      sessionItem.innerHTML = `
        <input type="checkbox" class="session-checkbox" data-date="${date}">
        <h3>${date}</h3>
        <p>${savedSessions[date].length} tabs</p>
      `;
      sessionItem.addEventListener('click', (event) => {
        if (event.target.classList.contains('session-checkbox')) {
          event.stopPropagation(); // Prevent session restore when checkbox is clicked
        } else {
          browser.runtime.sendMessage({ command: "restore_session", date: date });
          window.close(); // Close popup after sending message
        }
      });
      sessionList.appendChild(sessionItem);
    });
  }