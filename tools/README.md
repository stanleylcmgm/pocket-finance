# Play Store Asset Generation Tools

This directory contains tools to help you generate assets for Google Play Store submission.

## Tools Available

### 1. Feature Graphic Generator (`generate-feature-graphic.html`)

An interactive HTML tool to create your 1024x500px feature graphic.

**How to use:**
1. Open `generate-feature-graphic.html` in your web browser
2. Customize the text, colors, and layout
3. Click "Download PNG" to save your feature graphic
4. Upload to Google Play Console

**Requirements:**
- 1024x500px (exactly)
- PNG format
- No text that needs translation (or provide translations)

### 2. Screenshot Guide (`SCREENSHOT_GUIDE.md`)

Complete guide on how to capture and prepare screenshots for Play Store.

**Includes:**
- Requirements and specifications
- Multiple methods to capture screenshots
- Tips for better screenshots
- Scripts for batch capture

## Quick Start

1. **Generate Feature Graphic:**
   ```bash
   # Open in browser
   open tools/generate-feature-graphic.html
   # Or on Windows
   start tools/generate-feature-graphic.html
   ```

2. **Capture Screenshots:**
   - Read `SCREENSHOT_GUIDE.md` for detailed instructions
   - Use your Android device or emulator
   - Follow the checklist in the guide

3. **Organize Assets:**
   ```
   play-store-assets/
   ├── feature-graphic.png (1024x500)
   ├── screenshots/
   │   ├── 01-home.png
   │   ├── 02-balance-sheet.png
   │   ├── 03-expenses.png
   │   ├── 04-assets.png
   │   └── 05-reports.png
   └── app-icon.png (512x512 - already have this)
   ```

## Need Help?

- Check the main `PLAY_STORE_PUBLISHING.md` guide
- Review Google Play Console requirements
- Ensure all images meet size and format requirements

