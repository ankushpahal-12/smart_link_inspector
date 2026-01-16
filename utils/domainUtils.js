/**
 * Domain utility functions
 * PHASE V2: Domain extraction and grouping
 * PHASE V3: Enhanced with security checks
 */

/**
 * Get domain display name (removes www.)
 * @param {string} domain - Full domain
 * @returns {string} Clean domain name
 */
function getDisplayDomain(domain) {
  return domain.replace(/^www\./, '');
}

/**
 * Check if domain is an IP address (PHASE V3)
 * @param {string} domain - Domain to check
 * @returns {boolean}
 */
function isIpAddress(domain) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  return ipv4Regex.test(domain) || ipv6Regex.test(domain);
}

/**
 * Check if domain is a URL shortener (PHASE V3)
 * @param {string} domain - Domain to check
 * @returns {boolean}
 */
function isUrlShortener(domain) {
  const cleanDomain = getDisplayDomain(domain);
  return URL_SHORTENERS.some(shortener => 
    cleanDomain === shortener || cleanDomain.endsWith('.' + shortener)
  );
}

/**
 * Get domain statistics
 * @param {Object} groupedUrls - URLs grouped by domain
 * @returns {Array} Array of domain stats
 */
function getDomainStats(groupedUrls) {
  return Object.keys(groupedUrls).map(domain => ({
    domain: domain,
    count: groupedUrls[domain].length,
    displayName: getDisplayDomain(domain)
  })).sort((a, b) => b.count - a.count);
}
