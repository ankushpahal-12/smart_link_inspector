/**
 * MutationObserver for live URL detection
 * PHASE V2: Detect dynamically added URLs
 */

let urlObserver = null;
let observerCallback = null;

/**
 * Initialize MutationObserver to watch for DOM changes
 * @param {Function} callback - Function to call when URLs change
 */
function initUrlObserver(callback) {
  observerCallback = callback;
  
  // Disconnect existing observer if any
  if (urlObserver) {
    urlObserver.disconnect();
  }
  
  // Create new observer
  urlObserver = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    
    for (const mutation of mutations) {
      // Check if any added nodes contain links
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'A' || node.querySelector('a')) {
              shouldUpdate = true;
            }
          }
        });
      }
      
      // Check if href attribute changed
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        shouldUpdate = true;
      }
    }
    
    // Debounce updates to avoid excessive scanning
    if (shouldUpdate && observerCallback) {
      debounceUpdate();
    }
  });
  
  // Start observing
  urlObserver.observe(document.body, OBSERVER_CONFIG);
}

/**
 * Debounced update function to avoid excessive calls
 */
let updateTimeout = null;
function debounceUpdate() {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    if (observerCallback) {
      observerCallback();
    }
  }, 500); // Wait 500ms after last change
}

/**
 * Stop observing DOM changes
 */
function stopUrlObserver() {
  if (urlObserver) {
    urlObserver.disconnect();
    urlObserver = null;
  }
  observerCallback = null;
}

/**
 * Check if observer is active
 * @returns {boolean}
 */
function isObserverActive() {
  return urlObserver !== null;
}
