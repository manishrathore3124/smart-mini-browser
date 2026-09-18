const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;

const dataPath = app.getPath('userData');
const bookmarksFile = path.join(dataPath, 'bookmarks.json');
const historyFile = path.join(dataPath, 'history.json');

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
  catch { return []; }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
    title: 'Smart Mini Browser'
  });
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true);
    } else {
      callback(false);
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Voice Window
ipcMain.on('open-voice', () => {
  const voiceWindow = new BrowserWindow({
    width: 400,
    height: 350,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'Voice Command'
  });
  voiceWindow.loadFile('voice.html');
  voiceWindow.setMenuBarVisibility(false);

  // Python speech recognition start 
  const python = spawn('python', [path.join(__dirname, 'speech.py')]);

  python.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output.startsWith('RESULT:')) {
      const command = output.replace('RESULT:', '').toLowerCase();
      mainWindow.webContents.send('execute-voice', command);
      voiceWindow.close();
    }
  });

  python.stderr.on('data', (data) => {
    console.error('Python error:', data.toString());
  });
});

// Voice command receive karo
ipcMain.on('voice-command', (event, command) => {
  mainWindow.webContents.send('execute-voice', command);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Bookmarks IPC
ipcMain.handle('save-bookmark', (e, bookmark) => {
  const bookmarks = readJSON(bookmarksFile);
  if (!bookmarks.find(b => b.url === bookmark.url)) {
    bookmarks.push(bookmark);
    writeJSON(bookmarksFile, bookmarks);
  }
});
ipcMain.handle('get-bookmarks', () => readJSON(bookmarksFile));
ipcMain.handle('delete-bookmark', (e, url) => {
  const bookmarks = readJSON(bookmarksFile).filter(b => b.url !== url);
  writeJSON(bookmarksFile, bookmarks);
});

// History IPC
ipcMain.handle('save-history', (e, item) => {
  const history = readJSON(historyFile);
  history.push(item);
  writeJSON(historyFile, history.slice(-100));
});
ipcMain.handle('get-history', () => readJSON(historyFile));
ipcMain.handle('clear-history', () => writeJSON(historyFile, []));