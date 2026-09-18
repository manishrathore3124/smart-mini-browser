# 🌐 Smart Mini Browser

A lightweight, feature-rich desktop web browser built with **Electron.js**, featuring voice command navigation, a custom search engine, bookmarks, history, and dark/light mode.

---

## ✨ Features

- 🗂️ **Multi-Tab Browsing** — Each tab has its own independent browsing session
- 🎤 **Voice Commands** — Navigate hands-free using Python Speech Recognition
- 🔍 **Bingo Search Engine** — Custom search engine with real Google results via SerpApi
- ⭐ **Bookmarks** — Save and manage your favorite websites
- 🕘 **Browsing History** — Auto-saves visited URLs with timestamps
- 🌙 **Dark / Light Mode** — Toggle between themes instantly
- 📦 **Windows Installer** — Packaged as .exe using Electron Builder

---

## 🎤 Voice Commands

| Say This | Action |
|----------|--------|
| `"open youtube"` | Opens YouTube |
| `"new tab"` | Opens a new tab |
| `"go back"` | Navigate back |
| `"go forward"` | Navigate forward |
| `"reload"` | Reload current page |
| `"bookmark"` | Save current page |
| `"scroll down"` | Scroll down one page |
| `"scroll up"` | Scroll up one page |
| `"scroll top"` | Go to top of page |
| `"scroll bottom"` | Go to bottom of page |
| `"dark mode"` | Toggle dark/light theme |
| `"close tab"` | Close current tab |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Electron.js** | Desktop application framework |
| **HTML/CSS/JavaScript** | Frontend UI |
| **Node.js** | Backend & file system operations |
| **Python 3** | Voice recognition |
| **SpeechRecognition** | Python speech-to-text library |
| **SerpApi** | Real-time Google search results |
| **Electron Builder** | Windows .exe packaging |

---

## 📁 Project Structure

```
smart-mini-browser/
├── main.js          # Main process — window, IPC, file storage
├── preload.js       # Bridge between main & renderer
├── index.html       # Browser UI (toolbar, tabs, webview)
├── renderer.js      # Frontend logic (tabs, navigation, bookmarks)
├── styles.css       # Browser styling (dark/light mode)
├── search.html      # Bingo search engine page
├── search.js        # Search logic & SerpApi integration
├── search.css       # Search engine styling
├── speech.py        # Python voice recognition script
├── voice.html       # Voice command popup UI
└── package.json     # Project configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Python 3](https://www.python.org/) with pip
- npm (comes with Node.js)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/manishrathore3124/smart-mini-browser.git
cd smart-mini-browser
```

**2. Install Node.js dependencies**
```bash
npm install
```

**3. Install Python dependencies**
```bash
pip install SpeechRecognition sounddevice scipy
```

**4. Add your SerpApi key**

Open `search.js` and add your own SerpApi key:
```javascript
const API_KEY = 'your_serpapi_key_here';
```

> ⚠️ **Note:** Never share or upload your API key to GitHub. Get a free key at [serpapi.com](https://serpapi.com)

Also add `search.js` to `.gitignore` to keep your key safe:
```
search.js
```

**5. Run the browser**
```bash
npm start
```

---

## 📦 Build Windows Installer

```bash
npm run build
```

The installer will be created at:
```
dist/Smart Mini Browser Setup 1.0.0.exe
```

---

## 🎯 How It Works

### Architecture
```
┌─────────────────┐     IPC      ┌──────────────────┐
│   Main Process  │◄────────────►│ Renderer Process  │
│   (main.js)     │   preload.js │  (renderer.js)    │
│                 │              │                   │
│ • Window Mgmt   │              │ • Tab System      │
│ • File I/O      │              │ • Navigation      │
│ • Python Spawn  │              │ • Bookmarks UI    │
│ • Permissions   │              │ • Voice Execute   │
└─────────────────┘              └──────────────────┘
         │
         ▼
┌─────────────────┐
│   speech.py     │
│   (Python)      │
│                 │
│ • Record Audio  │
│ • Google Speech │
│ • Return Text   │
└─────────────────┘
```

### Voice Recognition Flow
```
User clicks Voice → Popup opens → Python records 5s audio
→ Google Speech API converts to text → Command sent to browser
→ Browser executes command → Popup closes
```

### Bingo Search Flow
```
User types query → SerpApi called with query + API key
→ JSON results returned → Displayed as result cards
→ Click result → Opens website in browser
```

---

## 📋 Requirements

### Hardware
- Processor: Intel Core i3 or higher
- RAM: 4 GB minimum (8 GB recommended)
- Storage: 500 MB free space
- Microphone: Required for voice commands
- Internet: Required for browsing and search

### Software
- Windows 10/11 (64-bit)
- Node.js v18+
- Python 3.x
- pip packages: SpeechRecognition, sounddevice, scipy

---

## 🙏 Acknowledgements

- [Electron.js](https://www.electronjs.org/) — Desktop app framework
- [SerpApi](https://serpapi.com/) — Search API
- [Python SpeechRecognition](https://pypi.org/project/SpeechRecognition/) — Voice library
- [Electron Builder](https://www.electron.build/) — App packaging

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Manish Rathore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
