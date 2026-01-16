# ⚡ Quick Start Guide - Smart Link Inspector

## 🚀 Install in 2 Minutes

### Step 1: Load Extension
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select `smart-link-inspector` folder
5. Done! Icon appears in toolbar

### Step 2: First Use
1. Visit any webpage (try https://news.ycombinator.com)
2. Click extension icon
3. Click "Scan Page"
4. See all URLs with risk analysis!

---

## ✨ Key Features

### 1. Auto-Highlight All URLs
**Button:** 🎨 Highlight All (in footer)

**What it does:**
- Highlights ALL links on page
- Adds numbered badges (1, 2, 3...)
- Color-codes by risk:
  - 🟢 Green = Safe
  - 🟡 Orange = Caution
  - 🔴 Red = Danger

**Try it:** Click button → See all links highlighted!

### 2. Plain-Text URL Highlighting (NEW!)
**Button:** ✨ Highlight Text URLs (in footer)

**What it does:**
- Finds URLs written as plain text (not clickable)
- Highlights them with yellow background
- Hover to see action buttons

**Actions on hover:**
- 📋 Copy - Copy URL to clipboard
- 🔗 Open - Open in new tab
- ✨ Highlight - Flash bright yellow

**Buttons stay visible for 5 seconds!**

**Try it:**
1. Go to Wikipedia article
2. Scroll to "References" section
3. Click "✨ Highlight Text URLs"
4. Hover over any yellow URL
5. Click action buttons!

### 3. Other Features
- **Search:** Filter URLs by keyword
- **External Only:** Show only cross-domain links
- **Dark Mode:** Toggle with 🌙 icon
- **Export:** Save as CSV or JSON
- **Risk Analysis:** See security scores

---

## 📁 Folder Structure

```
smart-link-inspector/
├── manifest.json          # Config
├── content/               # Runs on webpages
│   ├── content.js        # URL detection
│   ├── highlighter.js    # Highlighting + plain-text
│   └── highlighter.css   # Styles
├── popup/                 # Extension UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── background/            # Analysis
│   ├── background.js
│   ├── urlAnalyzer.js
│   └── exporter.js
└── utils/                 # Helpers
    ├── constants.js
    ├── urlUtils.js
    └── ...
```

---

## 🧪 Test It

### Test Page
Create `test.html`:

```html
<!DOCTYPE html>
<html>
<body>
  <h1>Test Plain-Text URLs</h1>
  
  <p>Clickable: <a href="https://google.com">Google</a></p>
  <p>Plain text: https://example.com</p>
  <p>Multiple: https://site1.com and https://site2.com</p>
</body>
</html>
```

Open in Chrome and test!

---

## 🐛 Troubleshooting

**Extension not loading?**
- Check manifest.json syntax
- Remove and reload extension
- Close Chrome completely and reopen

**Plain-text URLs not highlighting?**
- Make sure they're NOT clickable links
- Check if page has plain-text URLs
- Try on Wikipedia references section

**Hover actions not appearing?**
- Hover directly on yellow text
- Wait a moment for buttons to appear
- Try on different website

---

## 📚 Full Documentation

- **README.md** - Complete feature guide
- **IMPLEMENTATION.md** - Step-by-step implementation
- **PLAIN-TEXT-URL-FEATURE.md** - Plain-text feature details
- **TESTING-PLAIN-TEXT-URLS.md** - Testing guide

---

## 🎯 Quick Reference

### Buttons

| Button | Icon | Action |
|--------|------|--------|
| Scan Page | 🔄 | Detect URLs |
| Highlight All | 🎨 | Auto-highlight |
| Highlight Text URLs | ✨ | Plain-text URLs |
| External Only | 🌍 | Filter external |
| Dark Mode | 🌙 | Toggle theme |
| Export | 📥 | Save to file |

### Colors

| Color | Meaning |
|-------|---------|
| 🟢 Green | Low Risk |
| 🟡 Orange | Medium Risk |
| 🔴 Red | High Risk |
| 🟨 Yellow | Plain-text URL |

---

**That's it! Start scanning URLs! 🚀**
