/**
 * Constants used across the extension
 * PHASE V1: Basic message types
 * PHASE V2: Added storage keys and observer config
 * PHASE V3: Added risk analysis constants
 */

// Message types for communication between scripts
const MESSAGE_TYPES = {
  GET_URLS: 'GET_URLS',
  URLS_RESPONSE: 'URLS_RESPONSE',
  HIGHLIGHT_URL: 'HIGHLIGHT_URL',
  ANALYZE_URLS: 'ANALYZE_URLS',
  ANALYSIS_RESPONSE: 'ANALYSIS_RESPONSE',
  EXPORT_URLS: 'EXPORT_URLS'
};

// Storage keys for chrome.storage
const STORAGE_KEYS = {
  DARK_MODE: 'darkMode',
  LAST_SCAN: 'lastScan'
};

// MutationObserver configuration
const OBSERVER_CONFIG = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['href']
};

// Risk analysis constants (PHASE V3)
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

// Phishing keywords for risk analysis
const PHISHING_KEYWORDS = [
  'login', 'verify', 'account', 'secure', 'update', 'confirm',
  'banking', 'password', 'suspended', 'urgent', 'click', 'free',
  'winner', 'prize', 'claim', 'limited', 'expire'
];

// Common URL shorteners
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
  'is.gd', 'buff.ly', 'adf.ly', 'short.link', 'tiny.cc'
];

// Export this for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MESSAGE_TYPES,
    STORAGE_KEYS,
    OBSERVER_CONFIG,
    RISK_LEVELS,
    RISK_SCORES,
    PHISHING_KEYWORDS,
    URL_SHORTENERS
  };
}

