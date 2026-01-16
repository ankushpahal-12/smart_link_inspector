/**
 * URL Risk Analyzer
 * PHASE V3: Security analysis and risk scoring
 */

/**
 * Analyze a single URL for security risks
 * @param {Object} urlObj - URL object to analyze
 * @returns {Object} Analysis result with risk score
 */
function analyzeUrl(urlObj) {
  let riskScore = 0;
  const risks = [];
  
  try {
    const url = new URL(urlObj.url);
    const domain = url.hostname;
    const path = url.pathname + url.search;
    const fullUrl = urlObj.url.toLowerCase();
    
    // Check 1: Non-HTTPS (10 points)
    if (url.protocol !== 'https:') {
      riskScore += 10;
      risks.push('Non-HTTPS connection');
    }
    
    // Check 2: IP-based URL (30 points)
    if (isIpAddress(domain)) {
      riskScore += 30;
      risks.push('IP-based URL (suspicious)');
    }
    
    // Check 3: URL shortener (20 points)
    if (isUrlShortener(domain)) {
      riskScore += 20;
      risks.push('URL shortener (hidden destination)');
    }
    
    // Check 4: Phishing keywords (5 points each, max 30)
    let keywordCount = 0;
    PHISHING_KEYWORDS.forEach(keyword => {
      if (fullUrl.includes(keyword)) {
        keywordCount++;
        if (keywordCount <= 6) {
          riskScore += 5;
        }
      }
    });
    if (keywordCount > 0) {
      risks.push(`Contains ${keywordCount} suspicious keyword(s)`);
    }
    
    // Check 5: Suspicious TLD (10 points)
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top'];
    if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
      riskScore += 10;
      risks.push('Suspicious top-level domain');
    }
    
    // Check 6: Excessive subdomains (5 points)
    const subdomainCount = domain.split('.').length - 2;
    if (subdomainCount > 2) {
      riskScore += 5;
      risks.push('Multiple subdomains');
    }
    
    // Check 7: Long URL (5 points)
    if (fullUrl.length > 200) {
      riskScore += 5;
      risks.push('Unusually long URL');
    }
    
    // Check 8: Special characters in domain (10 points)
    if (/[^a-z0-9.-]/.test(domain)) {
      riskScore += 10;
      risks.push('Special characters in domain');
    }
    
    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);
    
    // Determine risk level
    let riskLevel = RISK_LEVELS.LOW;
    let riskLabel = RISK_SCORES.LOW.label;
    let riskColor = RISK_SCORES.LOW.color;
    
    if (riskScore >= RISK_SCORES.HIGH.min) {
      riskLevel = RISK_LEVELS.HIGH;
      riskLabel = RISK_SCORES.HIGH.label;
      riskColor = RISK_SCORES.HIGH.color;
    } else if (riskScore >= RISK_SCORES.MEDIUM.min) {
      riskLevel = RISK_LEVELS.MEDIUM;
      riskLabel = RISK_SCORES.MEDIUM.label;
      riskColor = RISK_SCORES.MEDIUM.color;
    }
    
    return {
      url: urlObj.url,
      riskScore,
      riskLevel,
      riskLabel,
      riskColor,
      risks,
      isHttps: url.protocol === 'https:',
      domain: domain,
      protocol: url.protocol
    };
    
  } catch (error) {
    return {
      url: urlObj.url,
      riskScore: 50,
      riskLevel: RISK_LEVELS.MEDIUM,
      riskLabel: 'Unable to analyze',
      riskColor: RISK_SCORES.MEDIUM.color,
      risks: ['Invalid URL format'],
      isHttps: false,
      domain: 'unknown',
      protocol: 'unknown'
    };
  }
}

/**
 * Analyze multiple URLs
 * @param {Array} urls - Array of URL objects
 * @returns {Array} Array of analysis results
 */
function analyzeUrls(urls) {
  return urls.map(urlObj => ({
    ...urlObj,
    analysis: analyzeUrl(urlObj)
  }));
}

/**
 * Get analysis summary statistics
 * @param {Array} analyzedUrls - Array of analyzed URLs
 * @returns {Object} Summary statistics
 */
function getAnalysisSummary(analyzedUrls) {
  const summary = {
    total: analyzedUrls.length,
    lowRisk: 0,
    mediumRisk: 0,
    highRisk: 0,
    httpsCount: 0,
    httpCount: 0
  };
  
  analyzedUrls.forEach(urlObj => {
    const analysis = urlObj.analysis;
    
    switch (analysis.riskLevel) {
      case RISK_LEVELS.LOW:
        summary.lowRisk++;
        break;
      case RISK_LEVELS.MEDIUM:
        summary.mediumRisk++;
        break;
      case RISK_LEVELS.HIGH:
        summary.highRisk++;
        break;
    }
    
    if (analysis.isHttps) {
      summary.httpsCount++;
    } else {
      summary.httpCount++;
    }
  });
  
  return summary;
}

// Helper functions (duplicated from domainUtils for background context)
function isIpAddress(domain) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  return ipv4Regex.test(domain) || ipv6Regex.test(domain);
}

function isUrlShortener(domain) {
  const cleanDomain = domain.replace(/^www\./, '');
  const shorteners = [
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
    'is.gd', 'buff.ly', 'adf.ly', 'short.link', 'tiny.cc'
  ];
  return shorteners.some(shortener => 
    cleanDomain === shortener || cleanDomain.endsWith('.' + shortener)
  );
}
