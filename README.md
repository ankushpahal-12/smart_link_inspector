# 🔍 Smart Link Inspector

A production-ready Chrome Extension (Manifest v3) that detects, analyzes, and inspects all URLs on any webpage with security analysis and export capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Phase Evolution](#phase-evolution)
- [Development](#development)
- [Security](#security)

---

## ✨ Features

### Phase V1 - Core MVP ✅
- ✅ Detect all clickable URLs (`<a href>`) from active webpage
- ✅ Remove duplicate URLs automatically
- ✅ Send detected URLs from content script to popup
- ✅ Display URLs in popup with:
  - Copy URL button
  - Open URL in new tab button
- ✅ Simple, clean UI
- ✅ Manifest Version 3 compliant
- ✅ ES6 JavaScript

### Phase V2 - UX & Productivity Enhancements ✅
- ✅ Detect non-clickable (plain-text) URLs using regex
- ✅ Group URLs by domain name
- ✅ Search/filter input in popup
- ✅ Highlight selected link on webpage when clicked in popup
- ✅ Live URL detection using MutationObserver (for dynamic pages)
- ✅ Dark mode toggle with persistent preference
- ✅ Modular code structure with clean separation of concerns
- ✅ **Auto-highlight all URLs** with numbered badges and color-coding
- ✅ **Plain-text URL highlighting** with interactive hover actions
- ✅ **External links filter** to show only cross-domain URLs

### Phase V3 - Smart & Security Features ✅
- ✅ URL risk analysis with safety score:
  - Detect IP-based URLs
  - Detect URL shorteners
  - Detect phishing keywords
  - Suspicious TLD detection
  - Long URL detection
- ✅ Classify links as Low/Medium/High Risk
- ✅ Show HTTPS status
- ✅ Show link preview metadata (domain + title)
- ✅ Export detected URLs to CSV and JSON
- ✅ Background service worker for analysis & exports
- ✅ Comprehensive risk scoring system

---

## 🚀 Installation

### Load Extension in Chrome

1. **Download or Clone** this repository:
   ```bash
   git clone https://github.com/ankushpahal-12/smart_link_inspector
   cd smart-link-inspector
   ```

2. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load Unpacked Extension**:
   - Click "Load unpacked" button
   - Select the `smart-link-inspector` folder
   - The extension icon should appear in your toolbar

5. **Pin Extension** (Optional):
   - Click the puzzle icon in Chrome toolbar
   - Find "Smart Link Inspector"
   - Click the pin icon to keep it visible

---

## 📖 Usage

### Basic Usage (Phase V1)

1. **Navigate** to any webpage
2. **Click** the Smart Link Inspector icon in your toolbar
3. **Click** "Scan Page" button
4. **View** all detected URLs in the popup
5. **Actions** available for each URL:
   - 📋 Copy URL to clipboard
   - 🔗 Open URL in new tab

### Advanced Features (Phase V2)

#### Search & Filter
- Use the search box to filter URLs by domain or text
- Clear search with the ✕ button

#### View Modes
- **List View** (📋): See all URLs in a flat list
- **Group View** (📁): URLs organized by domain
  - Click domain headers to expand/collapse groups

#### Dark Mode
- Click the 🌙/☀️ icon to toggle dark mode
- Preference is saved automatically

#### Link Highlighting
- Click the 👁️ button next to any URL
- The link will be highlighted on the webpage
- Page scrolls to show the highlighted link

#### Live Detection
- URLs are automatically detected as the page changes
- Watch the "Live Detection" indicator in the footer
- New URLs appear automatically without re-scanning

#### Auto-Highlight All URLs (ENHANCED)
- Click "🎨 Highlight All" button in the footer
- All URLs on the page are highlighted with:
  - **Numbered badges** (1, 2, 3...) for easy reference
  - **Color-coded by risk level**:
    - 🟢 Green = Low Risk
    - 🟡 Orange = Medium Risk
    - 🔴 Red = High Risk
    - 🔵 Blue = Default
- Click "Hide Highlights" to remove all highlights
- Perfect for visual scanning of all links on a page

#### Plain-Text URL Highlighting (NEW)
Detect and interact with URLs that are written as plain text (not clickable links):

1. **Enable Feature**:
   - Click "✨ Highlight Text URLs" button in the footer
   - All plain-text URLs highlighted with **yellow background**
   - Clickable links are NOT highlighted (smart detection)

2. **Hover Actions**:
   - Hover over any yellow-highlighted URL
   - Action buttons appear and stay visible for **5 seconds**
   - Three actions available:
     - **📋 Copy** - Copy URL to clipboard
     - **🔗 Open** - Open URL in new tab
     - **✨ Highlight** - Flash bright yellow for 2 seconds

3. **Visual Feedback**:
   - Toast notifications appear on page for each action
   - "✅ URL copied to clipboard"
   - "🔗 Opening URL in new tab"
   - "✨ URL highlighted"

4. **Disable Feature**:
   - Click "Hide Text URLs" to remove all highlights
   - Page returns to normal

**Use Cases**:
- Copy URLs from articles that don't make them clickable
- Quick access to reference URLs in research papers
- Extract URLs from screenshots or PDF text
- Verify URL mentions in documentation

#### External Links Filter
- Click "🌍 External Only" button
- Shows only URLs from different domains
- Useful for finding outbound links
- Combines with search filter

### Security Analysis (Phase V3)

#### Risk Levels
Each URL is analyzed and assigned a risk level:

- **🟢 Low Risk (0-30)**: Safe URLs with HTTPS and no suspicious patterns
- **🟡 Medium Risk (31-60)**: URLs with minor concerns (HTTP, shorteners)
- **🔴 High Risk (61-100)**: URLs with multiple red flags

#### Risk Factors Detected
- Non-HTTPS connections
- IP-based URLs (suspicious)
- URL shorteners (hidden destination)
- Phishing keywords (login, verify, account, etc.)
- Suspicious top-level domains (.tk, .ml, .ga, etc.)
- Multiple subdomains
- Unusually long URLs
- Special characters in domain

#### Statistics Dashboard
View summary statistics at the top:
- Total URLs detected
- Count by risk level (Low/Medium/High)

### Export Features (Phase V3)

#### Export to CSV
1. Click the "Export" button
2. Select "Export as CSV"
3. Choose save location
4. File includes:
   - All URL data
   - Risk analysis
   - Page metadata
   - Timestamp

#### Export to JSON
1. Click the "Export" button
2. Select "Export as JSON"
3. Choose save location
4. Structured JSON with:
   - Complete metadata
   - Full analysis results
   - Easy to parse programmatically

---

## 🏗️ Architecture

### Folder Structure

```
smart-link-inspector/
├── manifest.json                      # Extension configuration (Manifest V3)
│
├── assets/
│   └── icons/                         # Extension icons
│       ├── icon16.png                 # 16x16 toolbar icon
│       ├── icon48.png                 # 48x48 extension management
│       └── icon128.png                # 128x128 Chrome Web Store
│
├── content/                           # Content scripts (run on webpages)
│   ├── content.js                     # Main content script - URL detection
│   ├── observer.js                    # MutationObserver - live detection
│   ├── highlighter.js                 # Link highlighting + plain-text URLs
│   └── highlighter.css                # Highlight styles + hover actions
│
├── popup/                             # Extension popup UI
│   ├── popup.html                     # Popup structure
│   ├── popup.js                       # Popup logic and event handlers
│   ├── popup.css                      # Popup styles (light + dark mode)
│   └── components/                    # Future component modules
│
├── background/                        # Background service worker
│   ├── background.js                  # Service worker - message router
│   ├── urlAnalyzer.js                 # Risk analysis engine
│   └── exporter.js                    # CSV/JSON export functionality
│
├── utils/                             # Shared utilities
│   ├── urlUtils.js                    # URL extraction and validation
│   ├── domainUtils.js                 # Domain parsing utilities
│   ├── storage.js                     # Chrome storage helpers
│   └── constants.js                   # Shared constants and config
│
├── styles/                            # Global styles (future use)
│   ├── theme.css                      # Theme variables
│   └── variables.css                  # CSS variables
│
├── README.md                          # Main documentation (this file)
├── PLAIN-TEXT-URL-FEATURE.md          # Plain-text URL feature guide
└── TESTING-PLAIN-TEXT-URLS.md         # Testing guide for plain-text URLs
```

### Component Communication

```
┌─────────────┐
│   Popup     │ ←→ User Interface
└──────┬──────┘
       │
       ├─→ chrome.tabs.sendMessage()
       │
┌──────▼──────────┐
│ Content Script  │ ←→ Webpage DOM
└──────┬──────────┘
       │
       ├─→ chrome.runtime.sendMessage()
       │
┌──────▼──────────┐
│   Background    │ ←→ Analysis & Export
│ Service Worker  │
└─────────────────┘
```

### Message Flow

1. **Popup → Content Script**: Request URL scan
2. **Content Script → Popup**: Return detected URLs
3. **Popup → Background**: Request analysis
4. **Background → Popup**: Return analysis results
5. **Content Script → Popup**: Live update notifications

---

## 🔄 Phase Evolution

### Phase V1 → V2 Evolution

**What Changed:**
- Added `observer.js` for live detection
- Added `highlighter.js` for visual feedback
- Enhanced `urlUtils.js` with regex-based plain text detection
- Added `storage.js` for preference management
- Enhanced popup UI with search and view modes
- Added dark mode support

**Backward Compatibility:**
- All V1 features remain functional
- Core URL detection unchanged
- Message types extended, not replaced

### Phase V2 → V3 Evolution

**What Changed:**
- Added `background/` folder with service worker
- Added `urlAnalyzer.js` for security analysis
- Added `exporter.js` for file exports
- Enhanced popup with risk indicators
- Added statistics dashboard
- Added export functionality

**Backward Compatibility:**
- All V1 and V2 features remain functional
- Analysis is optional enhancement
- Graceful fallback if analysis fails

---

## � Compelete Implementation Guide

### Step-by-Step Setup

#### 1. Prerequisites
- Google Chrome browser (version 88+)
- Basic understanding of Chrome Extensions
- Text editor or IDE
- Git (optional, for cloning)

#### 2. File Structure Setup

Create the following folder structure:

```bash
mkdir smart-link-inspector
cd smart-link-inspector

# Create folders
mkdir assets assets/icons
mkdir content
mkdir popup popup/components
mkdir background
mkdir utils
mkdir styles
```

#### 3. Core Files Implementation

**A. manifest.json** (Extension Configuration)
```json
{
  "manifest_version": 3,
  "name": "Smart Link Inspector",
  "version": "3.0.0",
  "description": "Detect, analyze, and inspect all URLs on any webpage",
  "permissions": ["activeTab", "scripting", "storage"],
  "host_permissions": ["<all_urls>"],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "assets/icons/icon16.png",
      "48": "assets/icons/icon48.png",
      "128": "assets/icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background/background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": [
        "utils/constants.js",
        "utils/urlUtils.js",
        "content/highlighter.js",
        "content/observer.js",
        "content/content.js"
      ],
      "css": ["content/highlighter.css"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "assets/icons/icon16.png",
    "48": "assets/icons/icon48.png",
    "128": "assets/icons/icon128.png"
  }
}
```

**B. Content Scripts** (Run on webpages)

1. **utils/constants.js** - Shared constants
   - Message types for communication
   - Risk levels and scores
   - Phishing keywords
   - URL shortener domains

2. **utils/urlUtils.js** - URL utilities
   - Extract URLs from DOM
   - Validate URL format
   - Filter duplicates
   - Detect plain-text URLs with regex

3. **content/content.js** - Main content script
   - Listen for scan requests from popup
   - Extract all URLs from page
   - Send URLs back to popup
   - Initialize observer for live detection

4. **content/observer.js** - Live detection
   - MutationObserver setup
   - Watch for DOM changes
   - Detect new URLs dynamically
   - Notify popup of updates

5. **content/highlighter.js** - Visual feedback
   - Highlight individual links (eye button)
   - Auto-highlight all URLs with badges
   - Plain-text URL detection and wrapping
   - Hover actions (Copy, Open, Highlight)
   - Toast notifications on page

6. **content/highlighter.css** - Styles
   - Highlight colors and animations
   - Numbered badge styles
   - Yellow plain-text highlighting
   - Hover action button styles
   - Toast notification styles

**C. Popup UI** (Extension interface)

1. **popup/popup.html** - Structure
   - Header with title and dark mode toggle
   - Statistics bar (risk summary)
   - Search box and filters
   - Action buttons (Scan, Export, External Only)
   - View toggle (List/Group)
   - URL container (list and group views)
   - Footer with controls:
     - URL count
     - "🎨 Highlight All" button
     - "✨ Highlight Text URLs" button
     - Live detection indicator
   - Toast notification element

2. **popup/popup.js** - Logic
   - State management (URLs, filters, modes)
   - Event listeners for all buttons
   - Scan page functionality with auto-injection
   - Search and filter logic
   - View switching (list/group)
   - Dark mode toggle
   - Auto-highlight toggle
   - Plain-text highlight toggle
   - External-only filter
   - Export functionality
   - Toast notifications

3. **popup/popup.css** - Styles
   - Light and dark mode themes
   - Responsive layout
   - Button styles and hover effects
   - URL item cards with badges
   - Risk level color coding
   - Loading and empty states
   - Toast animations

**D. Background Service Worker**

1. **background/background.js** - Message router
   - Listen for messages from popup/content
   - Route to appropriate handlers
   - Coordinate analysis and export

2. **background/urlAnalyzer.js** - Risk analysis
   - Multi-factor scoring algorithm
   - Detect IP-based URLs
   - Detect URL shorteners
   - Check for phishing keywords
   - Analyze domain structure
   - Calculate risk score (0-100)
   - Classify as Low/Medium/High

3. **background/exporter.js** - File export
   - Generate CSV format
   - Generate JSON format
   - Create download blob
   - Trigger browser download

**E. Utility Modules**

1. **utils/domainUtils.js** - Domain parsing
   - Extract domain from URL
   - Parse TLD
   - Count subdomains
   - Detect suspicious TLDs

2. **utils/storage.js** - Storage helpers
   - Save/load preferences
   - Dark mode state
   - Last scan data

#### 4. Key Features Implementation

**Feature 1: Auto-Highlight All URLs**

Location: `content/highlighter.js`

```javascript
function autoHighlightAllUrls(urls) {
  // Remove existing highlights
  removeAutoHighlights();
  
  // For each URL:
  // 1. Find matching <a> element
  // 2. Add highlight class
  // 3. Set color based on risk level
  // 4. Create numbered badge
  // 5. Append badge to element
}
```

Trigger: Click "🎨 Highlight All" button in popup footer

**Feature 2: Plain-Text URL Highlighting**

Location: `content/highlighter.js`

```javascript
function highlightPlainTextUrls() {
  // 1. Use TreeWalker to find all text nodes
  // 2. Skip <a>, <script>, <style> tags
  // 3. Match URLs with regex
  // 4. Wrap each URL in <span> with yellow background
  // 5. Attach hover action buttons
  // 6. Add event listeners (copy, open, highlight)
}
```

Regex Pattern:
```javascript
/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
```

Hover Actions:
- Appear on mouseenter
- Stay visible for 5 seconds
- Reset timer when hovering over buttons
- Show toast notification on click

**Feature 3: Risk Analysis**

Location: `background/urlAnalyzer.js`

Scoring factors:
- Non-HTTPS: +10 points
- IP-based URL: +30 points
- URL shortener: +20 points
- Phishing keywords: +5 each (max 30)
- Suspicious TLD: +10 points
- Multiple subdomains: +5 points
- Long URL (>200 chars): +5 points
- Special characters: +10 points

Classification:
- 0-30: Low Risk (Green)
- 31-60: Medium Risk (Orange)
- 61-100: High Risk (Red)

**Feature 4: Export to CSV/JSON**

Location: `background/exporter.js`

CSV Format:
```csv
URL,Type,Risk Level,Risk Score,HTTPS,Domain,Timestamp
https://example.com,clickable,low,15,true,example.com,2024-01-16T10:30:00Z
```

JSON Format:
```json
{
  "metadata": {
    "pageTitle": "Example Page",
    "pageUrl": "https://example.com",
    "timestamp": "2024-01-16T10:30:00Z",
    "totalUrls": 10
  },
  "urls": [
    {
      "url": "https://example.com",
      "type": "clickable",
      "analysis": {
        "riskLevel": "low",
        "riskScore": 15,
        "isHttps": true
      }
    }
  ]
}
```

#### 5. Message Communication Flow

**Scan Page Flow:**
```
1. User clicks "Scan Page" in popup
   ↓
2. popup.js sends message to content script
   chrome.tabs.sendMessage(tabId, { type: 'GET_URLS' })
   ↓
3. content.js extracts URLs from DOM
   ↓
4. content.js sends URLs back to popup
   sendResponse({ urls: [...], pageTitle, pageUrl })
   ↓
5. popup.js sends URLs to background for analysis
   chrome.runtime.sendMessage({ type: 'ANALYZE_URLS', urls })
   ↓
6. background.js analyzes each URL
   ↓
7. background.js returns analyzed URLs
   sendResponse({ success: true, urls: [...], summary })
   ↓
8. popup.js displays URLs with risk indicators
```

**Auto-Highlight Flow:**
```
1. User clicks "Highlight All" in popup
   ↓
2. popup.js sends message to content script
   chrome.tabs.sendMessage(tabId, { 
     type: 'AUTO_HIGHLIGHT_URLS',
     urls: allUrls 
   })
   ↓
3. highlighter.js highlights all URLs
   - Adds colored outlines
   - Adds numbered badges
   ↓
4. User sees highlighted links on page
```

**Plain-Text URL Flow:**
```
1. User clicks "Highlight Text URLs" in popup
   ↓
2. popup.js sends message to content script
   chrome.tabs.sendMessage(tabId, { 
     type: 'HIGHLIGHT_PLAIN_TEXT_URLS'
   })
   ↓
3. highlighter.js finds plain-text URLs
   - Uses TreeWalker + regex
   - Wraps in <span> with yellow background
   - Attaches hover action buttons
   ↓
4. User hovers over yellow URL
   ↓
5. Action buttons appear (stay 5 seconds)
   ↓
6. User clicks action (Copy/Open/Highlight)
   ↓
7. Toast notification appears on page
```

#### 6. Testing Checklist

**Basic Functionality:**
- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Popup opens when clicked
- [ ] Scan button works
- [ ] URLs detected and displayed
- [ ] Copy button copies URL
- [ ] Open button opens new tab
- [ ] Eye button highlights link on page

**Advanced Features:**
- [ ] Search filter works
- [ ] External-only filter works
- [ ] List/Group view toggle works
- [ ] Dark mode toggle works
- [ ] Dark mode preference persists
- [ ] Live detection works on dynamic pages
- [ ] Risk analysis shows correct levels
- [ ] Statistics dashboard updates
- [ ] Export to CSV works
- [ ] Export to JSON works

**Auto-Highlight:**
- [ ] "Highlight All" button appears after scan
- [ ] All URLs highlighted with colored outlines
- [ ] Numbered badges appear (1, 2, 3...)
- [ ] Colors match risk levels
- [ ] "Hide Highlights" removes all highlights

**Plain-Text URLs:**
- [ ] "Highlight Text URLs" button appears
- [ ] Plain-text URLs highlighted yellow
- [ ] Clickable links NOT highlighted
- [ ] Hover shows action buttons
- [ ] Buttons stay visible for 5 seconds
- [ ] Copy button copies URL
- [ ] Open button opens new tab
- [ ] Highlight button flashes bright yellow
- [ ] Toast notifications appear on page
- [ ] "Hide Text URLs" removes highlights

**Edge Cases:**
- [ ] Works on pages with no URLs
- [ ] Works on pages with 100+ URLs
- [ ] Works on dynamically loaded content
- [ ] Works on single-page applications
- [ ] Handles malformed URLs gracefully
- [ ] No console errors
- [ ] No memory leaks

#### 7. Troubleshooting

**Issue: Extension not loading**
- Check manifest.json syntax
- Verify all file paths are correct
- Check Chrome DevTools for errors
- Try removing and reloading extension

**Issue: Content script not injecting**
- Check host_permissions in manifest
- Verify content_scripts configuration
- Try refreshing the webpage
- Check for CSP restrictions

**Issue: Popup not communicating with content script**
- Check chrome.tabs.sendMessage syntax
- Verify message types match constants
- Add console.log for debugging
- Check for async/await issues

**Issue: Plain-text URLs not highlighting**
- Check regex pattern
- Verify TreeWalker configuration
- Check for conflicting CSS
- Inspect DOM in DevTools

**Issue: Hover actions not appearing**
- Check z-index values
- Verify event listeners attached
- Check CSS positioning
- Test on different websites

#### 8. Performance Optimization

**Best Practices:**
- Use debouncing for MutationObserver
- Cache URL results to avoid re-scanning
- Lazy render URLs (virtual scrolling for 100+)
- Minimize DOM queries
- Use event delegation
- Avoid memory leaks (remove listeners)

**Memory Management:**
- Clear highlights when not needed
- Remove event listeners on cleanup
- Use WeakMap for element references
- Limit stored data size

#### 9. Security Considerations

**Content Security Policy:**
- No inline scripts
- No eval() usage
- No external resources
- Sanitize all user input

**Permissions:**
- Request minimal permissions
- Explain each permission clearly
- Use activeTab instead of tabs
- Limit host_permissions if possible

**Data Privacy:**
- No data sent to external servers
- All processing done locally
- No tracking or analytics
- Clear privacy policy

#### 10. Deployment

**Before Publishing:**
1. Test on multiple websites
2. Test all features thoroughly
3. Check for console errors
4. Optimize file sizes
5. Add proper icons (16, 48, 128)
6. Write clear description
7. Add screenshots
8. Create privacy policy
9. Set appropriate version number
10. Test in incognito mode

**Chrome Web Store:**
1. Create developer account
2. Pay one-time fee ($5)
3. Upload ZIP file
4. Fill out store listing
5. Submit for review
6. Wait for approval (1-3 days)

---

## 🔧 Development

### Code Structure

#### Content Scripts
- **content.js**: Main entry point, coordinates URL detection from DOM
- **observer.js**: MutationObserver watches DOM for dynamic changes
- **highlighter.js**: Visual feedback for links + plain-text URL detection
  - Auto-highlight all URLs with numbered badges
  - Plain-text URL detection with regex
  - Hover actions (Copy, Open, Highlight)
  - Toast notifications on page
- **highlighter.css**: Styles for highlights, badges, hover actions, toasts

#### Popup
- **popup.js**: UI controller, handles all user interactions
- **popup.html**: Semantic HTML structure
- **popup.css**: Responsive styles with CSS variables

#### Background
- **background.js**: Service worker, message router
- **urlAnalyzer.js**: Risk scoring algorithm
- **exporter.js**: File generation and download

#### Utils
- **urlUtils.js**: URL extraction and validation
- **domainUtils.js**: Domain parsing and analysis
- **storage.js**: Chrome storage abstraction
- **constants.js**: Shared configuration

### Best Practices Followed

#### Security
- ✅ Manifest V3 compliance
- ✅ Minimal permissions requested
- ✅ Content Security Policy compliant
- ✅ No eval() or inline scripts
- ✅ Input sanitization (escapeHtml)
- ✅ XSS prevention

#### Performance
- ✅ Debounced MutationObserver
- ✅ Efficient DOM queries
- ✅ Cached URL results
- ✅ Lazy rendering
- ✅ Minimal reflows

#### Code Quality
- ✅ ES6+ modern JavaScript
- ✅ Clear function documentation
- ✅ Separation of concerns
- ✅ DRY principles
- ✅ Error handling
- ✅ Consistent naming conventions

#### UX
- ✅ Loading states
- ✅ Empty states
- ✅ Error states
- ✅ Visual feedback
- ✅ Keyboard accessibility
- ✅ Responsive design

---

## 🔒 Security

### Risk Analysis Algorithm

The extension uses a multi-factor scoring system:

| Factor | Points | Description |
|--------|--------|-------------|
| Non-HTTPS | 10 | Unencrypted connection |
| IP-based URL | 30 | Direct IP instead of domain |
| URL Shortener | 20 | Hidden destination |
| Phishing Keywords | 5 each | Suspicious terms (max 30) |
| Suspicious TLD | 10 | High-risk domains |
| Multiple Subdomains | 5 | Complex domain structure |
| Long URL | 5 | Over 200 characters |
| Special Characters | 10 | Non-standard domain chars |

**Total Score**: 0-100 (capped)
- **0-30**: Low Risk 🟢
- **31-60**: Medium Risk 🟡
- **61-100**: High Risk 🔴

### Privacy

- ✅ No data sent to external servers
- ✅ All analysis performed locally
- ✅ No tracking or analytics
- ✅ No personal data collection
- ✅ Storage limited to preferences

### Permissions Explained

- **activeTab**: Access current tab's content
- **scripting**: Inject content scripts
- **storage**: Save user preferences
- **host_permissions**: Scan any webpage

---

## 📝 License

This project is provided as-is for educational and production use.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Maintain backward compatibility
2. Follow existing code style
3. Add comments for complex logic
4. Test all three phases
5. Update README if needed

---

## 📞 Support

For issues or questions:
1. Check the README thoroughly
2. Review code comments
3. Test in Chrome DevTools
4. Check console for errors

---

## 🎯 Future Enhancements

Potential V4 features:
- URL reputation API integration
- Custom risk rules
- Bulk actions (copy all, open all)
- URL history tracking
- Whitelist/blacklist management
- Browser notification for high-risk URLs
- Multi-language support
- Accessibility improvements
- QR code generation for URLs
- URL preview on hover
- Keyboard shortcuts
- Custom highlight colors
- Auto-convert plain-text to clickable links

---

## 📚 Quick Reference

### Keyboard Shortcuts (Future)
- `Ctrl+Shift+S` - Scan page
- `Ctrl+Shift+H` - Toggle highlights
- `Ctrl+Shift+T` - Toggle plain-text highlights
- `Ctrl+Shift+E` - Export URLs

### Button Reference

| Button | Icon | Action | Location |
|--------|------|--------|----------|
| Scan Page | 🔄 | Detect all URLs | Header |
| Dark Mode | 🌙/☀️ | Toggle theme | Header |
| Export | 📥 | Export to CSV/JSON | Header |
| External Only | 🌍 | Filter external links | Controls |
| List View | 📋 | Show flat list | Controls |
| Group View | 📁 | Group by domain | Controls |
| Copy | 📋 | Copy URL | URL item |
| Open | 🔗 | Open in new tab | URL item |
| Highlight | 👁️ | Highlight on page | URL item |
| Highlight All | 🎨 | Auto-highlight all | Footer |
| Highlight Text URLs | ✨ | Highlight plain-text | Footer |

### Color Coding

| Color | Risk Level | Score Range |
|-------|------------|-------------|
| 🟢 Green | Low Risk | 0-30 |
| 🟡 Orange | Medium Risk | 31-60 |
| 🔴 Red | High Risk | 61-100 |
| 🔵 Blue | Default | No analysis |
| 🟨 Yellow | Plain-text URL | N/A |

### File Size Reference

| File | Lines | Purpose |
|------|-------|---------|
| manifest.json | ~50 | Configuration |
| content.js | ~150 | URL detection |
| observer.js | ~100 | Live detection |
| highlighter.js | ~450 | Highlighting + plain-text |
| highlighter.css | ~150 | Styles |
| popup.html | ~100 | UI structure |
| popup.js | ~600 | UI logic |
| popup.css | ~500 | UI styles |
| background.js | ~100 | Message router |
| urlAnalyzer.js | ~200 | Risk analysis |
| exporter.js | ~150 | Export |
| urlUtils.js | ~150 | URL utilities |
| domainUtils.js | ~100 | Domain utilities |
| storage.js | ~50 | Storage helpers |
| constants.js | ~80 | Constants |

**Total:** ~2,800 lines of code

---

## 🎓 Learning Resources

### Chrome Extension Development
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Content Scripts Guide](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Message Passing](https://developer.chrome.com/docs/extensions/mv3/messaging/)

### JavaScript & DOM
- [MDN Web Docs](https://developer.mozilla.org/)
- [MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [TreeWalker API](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker)
- [Regex Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

## 📞 Support & Contact

### Getting Help
1. Read this README thoroughly
2. Check PLAIN-TEXT-URL-FEATURE.md for feature details
3. Review TESTING-PLAIN-TEXT-URLS.md for testing
4. Check code comments in source files
5. Use Chrome DevTools for debugging
6. Check browser console for errors

### Reporting Issues
When reporting issues, include:
- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots (if applicable)

### Debug Mode
Enable debug logging:
```javascript
// In popup.js or content.js
const DEBUG = true;
if (DEBUG) console.log('Debug info:', data);
```

---

**Built with ❤️ for secure web browsing**

**Version:** 3.0.0  
**Last Updated:** January 2025  
**Manifest Version:** 3  
**Minimum Chrome Version:** 88+
