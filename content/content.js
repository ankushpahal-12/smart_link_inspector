/**
 * Content script - Main entry point
 * PHASE V1: Basic URL detection and messaging
 * PHASE V2: Added live detection with MutationObserver
 * PHASE V3: Enhanced with analysis support
 */

// Cache for detected URLs to avoid redundant scanning
let cachedUrls = [];
let isObserving = false;

/**
 * Scan page and collect all URLs (PHASE V1 core function)
 * @param {boolean} externalOnly - If true, only return external URLs
 * @returns {Array} Array of detected URLs
 */
function scanPageUrls(externalOnly = false) {
  const urls = getAllUrls(externalOnly);
  cachedUrls = urls;
  return urls;
}

/**
 * Handle URL update from observer (PHASE V2)
 */
function handleUrlUpdate() {
  const urls = scanPageUrls();
  
  // Notify popup if it's open
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.URLS_RESPONSE,
    urls: urls,
    isLiveUpdate: true
  }).catch(() => {
    // Popup might be closed, ignore error
  });
}

/**
 * Initialize live URL detection (PHASE V2)
 */
function startLiveDetection() {
  if (!isObserving) {
    initUrlObserver(handleUrlUpdate);
    isObserving = true;
  }
}

/**
 * Stop live URL detection
 */
function stopLiveDetection() {
  if (isObserving) {
    stopUrlObserver();
    isObserving = false;
  }
}

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case MESSAGE_TYPES.GET_URLS:
      // Scan page and return URLs (PHASE V1)
      // Support external-only filter (ENHANCED)
      const externalOnly = message.externalOnly || false;
      const urls = scanPageUrls(externalOnly);
      sendResponse({
        type: MESSAGE_TYPES.URLS_RESPONSE,
        urls: urls,
        pageTitle: document.title,
        pageUrl: window.location.href
      });
      
      // Start live detection (PHASE V2)
      startLiveDetection();
      break;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
  
  return true; // Keep message channel open for async response
});

// Initial scan when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    scanPageUrls();
  });
} else {
  scanPageUrls();
}

console.log('Smart Link Inspector: Content script loaded');
