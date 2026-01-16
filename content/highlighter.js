/**
 * Link highlighter for visual feedback
 * PHASE V2: Highlight selected links on the webpage
 * ENHANCED: Auto-highlight all URLs with numbered badges
 * ENHANCED: Plain-text URL highlighting with hover actions
 */

const HIGHLIGHT_CLASS = 'smart-link-inspector-highlight';
const AUTO_HIGHLIGHT_CLASS = 'smart-link-inspector-auto-highlight';
const BADGE_CLASS = 'smart-link-inspector-badge';
const PLAIN_TEXT_HIGHLIGHT_CLASS = 'smart-link-inspector-plain-text';
const HOVER_ACTIONS_CLASS = 'smart-link-inspector-hover-actions';
const TOAST_CLASS = 'smart-link-inspector-toast';

let currentHighlightedElement = null;
let autoHighlightEnabled = false;
let urlBadges = [];
let plainTextHighlights = [];
let toastTimeout = null;

// Color palette for different risk levels
const HIGHLIGHT_COLORS = {
  low: '#4caf50',      // Green
  medium: '#ff9800',   // Orange
  high: '#f44336',     // Red
  default: '#2196f3',  // Blue
  plainText: '#ffd700' // Yellow for plain text
};

/**
 * Auto-highlight all URLs on the page with numbered badges
 * @param {Array} urls - Array of URL objects with analysis
 */
function autoHighlightAllUrls(urls) {
  // Remove existing auto-highlights
  removeAutoHighlights();
  
  if (!urls || urls.length === 0) return;
  
  autoHighlightEnabled = true;
  
  urls.forEach((urlObj, index) => {
    const elements = document.querySelectorAll('a[href]');
    
    for (const element of elements) {
      if (element.href === urlObj.url) {
        // Add auto-highlight class
        element.classList.add(AUTO_HIGHLIGHT_CLASS);
        
        // Determine color based on risk level
        const analysis = urlObj.analysis || {};
        let color = HIGHLIGHT_COLORS.default;
        
        if (analysis.riskLevel === 'low') {
          color = HIGHLIGHT_COLORS.low;
        } else if (analysis.riskLevel === 'medium') {
          color = HIGHLIGHT_COLORS.medium;
        } else if (analysis.riskLevel === 'high') {
          color = HIGHLIGHT_COLORS.high;
        }
        
        // Set custom color
        element.style.setProperty('--highlight-color', color);
        
        // Create and add numbered badge
        const badge = createBadge(index + 1, color);
        element.style.position = 'relative';
        element.appendChild(badge);
        urlBadges.push({ element, badge });
        
        break; // Only highlight first occurrence
      }
    }
  });
}

/**
 * Create a numbered badge element
 * @param {number} number - Badge number
 * @param {string} color - Badge color
 * @returns {HTMLElement} Badge element
 */
function createBadge(number, color) {
  const badge = document.createElement('span');
  badge.className = BADGE_CLASS;
  badge.textContent = number;
  badge.style.backgroundColor = color;
  return badge;
}

/**
 * Remove all auto-highlights and badges
 */
function removeAutoHighlights() {
  // Remove badges
  urlBadges.forEach(({ element, badge }) => {
    if (badge && badge.parentNode) {
      badge.parentNode.removeChild(badge);
    }
    element.style.removeProperty('--highlight-color');
  });
  urlBadges = [];
  
  // Remove auto-highlight classes
  const autoHighlighted = document.querySelectorAll(`.${AUTO_HIGHLIGHT_CLASS}`);
  autoHighlighted.forEach(el => {
    el.classList.remove(AUTO_HIGHLIGHT_CLASS);
  });
  
  autoHighlightEnabled = false;
}

/**
 * Highlight a single link element (for click action)
 * @param {string} url - URL to highlight
 */
function highlightLink(url) {
  // Remove previous single highlight
  removeHighlight();
  
  // Find the element with this URL
  const anchors = document.querySelectorAll('a[href]');
  let found = false;
  
  for (const anchor of anchors) {
    if (anchor.href === url) {
      anchor.classList.add(HIGHLIGHT_CLASS);
      currentHighlightedElement = anchor;
      found = true;
      
      // Scroll element into view
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      break;
    }
  }
  
  return found;
}

/**
 * Remove single highlight from currently highlighted element
 */
function removeHighlight() {
  if (currentHighlightedElement) {
    currentHighlightedElement.classList.remove(HIGHLIGHT_CLASS);
    currentHighlightedElement = null;
  }
  
  // Fallback: remove all single highlights
  const highlighted = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
  highlighted.forEach(el => el.classList.remove(HIGHLIGHT_CLASS));
}

/**
 * Toggle auto-highlight on/off
 */
function toggleAutoHighlight() {
  if (autoHighlightEnabled) {
    removeAutoHighlights();
  }
  return !autoHighlightEnabled;
}

/**
 * Listen for highlight messages from popup
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === MESSAGE_TYPES.HIGHLIGHT_URL) {
    let success = false;
    
    if (message.url) {
      success = highlightLink(message.url);
    } else {
      removeHighlight();
      success = true;
    }
    
    sendResponse({ success: success });
    return true;
  }
  
  if (message.type === 'AUTO_HIGHLIGHT_URLS') {
    autoHighlightAllUrls(message.urls);
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'REMOVE_AUTO_HIGHLIGHTS') {
    removeAutoHighlights();
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'TOGGLE_AUTO_HIGHLIGHT') {
    const enabled = toggleAutoHighlight();
    sendResponse({ success: true, enabled: enabled });
    return true;
  }
  
  if (message.type === 'HIGHLIGHT_PLAIN_TEXT_URLS') {
    highlightPlainTextUrls();
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'REMOVE_PLAIN_TEXT_HIGHLIGHTS') {
    removePlainTextHighlights();
    sendResponse({ success: true });
    return true;
  }
});

/**
 * Highlight plain-text URLs on the page with hover actions
 */
function highlightPlainTextUrls() {
  // Remove existing highlights
  removePlainTextHighlights();
  
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  
  // Get all text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip script, style tags, and already highlighted elements
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        const tagName = parent.tagName;
        if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'A') {
          return NodeFilter.FILTER_REJECT;
        }
        
        if (parent.classList.contains(PLAIN_TEXT_HIGHLIGHT_CLASS)) {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  let node;
  const nodesToProcess = [];
  
  while (node = walker.nextNode()) {
    const matches = node.textContent.match(urlRegex);
    if (matches) {
      nodesToProcess.push({ node, matches });
    }
  }
  
  // Process nodes and wrap URLs
  nodesToProcess.forEach(({ node, matches }) => {
    const parent = node.parentElement;
    const text = node.textContent;
    
    // Create a document fragment to hold the new nodes
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    
    matches.forEach(url => {
      const index = text.indexOf(url, lastIndex);
      if (index === -1) return;
      
      // Add text before URL
      if (index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
      }
      
      // Create wrapper for URL
      const wrapper = createPlainTextUrlWrapper(url);
      fragment.appendChild(wrapper);
      plainTextHighlights.push(wrapper);
      
      lastIndex = index + url.length;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
    
    // Replace the text node with the fragment
    parent.replaceChild(fragment, node);
  });
}

/**
 * Create a wrapper element for plain-text URL with hover actions
 */
function createPlainTextUrlWrapper(url) {
  const wrapper = document.createElement('span');
  wrapper.className = PLAIN_TEXT_HIGHLIGHT_CLASS;
  wrapper.textContent = url;
  wrapper.style.backgroundColor = HIGHLIGHT_COLORS.plainText;
  wrapper.style.cursor = 'pointer';
  wrapper.dataset.url = url;
  
  // Create hover actions container
  const actions = document.createElement('div');
  actions.className = HOVER_ACTIONS_CLASS;
  actions.innerHTML = `
    <button class="action-btn copy-btn" title="Copy URL">📋 Copy</button>
    <button class="action-btn open-btn" title="Open URL">🔗 Open</button>
    <button class="action-btn highlight-btn" title="Highlight">✨ Highlight</button>
  `;
  
  // Add event listeners to buttons
  const copyBtn = actions.querySelector('.copy-btn');
  const openBtn = actions.querySelector('.open-btn');
  const highlightBtn = actions.querySelector('.highlight-btn');
  
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyToClipboard(url);
    showPageToast('✅ URL copied to clipboard');
  });
  
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.open(url, '_blank');
    showPageToast('🔗 Opening URL in new tab');
  });
  
  highlightBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    wrapper.style.backgroundColor = '#ffff00'; // Bright yellow
    showPageToast('✨ URL highlighted');
    setTimeout(() => {
      wrapper.style.backgroundColor = HIGHLIGHT_COLORS.plainText;
    }, 2000);
  });
  
  // Timer for auto-hide after 5 seconds
  let hideTimer = null;
  
  // Show actions on hover
  wrapper.addEventListener('mouseenter', () => {
    // Clear any existing timer
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    
    // Show actions if not already shown
    if (actions.parentNode !== wrapper) {
      wrapper.appendChild(actions);
    }
    
    // Set timer to hide after 5 seconds
    hideTimer = setTimeout(() => {
      if (actions.parentNode === wrapper) {
        wrapper.removeChild(actions);
      }
      hideTimer = null;
    }, 5000);
  });
  
  // Keep actions visible when hovering over them
  actions.addEventListener('mouseenter', () => {
    // Clear timer when hovering over actions
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  });
  
  // Restart timer when leaving actions
  actions.addEventListener('mouseleave', () => {
    hideTimer = setTimeout(() => {
      if (actions.parentNode === wrapper) {
        wrapper.removeChild(actions);
      }
      hideTimer = null;
    }, 5000);
  });
  
  return wrapper;
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('URL copied:', text);
    }).catch(err => {
      console.error('Failed to copy:', err);
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

/**
 * Fallback copy method
 */
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    console.log('URL copied (fallback):', text);
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }
  document.body.removeChild(textarea);
}

/**
 * Remove all plain-text URL highlights
 */
function removePlainTextHighlights() {
  plainTextHighlights.forEach(wrapper => {
    if (wrapper && wrapper.parentNode) {
      // Replace wrapper with plain text
      const textNode = document.createTextNode(wrapper.textContent);
      wrapper.parentNode.replaceChild(textNode, wrapper);
    }
  });
  plainTextHighlights = [];
  
  // Fallback: remove any remaining highlights
  const remaining = document.querySelectorAll(`.${PLAIN_TEXT_HIGHLIGHT_CLASS}`);
  remaining.forEach(el => {
    const textNode = document.createTextNode(el.textContent);
    el.parentNode.replaceChild(textNode, el);
  });
}

/**
 * Show toast notification on the page
 * @param {string} message - Message to display
 */
function showPageToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector(`.${TOAST_CLASS}`);
  if (existingToast) {
    existingToast.remove();
  }
  
  // Clear existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = TOAST_CLASS;
  toast.textContent = message;
  
  // Add styles inline to ensure they work
  toast.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    background: #323232 !important;
    color: white !important;
    padding: 12px 24px !important;
    border-radius: 8px !important;
    font-family: Arial, sans-serif !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    z-index: 999999 !important;
    animation: slideInRight 0.3s ease-out !important;
    pointer-events: none !important;
  `;
  
  // Add to page
  document.body.appendChild(toast);
  
  // Auto-hide after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 3000);
}
