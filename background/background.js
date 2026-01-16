/**
 * Background Service Worker
 * Handle URL analysis and export operations
 */

// Import constants (need to redefine for service worker context)
const MESSAGE_TYPES = {
  GET_URLS: 'GET_URLS',
  URLS_RESPONSE: 'URLS_RESPONSE',
  HIGHLIGHT_URL: 'HIGHLIGHT_URL',
  ANALYZE_URLS: 'ANALYZE_URLS',
  ANALYSIS_RESPONSE: 'ANALYSIS_RESPONSE',
  EXPORT_URLS: 'EXPORT_URLS'
};

const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

const RISK_SCORES = {
  LOW: { min: 0, max: 30, label: 'Low Risk', color: '#4caf50' },
  MEDIUM: { min: 31, max: 60, label: 'Medium Risk', color: '#ff9800' },
  HIGH: { min: 61, max: 100, label: 'High Risk', color: '#f44336' }
};

const PHISHING_KEYWORDS = [
  'login', 'verify', 'account', 'secure', 'update', 'confirm',
  'banking', 'password', 'suspended', 'urgent', 'click', 'free',
  'winner', 'prize', 'claim', 'limited', 'expire'
];

// Import analyzer and exporter functions
importScripts('urlAnalyzer.js', 'exporter.js');

/**
 * Handle messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGE_TYPES.ANALYZE_URLS:
      // Analyze URLs for security risks
      try {
        const analyzedUrls = analyzeUrls(message.urls);
        const summary = getAnalysisSummary(analyzedUrls);
        
        sendResponse({
          type: MESSAGE_TYPES.ANALYSIS_RESPONSE,
          urls: analyzedUrls,
          summary: summary,
          success: true
        });
      } catch (error) {
        sendResponse({
          type: MESSAGE_TYPES.ANALYSIS_RESPONSE,
          error: error.message,
          success: false
        });
      }
      break;
      
    case MESSAGE_TYPES.EXPORT_URLS:
      // Export URLs to file
      try {
        exportUrls(message.urls, message.format, message.metadata);
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
      break;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
  
  return true; // Keep message channel open
});

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Smart Link Inspector installed');
    
    // Set default preferences
    chrome.storage.local.set({
      darkMode: false
    });
  } else if (details.reason === 'update') {
    console.log('Smart Link Inspector updated to version', chrome.runtime.getManifest().version);
  }
});

console.log('Smart Link Inspector: Background service worker loaded');

