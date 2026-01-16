/**
 * Popup Script - Main UI Controller
 * PHASE V1: Basic URL display and actions
 * PHASE V2: Search, grouping, dark mode, live updates
 * PHASE V3: Risk analysis, export functionality
 */

console.log('popup.js START');

// State management
let allUrls = [];
let filteredUrls = [];
let currentView = 'list';
let isDarkMode = false;
let pageMetadata = {};
let autoHighlightEnabled = false;
let externalOnlyEnabled = false;
let plainTextHighlightEnabled = false;

// DOM Elements
const elements = {
  // Buttons
  scanBtn: document.getElementById('scanBtn'),
  darkModeToggle: document.getElementById('darkModeToggle'),
  exportBtn: document.getElementById('exportBtn'),
  exportMenu: document.getElementById('exportMenu'),
  listViewBtn: document.getElementById('listViewBtn'),
  groupViewBtn: document.getElementById('groupViewBtn'),
  clearSearch: document.getElementById('clearSearch'),
  autoHighlightToggle: document.getElementById('autoHighlightToggle'),
  externalOnlyToggle: document.getElementById('externalOnlyToggle'),
  plainTextToggle: document.getElementById('plainTextToggle'),
  
  // Inputs
  searchInput: document.getElementById('searchInput'),
  
  // Containers
  loading: document.getElementById('loading'),
  emptyState: document.getElementById('emptyState'),
  urlContainer: document.getElementById('urlContainer'),
  listView: document.getElementById('listView'),
  groupView: document.getElementById('groupView'),
  statsBar: document.getElementById('statsBar'),
  
  // Stats
  statTotal: document.getElementById('statTotal'),
  statLow: document.getElementById('statLow'),
  statMedium: document.getElementById('statMedium'),
  statHigh: document.getElementById('statHigh'),
  
  // Footer
  urlCount: document.getElementById('urlCount'),
  liveStatus: document.getElementById('liveStatus')
};

/**
 * Toggle auto-highlight on page (ENHANCED)
 */
async function toggleAutoHighlight() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!autoHighlightEnabled) {
      // Enable auto-highlight
      await chrome.tabs.sendMessage(tab.id, {
        type: 'AUTO_HIGHLIGHT_URLS',
        urls: allUrls
      });
      
      autoHighlightEnabled = true;
      elements.autoHighlightToggle.classList.add('active');
      elements.autoHighlightToggle.querySelector('.btn-text').textContent = 'Hide Highlights';
      showToast('🎨 All URLs highlighted on page');
    } else {
      // Disable auto-highlight
      await chrome.tabs.sendMessage(tab.id, {
        type: 'REMOVE_AUTO_HIGHLIGHTS'
      });
      
      autoHighlightEnabled = false;
      elements.autoHighlightToggle.classList.remove('active');
      elements.autoHighlightToggle.querySelector('.btn-text').textContent = 'Highlight All';
      showToast('🎨 Highlights removed');
    }
  } catch (error) {
    console.error('Failed to toggle auto-highlight:', error);
    showToast('⚠️ Could not toggle highlights');
  }
}

/**
 * Show/hide auto-highlight button
 */
function updateAutoHighlightButton() {
  if (allUrls.length > 0) {
    elements.autoHighlightToggle.classList.remove('hidden');
    elements.plainTextToggle.classList.remove('hidden');
  } else {
    elements.autoHighlightToggle.classList.add('hidden');
    elements.plainTextToggle.classList.add('hidden');
    autoHighlightEnabled = false;
    plainTextHighlightEnabled = false;
    elements.autoHighlightToggle.classList.remove('active');
    elements.plainTextToggle.classList.remove('active');
  }
}

/**
 * Toggle plain-text URL highlighting
 */
async function togglePlainTextHighlight() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!plainTextHighlightEnabled) {
      // Enable plain-text highlighting
      await chrome.tabs.sendMessage(tab.id, {
        type: 'HIGHLIGHT_PLAIN_TEXT_URLS'
      });
      
      plainTextHighlightEnabled = true;
      elements.plainTextToggle.classList.add('active');
      elements.plainTextToggle.querySelector('.btn-text').textContent = 'Hide Text URLs';
      showToast('✨ Plain-text URLs highlighted');
    } else {
      // Disable plain-text highlighting
      await chrome.tabs.sendMessage(tab.id, {
        type: 'REMOVE_PLAIN_TEXT_HIGHLIGHTS'
      });
      
      plainTextHighlightEnabled = false;
      elements.plainTextToggle.classList.remove('active');
      elements.plainTextToggle.querySelector('.btn-text').textContent = 'Highlight Text URLs';
      showToast('✨ Text highlights removed');
    }
  } catch (error) {
    console.error('Failed to toggle plain-text highlight:', error);
    showToast('⚠️ Could not toggle text highlights');
  }
}

/**
 * Handle external-only filter toggle
 */
function handleExternalOnlyToggle() {
  externalOnlyEnabled = !externalOnlyEnabled;
  
  elements.externalOnlyToggle.classList.toggle('active', externalOnlyEnabled);
  elements.externalOnlyToggle.textContent = externalOnlyEnabled
    ? '🌍 External Only (ON)'
    : '🌍 External Only';
  
  showToast(externalOnlyEnabled ? '🌐 Showing external links only' : '🔗 Showing all links');
  applyFilters();
}

/**
 * Apply all active filters (search + external-only)
 */
function applyFilters() {
  let result = [...allUrls];
  
  // Apply external-only filter
  if (externalOnlyEnabled && pageMetadata.pageUrl) {
    result = result.filter(urlObj => {
      try {
        const url = new URL(urlObj.url);
        const pageDomain = new URL(pageMetadata.pageUrl).hostname.replace(/^www\./, '');
        const linkDomain = url.hostname.replace(/^www\./, '');
        return pageDomain !== linkDomain;
      } catch {
        return false;
      }
    });
  }
  
  // Apply search filter
  const query = elements.searchInput.value.toLowerCase().trim();
  if (query) {
    result = result.filter(urlObj =>
      urlObj.url.toLowerCase().includes(query) ||
      (urlObj.text && urlObj.text.toLowerCase().includes(query))
    );
  }
  
  filteredUrls = result;
  displayUrls();
}

/**
 * Initialize popup (PHASE V1)
 */
async function init() {
  // Load dark mode preference (PHASE V2)
  await loadDarkMode();
  
  // Setup event listeners
  setupEventListeners();
  
  // Show empty state initially
  showEmptyState();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Scan button (PHASE V1)
  elements.scanBtn.addEventListener('click', scanPage);
  
  // Dark mode toggle (PHASE V2)
  elements.darkModeToggle.addEventListener('click', toggleDarkMode);
  
  // Search input (PHASE V2)
  elements.searchInput.addEventListener('input', handleSearch);
  elements.clearSearch.addEventListener('click', clearSearch);
  
  // View toggle (PHASE V2)
  elements.listViewBtn.addEventListener('click', () => switchView('list'));
  elements.groupViewBtn.addEventListener('click', () => switchView('group'));
  
  // Auto-highlight toggle (ENHANCED) - Defensive binding
  if (elements.autoHighlightToggle) {
    elements.autoHighlightToggle.addEventListener('click', toggleAutoHighlight);
  }
  
  // Plain-text highlight toggle (ENHANCED) - Defensive binding
  if (elements.plainTextToggle) {
    elements.plainTextToggle.addEventListener('click', togglePlainTextHighlight);
  }
  
  // External-only toggle (ENHANCED) - Defensive binding
  if (elements.externalOnlyToggle) {
    elements.externalOnlyToggle.addEventListener('click', handleExternalOnlyToggle);
  }
  
  // Export dropdown (PHASE V3)
  elements.exportBtn.addEventListener('click', toggleExportMenu);
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const format = e.target.dataset.format;
      exportUrls(format);
    });
  });
  
  // Close export menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      elements.exportMenu.classList.add('hidden');
    }
  });
  
  // Listen for live updates from content script (PHASE V2)
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'URLS_RESPONSE' && message.isLiveUpdate) {
      handleLiveUpdate(message.urls);
    }
  });
}

/**
 * Scan current page for URLs (PHASE V1)
 */
async function scanPage() {
  showLoading();
  
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we can access the tab
    if (!tab || !tab.id) {
      showError('Cannot access this page. Try a different webpage.');
      return;
    }
    
    // Try to send message to content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'GET_URLS'
      });
      
      if (response && response.urls) {
        pageMetadata = {
          pageTitle: response.pageTitle,
          pageUrl: response.pageUrl,
          timestamp: Date.now()
        };
        
        // Analyze URLs for security risks (PHASE V3)
        await analyzeUrls(response.urls);
      } else {
        showEmptyState();
      }
    } catch (messageError) {
      // Content script not loaded - try to inject it
      console.log('Content script not loaded, attempting injection...');
      
      try {
        // Inject content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: [
            'utils/constants.js',
            'utils/urlUtils.js',
            'content/highlighter.js',
            'content/observer.js',
            'content/content.js'
          ]
        });
        
        // Inject CSS
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['content/highlighter.css']
        });
        
        // Wait a bit for scripts to load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try again
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: 'GET_URLS'
        });
        
        if (response && response.urls) {
          pageMetadata = {
            pageTitle: response.pageTitle,
            pageUrl: response.pageUrl,
            timestamp: Date.now()
          };
          
          await analyzeUrls(response.urls);
        } else {
          showEmptyState();
        }
      } catch (injectionError) {
        console.error('Failed to inject content script:', injectionError);
        showError('Cannot scan this page. Try refreshing the page first.');
      }
    }
  } catch (error) {
    console.error('Error scanning page:', error);
    showError('Failed to scan page. Please refresh and try again.');
  }
}

/**
 * Analyze URLs for security risks (PHASE V3)
 */
async function analyzeUrls(urls) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'ANALYZE_URLS',
      urls: urls
    });
    
    if (response && response.success) {
      allUrls = response.urls;
      
      // Update stats
      updateStats(response.summary);
      
      // Apply filters and display
      applyFilters();
    } else {
      // Fallback: display without analysis
      allUrls = urls;
      applyFilters();
    }
  } catch (error) {
    console.error('Error analyzing URLs:', error);
    // Fallback: display without analysis
    allUrls = urls;
    applyFilters();
  }
}

/**
 * Display URLs based on current view
 */
function displayUrls() {
  if (filteredUrls.length === 0) {
    showEmptyState();
    return;
  }
  
  hideLoading();
  elements.urlContainer.classList.remove('hidden');
  elements.emptyState.classList.add('hidden');
  
  // Update count
  elements.urlCount.textContent = `${filteredUrls.length} URL${filteredUrls.length !== 1 ? 's' : ''} detected`;
  
  // Show auto-highlight button
  updateAutoHighlightButton();
  
  // Render based on view
  if (currentView === 'list') {
    renderListView();
  } else {
    renderGroupView();
  }
}

/**
 * Render list view (PHASE V1 & V3)
 */
function renderListView() {
  elements.listView.innerHTML = '';
  elements.listView.classList.remove('hidden');
  elements.groupView.classList.add('hidden');
  
  filteredUrls.forEach((urlObj, index) => {
    const urlItem = createUrlItem(urlObj, index);
    elements.listView.appendChild(urlItem);
  });
}

/**
 * Render group view (PHASE V2)
 */
function renderGroupView() {
  elements.listView.classList.add('hidden');
  elements.groupView.classList.remove('hidden');
  elements.groupView.innerHTML = '';
  
  // Group URLs by domain
  const grouped = {};
  filteredUrls.forEach(urlObj => {
    const domain = extractDomain(urlObj.url);
    if (!grouped[domain]) {
      grouped[domain] = [];
    }
    grouped[domain].push(urlObj);
  });
  
  // Sort domains by count
  const sortedDomains = Object.keys(grouped).sort((a, b) => 
    grouped[b].length - grouped[a].length
  );
  
  // Render each domain group
  sortedDomains.forEach(domain => {
    const groupElement = createDomainGroup(domain, grouped[domain]);
    elements.groupView.appendChild(groupElement);
  });
}

/**
 * Create URL item element (PHASE V1 & V3)
 */
function createUrlItem(urlObj, index) {
  const div = document.createElement('div');
  div.className = 'url-item';
  div.dataset.index = index;
  
  const analysis = urlObj.analysis || {};
  
  div.innerHTML = `
    <div class="url-header">
      <div class="url-info">
        <div class="url-text">${escapeHtml(urlObj.url)}</div>
        <div class="url-meta">
          <span class="url-badge badge-type">${urlObj.type || 'clickable'}</span>
          ${analysis.isHttps !== undefined ? 
            `<span class="url-badge ${analysis.isHttps ? 'badge-https' : 'badge-http'}">
              ${analysis.isHttps ? '🔒 HTTPS' : '⚠️ HTTP'}
            </span>` : ''}
          ${analysis.riskLevel ? 
            `<span class="url-badge badge-risk ${analysis.riskLevel}">
              ${analysis.riskLabel} (${analysis.riskScore})
            </span>` : ''}
        </div>
        ${analysis.risks && analysis.risks.length > 0 ? `
          <div class="risk-details">
            <div class="risk-score">
              <span class="text-muted">Risk Score:</span>
              <div class="score-bar">
                <div class="score-fill" style="width: ${analysis.riskScore}%; background-color: ${analysis.riskColor};"></div>
              </div>
              <span>${analysis.riskScore}/100</span>
            </div>
            <ul class="risk-list">
              ${analysis.risks.slice(0, 3).map(risk => `<li>${escapeHtml(risk)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
      <div class="url-actions">
        <button class="action-btn copy-btn" title="Copy URL">📋</button>
        <button class="action-btn open-btn" title="Open in new tab">🔗</button>
        <button class="action-btn highlight-btn" title="Highlight on page">👁️</button>
      </div>
    </div>
  `;
  
  // Add event listeners
  const copyBtn = div.querySelector('.copy-btn');
  const openBtn = div.querySelector('.open-btn');
  const highlightBtn = div.querySelector('.highlight-btn');
  
  copyBtn.addEventListener('click', () => copyUrl(urlObj.url));
  openBtn.addEventListener('click', () => openUrl(urlObj.url));
  highlightBtn.addEventListener('click', () => highlightUrl(urlObj.url, div));
  
  return div;
}

/**
 * Create domain group element (PHASE V2)
 */
function createDomainGroup(domain, urls) {
  const div = document.createElement('div');
  div.className = 'domain-group';
  
  const header = document.createElement('div');
  header.className = 'domain-header';
  header.innerHTML = `
    <span class="domain-name">${escapeHtml(domain)}</span>
    <span class="domain-count">${urls.length}</span>
  `;
  
  const urlsContainer = document.createElement('div');
  urlsContainer.className = 'domain-urls';
  
  urls.forEach((urlObj, index) => {
    const urlItem = createUrlItem(urlObj, index);
    urlsContainer.appendChild(urlItem);
  });
  
  // Toggle collapse
  header.addEventListener('click', () => {
    div.classList.toggle('collapsed');
  });
  
  div.appendChild(header);
  div.appendChild(urlsContainer);
  
  return div;
}

/**
 * Copy URL to clipboard (PHASE V1)
 */
async function copyUrl(url) {
  try {
    await navigator.clipboard.writeText(url);
    showToast('✅ URL copied to clipboard');
  } catch (error) {
    console.error('Failed to copy:', error);
    showToast('❌ Failed to copy URL');
  }
}

/**
 * Open URL in new tab (PHASE V1)
 */
function openUrl(url) {
  chrome.tabs.create({ url: url });
}

/**
 * Highlight URL on page (PHASE V2)
 */
async function highlightUrl(url, element) {
  try {
    // Remove previous selection
    document.querySelectorAll('.url-item.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Add selection to current
    element.classList.add('selected');
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'HIGHLIGHT_URL',
      url: url
    });
    
    if (response && response.success) {
      showToast('🎯 Link highlighted on page');
    }
  } catch (error) {
    console.error('Failed to highlight:', error);
    showToast('⚠️ Could not highlight link');
  }
}

/**
 * Handle search input (PHASE V2)
 */
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (query) {
    elements.clearSearch.classList.remove('hidden');
  } else {
    elements.clearSearch.classList.add('hidden');
  }
  
  applyFilters();
}

/**
 * Clear search
 */
function clearSearch() {
  elements.searchInput.value = '';
  elements.clearSearch.classList.add('hidden');
  applyFilters();
}

/**
 * Switch view (PHASE V2)
 */
function switchView(view) {
  currentView = view;
  
  // Update button states
  elements.listViewBtn.classList.toggle('active', view === 'list');
  elements.groupViewBtn.classList.toggle('active', view === 'group');
  
  // Re-render
  displayUrls();
}

/**
 * Toggle dark mode (PHASE V2)
 */
async function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  
  // Update icon
  elements.darkModeToggle.querySelector('.icon').textContent = isDarkMode ? '☀️' : '🌙';
  
  // Save preference
  await chrome.storage.local.set({ darkMode: isDarkMode });
}

/**
 * Load dark mode preference (PHASE V2)
 */
async function loadDarkMode() {
  const result = await chrome.storage.local.get(['darkMode']);
  isDarkMode = result.darkMode === true;
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    elements.darkModeToggle.querySelector('.icon').textContent = '☀️';
  }
}

/**
 * Update statistics (PHASE V3)
 */
function updateStats(summary) {
  if (!summary) return;
  
  elements.statsBar.classList.remove('hidden');
  elements.statTotal.textContent = summary.total || 0;
  elements.statLow.textContent = summary.lowRisk || 0;
  elements.statMedium.textContent = summary.mediumRisk || 0;
  elements.statHigh.textContent = summary.highRisk || 0;
}

/**
 * Toggle export menu (PHASE V3)
 */
function toggleExportMenu(e) {
  e.stopPropagation();
  elements.exportMenu.classList.toggle('hidden');
}

/**
 * Export URLs (PHASE V3)
 */
async function exportUrls(format) {
  elements.exportMenu.classList.add('hidden');
  
  if (allUrls.length === 0) {
    showToast('⚠️ No URLs to export');
    return;
  }
  
  try {
    await chrome.runtime.sendMessage({
      type: 'EXPORT_URLS',
      urls: allUrls,
      format: format,
      metadata: pageMetadata
    });
    
    showToast(`✅ Exporting ${allUrls.length} URLs as ${format.toUpperCase()}...`);
  } catch (error) {
    console.error('Export failed:', error);
    showToast('❌ Export failed');
  }
}

/**
 * Handle live updates from content script (PHASE V2)
 */
function handleLiveUpdate(urls) {
  // Only update if we have URLs displayed
  if (allUrls.length > 0) {
    const previousCount = allUrls.length;
    analyzeUrls(urls).then(() => {
      if (allUrls.length !== previousCount) {
        showToast(`URLs updated: ${allUrls.length} detected`);
      }
    });
  }
}

/**
 * Utility: Extract domain from URL
 */
function extractDomain(urlString) {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (e) {
    return 'unknown';
  }
}

/**
 * Utility: Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show loading state
 */
function showLoading() {
  elements.loading.classList.remove('hidden');
  elements.emptyState.classList.add('hidden');
  elements.urlContainer.classList.add('hidden');
  elements.scanBtn.disabled = true;
}

/**
 * Hide loading state
 */
function hideLoading() {
  elements.loading.classList.add('hidden');
  elements.scanBtn.disabled = false;
}

/**
 * Show empty state
 */
function showEmptyState() {
  hideLoading();
  elements.emptyState.classList.remove('hidden');
  elements.urlContainer.classList.add('hidden');
  elements.statsBar.classList.add('hidden');
  elements.urlCount.textContent = '0 URLs detected';
}

/**
 * Show error message
 */
function showError(message) {
  hideLoading();
  elements.emptyState.classList.remove('hidden');
  elements.emptyState.querySelector('h3').textContent = 'Error';
  elements.emptyState.querySelector('p').textContent = message;
}

/**
 * Show toast notification
 */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  // Clear any existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  
  // Remove hiding class if present
  toast.classList.remove('hiding');
  
  // Set message and show
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  // Hide after 2.5 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      toast.classList.remove('show', 'hiding');
      toast.classList.add('hidden');
    }, 300); // Match animation duration
  }, 2500);
}

// Expose functions to window (prevents Chrome isolated-world quirks)
window.toggleAutoHighlight = toggleAutoHighlight;
window.handleExternalOnlyToggle = handleExternalOnlyToggle;
window.togglePlainTextHighlight = togglePlainTextHighlight;

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('popup.js END');
