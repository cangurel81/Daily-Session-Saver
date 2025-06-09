// popup.js

document.addEventListener('DOMContentLoaded', async () => {
  const sessionList = document.getElementById('session-list');

  // Request saved sessions from background script
  const savedSessions = await browser.runtime.sendMessage({ command: "get_saved_sessions" });

  if (Object.keys(savedSessions).length === 0) {
    sessionList.innerHTML = '<p>No sessions saved yet.</p>';
    return;
  }

  // Display sessions in reverse chronological order
  const sortedDates = Object.keys(savedSessions).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(date => {
    const sessionItem = document.createElement('div');
    sessionItem.classList.add('session-item');
    sessionItem.textContent = `Session from ${date}`;
    sessionItem.dataset.date = date;
    sessionItem.addEventListener('click', async () => {
      await browser.runtime.sendMessage({ command: "restore_session", date: date });
      window.close(); // Close popup after restoring
    });
    sessionList.appendChild(sessionItem);
  });
});