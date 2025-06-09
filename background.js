// background.js

const SESSION_STORAGE_KEY = "daily_sessions";

// Function to save the current session
async function saveCurrentSession() {
  const tabs = await browser.tabs.query({});
  const session = tabs.map(tab => ({ url: tab.url, title: tab.title }));

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let allSessions = await browser.storage.local.get(SESSION_STORAGE_KEY);
  allSessions = allSessions[SESSION_STORAGE_KEY] || {};

  allSessions[today] = session;

  await browser.storage.local.set({ [SESSION_STORAGE_KEY]: allSessions });
  console.log(`Session for ${today} saved.`);
}

// Function to restore a session by date
async function restoreSession(date) {
  let allSessions = await browser.storage.local.get(SESSION_STORAGE_KEY);
  allSessions = allSessions[SESSION_STORAGE_KEY] || {};

  const sessionToRestore = allSessions[date];
  if (sessionToRestore) {
    // Close all current tabs except the active one (optional, for a cleaner restore)
    const currentTabs = await browser.tabs.query({ currentWindow: true });
    for (const tab of currentTabs) {
      if (!tab.active) {
        await browser.tabs.remove(tab.id);
      }
    }

    // Open tabs from the saved session
    for (const tab of sessionToRestore) {
      await browser.tabs.create({ url: tab.url });
    }
    console.log(`Session for ${date} restored.`);
  } else {
    console.log(`No session found for ${date}.`);
  }
}

// Set up an alarm to save the session daily (e.g., at midnight)
browser.alarms.create("daily_session_save", {
  when: Date.now() + (24 * 60 * 60 * 1000), // First run after 24 hours
  periodInMinutes: 24 * 60 // Repeat every 24 hours
});

// Set up an alarm for auto-saving (e.g., every 15 minutes)
async function setupAutoSaveAlarm() {
  const savedAutoSave = await browser.storage.local.get('autoSave');
  if (savedAutoSave.autoSave) {
    browser.alarms.create("auto_save_session", {
      periodInMinutes: 15 // Auto-save every 15 minutes
    });
  } else {
    browser.alarms.clear("auto_save_session");
  }
}

browser.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "daily_session_save") {
    saveCurrentSession();
  } else if (alarm.name === "auto_save_session") {
    saveCurrentSession();
  }
});

// Listen for messages from the popup to restore sessions
browser.runtime.onMessage.addListener((message) => {
  if (message.command === "restore_session") {
    restoreSession(message.date);
  } else if (message.command === "save_session") {
    return saveCurrentSession();
  } else if (message.command === "get_saved_sessions") {
    return browser.storage.local.get(SESSION_STORAGE_KEY).then(result => {
      return Promise.resolve(result[SESSION_STORAGE_KEY] || {});
    });
  } else if (message.command === "delete_session") {
    return browser.storage.local.get(SESSION_STORAGE_KEY).then(async (result) => {
      let allSessions = result[SESSION_STORAGE_KEY] || {};
      delete allSessions[message.date];
      await browser.storage.local.set({ [SESSION_STORAGE_KEY]: allSessions });
      return Promise.resolve({ success: true });
    });
  } else if (message.command === "get_all_sessions") {
      return browser.storage.local.get(SESSION_STORAGE_KEY).then(result => {
        return Promise.resolve(result[SESSION_STORAGE_KEY] || {});
      });
    } else if (message.command === "import_sessions") {
      return browser.storage.local.get(SESSION_STORAGE_KEY).then(async (result) => {
        let allSessions = result[SESSION_STORAGE_KEY] || {};
        const importedData = message.data;
        // Merge imported data with existing data
        Object.assign(allSessions, importedData);
        await browser.storage.local.set({ [SESSION_STORAGE_KEY]: allSessions });
        return Promise.resolve({ success: true });
      });
    } else if (message.command === "toggle_auto_save") {
      if (message.enabled) {
        browser.alarms.create("auto_save_session", {
          periodInMinutes: 15
        });
      } else {
        browser.alarms.clear("auto_save_session");
      }
      return Promise.resolve({ success: true });
    }
});

// Save session on browser startup (optional)
saveCurrentSession();
setupAutoSaveAlarm();