/**
 * URL utility functions
 * PHASE V1: Basic URL extraction and deduplication
 * PHASE V2: Added regex-based plain text URL detection
 * PHASE V3: Enhanced validation and parsing
 */

/**
 * Extract all clickable URLs from anchor tags (PHASE V1)
 * @param {Document} doc - The document to scan
 * @returns {Array} Array of URL objects
 */
function extractClickableUrls(doc = document) {
  const urls = [];
  const anchors = doc.querySelectorAll('a[href]');
  
  anchors.forEach((anchor, index) => {
    const href = anchor.href;
    if (isValidUrl(href)) {
      urls.push({
        url: href,
        text: anchor.textContent.trim() || href,
        type: 'clickable',
        element: anchor,
        index: index
      });
    }
  });
  
  return urls;
}

/**
 * Extract plain text URLs using regex (PHASE V2)
 * @param {Document} doc - The document to scan
 * @returns {Array} Array of URL objects
 */
function extractPlainTextUrls(doc = document) {
  const urls = [];
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  
  // Get all text nodes
  const walker = doc.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip script and style tags
        if (node.parentElement.tagName === 'SCRIPT' || 
            node.parentElement.tagName === 'STYLE') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  let node;
  while (node = walker.nextNode()) {
    const matches = node.textContent.match(urlRegex);
    if (matches) {
      matches.forEach(url => {
        if (isValidUrl(url)) {
          urls.push({
            url: url,
            text: url,
            type: 'plain-text',
            element: node.parentElement
          });
        }
      });
    }
  }
  
  return urls;
}

/**
 * Validate if a string is a valid URL
 * @param {string} urlString - URL to validate
 * @returns {boolean}
 */
function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * Remove duplicate URLs from array (PHASE V1)
 * @param {Array} urls - Array of URL objects
 * @returns {Array} Deduplicated array
 */
function deduplicateUrls(urls) {
  const seen = new Set();
  return urls.filter(item => {
    if (seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
}

/**
 * Extract domain from URL (PHASE V2)
 * @param {string} urlString - Full URL
 * @returns {string} Domain name
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
 * Group URLs by domain (PHASE V2)
 * @param {Array} urls - Array of URL objects
 * @returns {Object} URLs grouped by domain
 */
function groupUrlsByDomain(urls) {
  const grouped = {};
  
  urls.forEach(urlObj => {
    const domain = extractDomain(urlObj.url);
    if (!grouped[domain]) {
      grouped[domain] = [];
    }
    grouped[domain].push(urlObj);
  });
  
  return grouped;
}

/**
 * Check if URL is external (different domain from current page)
 * @param {string} urlString - URL to check
 * @returns {boolean}
 */
function isExternalUrl(urlString) {
  try {
    const url = new URL(urlString);
    const currentDomain = window.location.hostname;
    
    // Remove www. for comparison
    const urlDomain = url.hostname.replace(/^www\./, '');
    const currentDomainClean = currentDomain.replace(/^www\./, '');
    
    return urlDomain !== currentDomainClean;
  } catch (e) {
    return false;
  }
}

/**
 * Check if URL is a same-page anchor link
 * @param {string} urlString - URL to check
 * @returns {boolean}
 */
function isSamePageAnchor(urlString) {
  try {
    const url = new URL(urlString);
    const currentUrl = new URL(window.location.href);
    
    // Check if same page (only hash is different)
    return url.hostname === currentUrl.hostname &&
           url.pathname === currentUrl.pathname &&
           url.search === currentUrl.search &&
           url.hash !== '';
  } catch (e) {
    return false;
  }
}

/**
 * Filter URLs to only external links
 * @param {Array} urls - Array of URL objects
 * @returns {Array} Filtered array with only external URLs
 */
function filterExternalUrls(urls) {
  return urls.filter(urlObj => {
    // Skip same-page anchors (#section)
    if (isSamePageAnchor(urlObj.url)) {
      return false;
    }
    
    // Only include external URLs
    return isExternalUrl(urlObj.url);
  });
}

/**
 * Get all URLs from the page (combines clickable and plain text)
 * @param {boolean} externalOnly - If true, only return external URLs
 * @returns {Array} All detected URLs
 */
function getAllUrls(externalOnly = false) {
  const clickable = extractClickableUrls();
  const plainText = extractPlainTextUrls();
  const combined = [...clickable, ...plainText];
  const deduplicated = deduplicateUrls(combined);
  
  // Filter to external only if requested
  if (externalOnly) {
    return filterExternalUrls(deduplicated);
  }
  
  return deduplicated;
}
