/**
 * URL Export functionality
 * PHASE V3: Export URLs to CSV and JSON formats
 */

/**
 * Export URLs to CSV format
 * @param {Array} urls - Array of URL objects with analysis
 * @param {Object} metadata - Page metadata
 * @returns {string} CSV content
 */
function exportToCSV(urls, metadata = {}) {
  const headers = [
    'URL',
    'Type',
    'Domain',
    'Risk Level',
    'Risk Score',
    'HTTPS',
    'Risks',
    'Link Text'
  ];
  
  let csv = headers.join(',') + '\n';
  
  // Add metadata as comments
  if (metadata.pageTitle) {
    csv = `# Page: ${metadata.pageTitle}\n` + csv;
  }
  if (metadata.pageUrl) {
    csv = `# Source: ${metadata.pageUrl}\n` + csv;
  }
  if (metadata.timestamp) {
    csv = `# Exported: ${new Date(metadata.timestamp).toISOString()}\n` + csv;
  }
  
  urls.forEach(urlObj => {
    const analysis = urlObj.analysis || {};
    const row = [
      escapeCSV(urlObj.url),
      escapeCSV(urlObj.type || 'unknown'),
      escapeCSV(analysis.domain || ''),
      escapeCSV(analysis.riskLabel || ''),
      analysis.riskScore || 0,
      analysis.isHttps ? 'Yes' : 'No',
      escapeCSV((analysis.risks || []).join('; ')),
      escapeCSV(urlObj.text || '')
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

/**
 * Export URLs to JSON format
 * @param {Array} urls - Array of URL objects with analysis
 * @param {Object} metadata - Page metadata
 * @returns {string} JSON content
 */
function exportToJSON(urls, metadata = {}) {
  const exportData = {
    metadata: {
      pageTitle: metadata.pageTitle || '',
      pageUrl: metadata.pageUrl || '',
      timestamp: metadata.timestamp || Date.now(),
      exportDate: new Date().toISOString(),
      totalUrls: urls.length
    },
    urls: urls.map(urlObj => ({
      url: urlObj.url,
      text: urlObj.text,
      type: urlObj.type,
      analysis: urlObj.analysis || {}
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Escape CSV special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeCSV(str) {
  if (typeof str !== 'string') {
    return str;
  }
  
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  
  return str;
}

/**
 * Create download blob and trigger download
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  }, (downloadId) => {
    // Clean up blob URL after download starts
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

/**
 * Export URLs in specified format
 * @param {Array} urls - URLs to export
 * @param {string} format - 'csv' or 'json'
 * @param {Object} metadata - Page metadata
 */
function exportUrls(urls, format, metadata = {}) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const pageTitle = (metadata.pageTitle || 'urls').replace(/[^a-z0-9]/gi, '_').slice(0, 30);
  
  let content, filename, mimeType;
  
  if (format === 'csv') {
    content = exportToCSV(urls, metadata);
    filename = `smart-link-inspector_${pageTitle}_${timestamp}.csv`;
    mimeType = 'text/csv';
  } else if (format === 'json') {
    content = exportToJSON(urls, metadata);
    filename = `smart-link-inspector_${pageTitle}_${timestamp}.json`;
    mimeType = 'application/json';
  } else {
    throw new Error('Unsupported export format');
  }
  
  triggerDownload(content, filename, mimeType);
}
