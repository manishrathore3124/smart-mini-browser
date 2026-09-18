# 🌐 Smart Mini Browser

A fully functional desktop web browser built with **Electron.js**, featuring multi-tab browsing, a custom search engine, and hands-free voice navigation.

## ✨ Features

- **Multi-Tab Browsing** — Open, switch, and manage multiple tabs seamlessly
- **Bookmarks & History** — Save favorite sites and revisit browsing history
- **Bingo Search Engine** — Custom-built search engine powered by real-time Google search results via SerpApi
- **Voice Commands** — Hands-free navigation using Python Speech Recognition (open sites, new tab, scroll, bookmark)
- **Dark/Light Mode** — Persistent theming synced across the browser and search engine UI
- **Windows Installer** — Packaged as a standalone `.exe` using Electron Builder

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Desktop Framework | Electron.js |
| Frontend | HTML, CSS, JavaScript |
| Voice Recognition | Python (Speech Recognition) |
| Search Integration | SerpApi |
| Packaging | Electron Builder |
| Runtime | Node.js |

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- Python 3.x (for voice command feature)

### Installation

```bash
# Clone the repository
git clone https://github.com/manishrathore3124/smart-mini-browser.git

# Navigate to project folder
cd smart-mini-browser

# Install dependencies
npm install

# Run the app
npm start
```

## 🎙️ Voice Commands

The browser supports voice-based navigation — say commands like "open [website]", "new tab", "scroll down", or "bookmark this page" to control the browser hands-free.

## 📦 Build for Windows

```bash
npm run build
```

This generates a standalone `.exe` installer using Electron Builder.

## 👤 Author

**Manish Rathore**
- GitHub: [@manishrathore3124](https://github.com/manishrathore3124)
- LinkedIn: [Manish Rathore](https://www.linkedin.com/in/manish-rathore-31494a381/)

## 📄 License

This project is open source and available for learning purposes.
