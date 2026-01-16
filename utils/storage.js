/**
 * Chrome storage utility functions
 * PHASE V2: Storage management for preferences
 * PHASE V3: Enhanced with scan history
 */

/**
 * Get value from chrome.storage.local
 * @param {string} key - Storage key
 * @returns {Promise} Resolves with stored value
 */
async function getStorageValue(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

/**
 * Set value in chrome.storage.local
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {Promise}
 */
async function setStorageValue(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
}

/**
 * Get dark mode preference (PHASE V2)
 * @returns {Promise<boolean>}
 */
async function getDarkMode() {
  const darkMode = await getStorageValue(STORAGE_KEYS.DARK_MODE);
  return darkMode === true;
}

/**
 * Set dark mode preference (PHASE V2)
 * @param {boolean} enabled
 * @returns {Promise}
 */
async function setDarkMode(enabled) {
  return setStorageValue(STORAGE_KEYS.DARK_MODE, enabled);
}

/**
 * Save scan results (PHASE V3)
 * @param {Object} scanData - Scan results to save
 * @returns {Promise}
 */
async function saveScanResults(scanData) {
  const data = {
    timestamp: Date.now(),
    ...scanData
  };
  return setStorageValue(STORAGE_KEYS.LAST_SCAN, data);
}

/**
 * Get last scan results (PHASE V3)
 * @returns {Promise<Object>}
 */
async function getLastScanResults() {
  return getStorageValue(STORAGE_KEYS.LAST_SCAN);
}
