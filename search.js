const API_KEY = 'YOUR_SERPAPI_KEY_HERE';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID_HERE';

const searchInput = document.getElementById('searchInput');
const resultsInput = document.getElementById('resultsInput');

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

resultsInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearchFromResults();
});

function goHome() {
  document.getElementById('searchPage').style.display = 'flex';
  document.getElementById('resultsPage').style.display = 'none';
}

function doSearchFromResults() {
  const query = resultsInput.value.trim();
  if (query) fetchResults(query);
}

function doSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  resultsInput.value = query;
  fetchResults(query);
}

async function fetchResults(query) {
  document.getElementById('searchPage').style.display = 'none';
  document.getElementById('resultsPage').style.display = 'block';
  document.getElementById('resultsList').innerHTML = '<div class="loading">🔍 Searching...</div>';
  document.getElementById('resultCount').textContent = '';

  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${API_KEY}&engine=google`;
    const response = await fetch(url);
    const data = await response.json();

    const items = data.organic_results || [];

    if (items.length === 0) {
      document.getElementById('resultsList').innerHTML = '<div class="no-results">No results found.</div>';
      return;
    }

    document.getElementById('resultCount').textContent = `About ${items.length} results`;

    document.getElementById('resultsList').innerHTML = items.map(item => `
      <div class="result-card">
        <div class="result-url">${item.displayed_link || item.link}</div>
        <a class="result-title" href="${item.link}" onclick="openLink('${item.link}'); return false;">${item.title}</a>
        <div class="result-desc">${item.snippet || ''}</div>
      </div>
    `).join('');

  } catch (err) {
    document.getElementById('resultsList').innerHTML = '<div class="no-results">❌ Network error.</div>';
  }
}

function openLink(url) {
  window.location.href = url;
}

// Theme Toggle
let isSearchDark = true;

function toggleTheme() {
  isSearchDark = !isSearchDark;
  if (isSearchDark) {
    document.body.classList.remove('light');
    document.getElementById('themeBtn').textContent = '☀️ Light';
  } else {
    document.body.classList.add('light');
    document.getElementById('themeBtn').textContent = '🌙 Dark';
  }
}