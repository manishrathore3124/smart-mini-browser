const urlBar = document.getElementById('urlBar');
const goBtn = document.getElementById('goBtn');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const bookmarkList = document.getElementById('bookmarkList');
const historyList = document.getElementById('historyList');
const newTabBtn = document.getElementById('newTabBtn');
const tabBar = document.querySelector('.tab-bar');
const mainContent = document.querySelector('.main-content');
const sidebarBtn = document.getElementById('sidebarBtn');
const sidebar = document.getElementById('sidebar');

let tabCount = 0;
let activeTabId = null;
const tabs = {};

// --- Tab System ---
function createTab(url = 'file:///C:/Users/Win11%20Pro/smart-mini-browser/search.html') {
  tabCount++;
  const tabId = 'tab-' + tabCount;

  // Webview banao
  const webview = document.createElement('webview');
  webview.src = url;
  webview.style.cssText = 'flex:1; border:none; height:100%; display:none;';
  webview.setAttribute('allowpopups', '');
  mainContent.insertBefore(webview, sidebar);

  // Tab button banao
  const tab = document.createElement('div');
  tab.classList.add('tab');
  tab.dataset.tabId = tabId;

  const tabTitle = document.createElement('span');
  tabTitle.textContent = 'New Tab';

  const closeBtn = document.createElement('span');
  closeBtn.textContent = ' ✕';
  closeBtn.style.cssText = 'margin-left:8px; color:#aaa; font-size:11px; cursor:pointer;';
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  tab.appendChild(tabTitle);
  tab.appendChild(closeBtn);
  tab.onclick = () => switchTab(tabId);
  tabBar.insertBefore(tab, newTabBtn);

  // Tab data store karo
  tabs[tabId] = { webview, tab, tabTitle };

  // Webview events
  webview.addEventListener('did-navigate', (e) => {
    if (activeTabId === tabId) urlBar.value = e.url;
    saveHistory(e.url);
  });

  webview.addEventListener('page-title-updated', (e) => {
    tabTitle.textContent = e.title.substring(0, 20);
  });

  switchTab(tabId);
  return tabId;
}

function switchTab(tabId) {
  // Sab webviews hide karo
  Object.keys(tabs).forEach(id => {
    tabs[id].webview.style.display = 'none';
    tabs[id].tab.classList.remove('active');
  });

  // Active tab show karo
  tabs[tabId].webview.style.display = 'flex';
  tabs[tabId].tab.classList.add('active');
  activeTabId = tabId;
  urlBar.value = tabs[tabId].webview.src || '';
}

function closeTab(tabId) {
  if (Object.keys(tabs).length === 1) return; // Last tab mat hatao

  tabs[tabId].webview.remove();
  tabs[tabId].tab.remove();
  delete tabs[tabId];

  // Koi aur tab active karo
  const remainingIds = Object.keys(tabs);
  if (remainingIds.length > 0) switchTab(remainingIds[remainingIds.length - 1]);
}

// --- Navigation ---
function navigate(url) {
  url = url.trim();
  if (!url) return;
  // Agar search.html hai toh seedha load karo
  if (url === 'search.html') {
    if (activeTabId) tabs[activeTabId].webview.loadFile('search.html');
    return;
  }
  const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
  const isDomain = /^[\w-]+\.[a-z]{2,}/.test(url);
  let finalUrl;
  if (hasProtocol) {
    finalUrl = url;
  } else if (isDomain) {
    finalUrl = 'https://' + url;
  } else {
    finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(url);
  }
  if (activeTabId) tabs[activeTabId].webview.src = finalUrl;
}

goBtn.addEventListener('click', () => navigate(urlBar.value));
urlBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') navigate(urlBar.value);
});

backBtn.addEventListener('click', () => {
  if (activeTabId) tabs[activeTabId].webview.goBack();
});
forwardBtn.addEventListener('click', () => {
  if (activeTabId) tabs[activeTabId].webview.goForward();
});
reloadBtn.addEventListener('click', () => {
  if (activeTabId) tabs[activeTabId].webview.reload();
});

newTabBtn.addEventListener('click', () => createTab());

// --- Bookmarks ---
bookmarkBtn.addEventListener('click', async () => {
  const url = urlBar.value;
  if (!url) return;
  await window.electronAPI.saveBookmark({ url, title: url });
  loadBookmarks();
  alert('Bookmark saved! ⭐');
});

async function loadBookmarks() {
  const bookmarks = await window.electronAPI.getBookmarks();
  bookmarkList.innerHTML = '';
  bookmarks.forEach(b => {
    const li = document.createElement('li');

    const urlSpan = document.createElement('span');
    urlSpan.textContent = b.url;
    urlSpan.onclick = () => navigate(b.url);
    urlSpan.style.flex = '1';
    urlSpan.style.cursor = 'pointer';

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.style.cssText = 'background:none; border:none; cursor:pointer; font-size:14px; color:#ff6b6b;';
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      await window.electronAPI.deleteBookmark(b.url);
      loadBookmarks();
    };

    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';
    li.appendChild(urlSpan);
    li.appendChild(delBtn);
    bookmarkList.appendChild(li);
  });
}

// --- History ---
async function saveHistory(url) {
  await window.electronAPI.saveHistory({ url, time: new Date().toLocaleString() });
  loadHistory();
}

async function loadHistory() {
  const history = await window.electronAPI.getHistory();
  historyList.innerHTML = '';

  // Clear All button
  if (history.length > 0) {
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '🗑️ Clear All History';
    clearBtn.style.cssText = 'width:100%; padding:6px; background:#ff6b6b; color:#fff; border:none; border-radius:6px; cursor:pointer; margin-bottom:8px;';
    clearBtn.onclick = async () => {
      await window.electronAPI.clearHistory();
      loadHistory();
    };
    historyList.appendChild(clearBtn);
  }

  history.slice().reverse().forEach(h => {
    const li = document.createElement('li');

    const textSpan = document.createElement('span');
    textSpan.textContent = `${h.time} — ${h.url}`;
    textSpan.onclick = () => navigate(h.url);
    textSpan.style.flex = '1';
    textSpan.style.cursor = 'pointer';

    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';
    li.appendChild(textSpan);
    historyList.appendChild(li);
  });
}

// --- Dark Mode ---
let isDark = true;
darkModeBtn.addEventListener('click', () => {
  isDark = !isDark;
  if (isDark) {
    document.body.classList.remove('light');
    darkModeBtn.textContent = '🌙 Dark';
    if (activeTabId) {
      tabs[activeTabId].webview.executeJavaScript(`window.postMessage('dark', '*')`);
    }
  } else {
    document.body.classList.add('light');
    darkModeBtn.textContent = '☀️ Light';
    if (activeTabId) {
      tabs[activeTabId].webview.executeJavaScript(`window.postMessage('light', '*')`);
    }
  }
});
// --- Sidebar Toggle ---
sidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// --- Sidebar Panel Switch ---
function showPanel(name) {
  document.getElementById('bookmarksPanel').style.display = name === 'bookmarks' ? 'block' : 'none';
  document.getElementById('historyPanel').style.display = name === 'history' ? 'block' : 'none';
}

// --- Init ---
// Pehla tab delete karo jo HTML mein tha
document.getElementById('tab1')?.remove();
document.getElementById('browser')?.remove();

createTab();
loadBookmarks();
loadHistory();

// --- Voice Command ---
const voiceBtn = document.getElementById('voiceBtn');

// --- Voice Command ---
voiceBtn.addEventListener('click', () => {
  window.electronAPI.openVoice();
});

window.electronAPI.onVoiceCommand((command) => {
  console.log('Voice:', command);
  if (command.includes('new tab')) {
    createTab();
  } else if (command.includes('go back') || command.includes('back')) {
    if (activeTabId) tabs[activeTabId].webview.goBack();
  } else if (command.includes('go forward') || command.includes('forward')) {
    if (activeTabId) tabs[activeTabId].webview.goForward();
  } else if (command.includes('reload') || command.includes('refresh')) {
    if (activeTabId) tabs[activeTabId].webview.reload();
  } else if (command.includes('bookmark')) {
    bookmarkBtn.click();
  } else if (command.includes('open')) {
    const site = command.replace('open', '').trim();
    navigate(site);
  } else if (command.includes('scroll down')) {
    if (activeTabId) tabs[activeTabId].webview.executeJavaScript('window.scrollBy(0, window.innerHeight)');
  } else if (command.includes('scroll up')) {
    if (activeTabId) tabs[activeTabId].webview.executeJavaScript('window.scrollBy(0, -window.innerHeight)');
  } else if (command.includes('scroll top')) {
    if (activeTabId) tabs[activeTabId].webview.executeJavaScript('window.scrollTo(0, 0)');
  } else if (command.includes('scroll bottom')) {
    if (activeTabId) tabs[activeTabId].webview.executeJavaScript('window.scrollTo(0, document.body.scrollHeight)');
  } else if (command.includes('scroll bottom')) {
    if (activeTabId) tabs[activeTabId].webview.executeJavaScript('window.scrollTo(0, document.body.scrollHeight)');
  } else if (command.includes('dark mode') || command.includes('light mode')) {
    darkModeBtn.click();
  } else if (command.includes('close tab')) {
    if (activeTabId) closeTab(activeTabId);
  } else {
    navigate(command);
  }
});