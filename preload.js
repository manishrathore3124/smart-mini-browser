const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Bookmarks
  saveBookmark: (bookmark) => ipcRenderer.invoke('save-bookmark', bookmark),
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  deleteBookmark: (url) => ipcRenderer.invoke('delete-bookmark', url),

  // History
  saveHistory: (item) => ipcRenderer.invoke('save-history', item),
  getHistory: () => ipcRenderer.invoke('get-history'),
  clearHistory: () => ipcRenderer.invoke('clear-history'),

  // Dark Mode
  toggleDarkMode: () => ipcRenderer.invoke('toggle-dark-mode'),

  openVoice: () => ipcRenderer.send('open-voice'),
  onVoiceCommand: (callback) => ipcRenderer.on('execute-voice', (e, cmd) => callback(cmd)),
});