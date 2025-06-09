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

browser.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "daily_session_save") {
    saveCurrentSession();
  }
});

// Listen for messages from the popup to restore sessions
browser.runtime.onMessage.addListener((message) => {
  if (message.command === "restore_session") {
    restoreSession(message.date);
  } else if (message.command === "get_saved_sessions") {
    return browser.storage.local.get(SESSION_STORAGE_KEY).then(result => {
      return Promise.resolve(result[SESSION_STORAGE_KEY] || {});
    });
  }
});

// Save session on browser startup (optional)
saveCurrentSession();