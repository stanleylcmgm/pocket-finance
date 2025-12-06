# Screenshot Guide for Play Store

This guide will help you capture high-quality screenshots of your Pocket Finance app for the Google Play Store.

## Requirements

- **Minimum**: 2 screenshots
- **Recommended**: 4-8 screenshots
- **Aspect Ratio**: 16:9 or 9:16
- **Minimum Size**: 320px (shortest side)
- **Maximum Size**: 3840px (longest side)
- **Format**: PNG or JPEG (24-bit)

## Recommended Screenshots

Based on your app's features, here are the recommended screenshots to capture:

### 1. Home Screen (Dashboard)
- Shows the financial overview with stats
- Displays the main navigation menu
- Highlights the app's clean UI

### 2. Balance Sheet Screen
- Shows monthly income and expenses
- Displays the summary cards (Income, Expenses, Balance)
- Demonstrates transaction management

### 3. Expenses Tracking Screen
- Shows daily expense tracking
- Displays expense categories
- Highlights the expense list view

### 4. Asset Management Screen
- Shows asset portfolio
- Displays different asset types
- Demonstrates asset tracking features

### 5. Reports/Analytics Screen
- Shows financial reports
- Displays charts and analytics
- Highlights data visualization

## How to Capture Screenshots

### Method 1: Using Android Device (Recommended)

1. **Build and install your app** on a physical Android device:
   ```bash
   eas build --profile preview --platform android
   ```
   Or use local build:
   ```bash
   npx expo run:android
   ```

2. **Navigate to each screen** in your app

3. **Take screenshot**:
   - **Most Android devices**: Press `Power + Volume Down` simultaneously
   - **Samsung devices**: Press `Power + Home` or swipe palm across screen
   - **Some devices**: Use the screenshot option in the notification panel

4. **Screenshots are saved** to:
   - `/Pictures/Screenshots/` or
   - `/DCIM/Screenshots/`

### Method 2: Using Android Emulator

1. **Start Android Emulator**:
   ```bash
   # If using Android Studio
   # Tools → Device Manager → Start emulator
   ```

2. **Run your app**:
   ```bash
   npx expo run:android
   ```

3. **Take screenshot**:
   - Click the camera icon in the emulator toolbar, OR
   - Press `Ctrl + S` (Windows/Linux) or `Cmd + S` (Mac)

4. **Screenshots are saved** to your computer

### Method 3: Using ADB (Android Debug Bridge)

1. **Connect your device** via USB with USB debugging enabled

2. **Navigate to the screen** you want to capture

3. **Take screenshot**:
   ```bash
   adb shell screencap -p /sdcard/screenshot.png
   adb pull /sdcard/screenshot.png ./screenshots/
   ```

4. **For multiple screenshots**, create a script:
   ```bash
   # screenshot.sh
   adb shell screencap -p /sdcard/screen1.png && adb pull /sdcard/screen1.png ./screenshots/
   ```

## Preparing Screenshots

### 1. Remove Status Bar (Optional but Recommended)

You can use image editing tools to remove the status bar for a cleaner look:

**Using Online Tools:**
- Remove.bg (for background removal)
- Canva (for editing)
- Photopea (free Photoshop alternative)

**Using Command Line (ImageMagick):**
```bash
# Install ImageMagick first
# Crop status bar (usually ~24-48px from top)
magick input.png -crop 1080x1920+0+48 output.png
```

### 2. Add Device Frame (Optional)

Some tools can add a device frame to make screenshots look more professional:

- **Screenshots.pro** (online tool)
- **Mockuphone.com** (online tool)
- **Device Frames** (Android Studio plugin)

### 3. Optimize Images

Before uploading, optimize your screenshots:

```bash
# Using ImageMagick to optimize
magick screenshot.png -quality 85 -strip screenshot-optimized.png

# Or use online tools like TinyPNG
```

## Screenshot Checklist

- [ ] Home Screen (Dashboard)
- [ ] Balance Sheet Screen
- [ ] Expenses Tracking Screen
- [ ] Asset Management Screen
- [ ] Reports/Analytics Screen
- [ ] All screenshots are in correct aspect ratio (16:9 or 9:16)
- [ ] All screenshots are at least 320px (shortest side)
- [ ] All screenshots are under 3840px (longest side)
- [ ] Screenshots show real data (not empty states)
- [ ] Screenshots are clear and readable
- [ ] No personal/sensitive information visible

## Tips for Better Screenshots

1. **Use Real Data**: Populate your app with sample data that looks realistic
2. **Show Key Features**: Highlight the most important features in each screenshot
3. **Consistent Theme**: Use the same theme/colors across all screenshots
4. **Clean UI**: Remove any debug buttons or test elements
5. **Good Lighting**: If using a physical device, ensure good lighting
6. **High Resolution**: Use a high-resolution device for best quality
7. **Portrait Orientation**: Since your app is portrait-only, use portrait screenshots

## Quick Script to Capture Multiple Screenshots

Create a file `capture-screenshots.sh`:

```bash
#!/bin/bash

# Create screenshots directory
mkdir -p screenshots

# Navigate to each screen and capture
echo "Navigate to Home screen and press Enter..."
read
adb shell screencap -p /sdcard/home.png
adb pull /sdcard/home.png screenshots/

echo "Navigate to Balance Sheet and press Enter..."
read
adb shell screencap -p /sdcard/balance.png
adb pull /sdcard/balance.png screenshots/

echo "Navigate to Expenses and press Enter..."
read
adb shell screencap -p /sdcard/expenses.png
adb pull /sdcard/expenses.png screenshots/

echo "Navigate to Assets and press Enter..."
read
adb shell screencap -p /sdcard/assets.png
adb pull /sdcard/assets.png screenshots/

echo "Navigate to Reports and press Enter..."
read
adb shell screencap -p /sdcard/reports.png
adb pull /sdcard/reports.png screenshots/

echo "All screenshots captured in ./screenshots/"
```

Make it executable:
```bash
chmod +x capture-screenshots.sh
```

## Next Steps

After capturing your screenshots:

1. Review them for quality and clarity
2. Optimize file sizes if needed
3. Organize them in a folder (e.g., `play-store-assets/screenshots/`)
4. Upload them to Google Play Console when creating your store listing

Good luck with your app launch! 🚀

