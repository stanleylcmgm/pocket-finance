# AdMob Verification Guide - Using GitHub Pages

This guide will help you verify your AdMob app by hosting the `app-ads.txt` file on GitHub Pages.

## ✅ What You Need

1. A public GitHub repository (you already have this)
2. The `app-ads.txt` file (already created in this repo)
3. Access to Google Play Console to add your developer website

## 📋 Step-by-Step Instructions

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch**: `main` (or `master` if that's your default branch)
   - **Folder**: `/ (root)` or `/docs` (if you prefer)
5. Click **Save**

### Step 2: Verify GitHub Pages is Active

1. Wait 1-2 minutes for GitHub to build your site
2. Your site will be available at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```
   For example: `https://stanleylcmgm.github.io/star/`

3. Test that your `app-ads.txt` file is accessible:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/app-ads.txt
   ```
   You should see the content: `google.com, pub-2240821992848494, DIRECT, f08c47fec0942fa0`

### Step 3: Add Developer Website to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app: **Pocket Finance**
3. Go to **Store presence** → **Store listing** (left sidebar)
4. Scroll down to **App details** section
5. Find the **Website** field
6. Enter your GitHub Pages URL:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
   ```
   **Important**: Use the exact format shown above (no trailing slash)
7. Click **Save** at the top of the page
8. Wait for Google Play to process the update (may take a few minutes)

### Step 4: Verify in AdMob

1. Go back to [AdMob Console](https://apps.admob.com/)
2. Navigate to your app verification page
3. Click **Check for updates** button
4. AdMob will verify:
   - That the developer website exists in your Google Play listing
   - That `app-ads.txt` is accessible at the root of your website
   - That the file format is correct

### Step 5: Wait for Verification

- AdMob typically verifies within 24-48 hours
- You can check the status in the AdMob console
- Once verified, the verification status will update automatically

## 🔍 Troubleshooting

### Issue: GitHub Pages URL not working
- **Solution**: Make sure you enabled GitHub Pages in Settings → Pages
- Wait 2-3 minutes after enabling for the site to be built
- Check that your repository is public (required for free GitHub Pages)

### Issue: app-ads.txt not accessible
- **Solution**: 
  - Make sure the file is named exactly `app-ads.txt` (lowercase, with hyphen)
  - The file should be in the root of your repository (or in the `/docs` folder if you selected that option)
  - Try accessing it directly: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/app-ads.txt`

### Issue: Google Play Console not accepting the URL
- **Solution**:
  - Make sure the URL starts with `https://`
  - Don't include a trailing slash
  - The URL should be publicly accessible (test it in an incognito browser)

### Issue: AdMob still shows verification error
- **Solution**:
  - Wait 24-48 hours after adding the website to Google Play
  - Make sure the domain in Google Play matches exactly (case-sensitive)
  - Click "Check for updates" in AdMob after 24 hours
  - Verify the file is accessible: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/app-ads.txt`

## 📝 Important Notes

1. **Domain Matching**: The domain you enter in Google Play Console must match exactly what AdMob sees. GitHub Pages URLs are case-sensitive for the username part.

2. **File Location**: The `app-ads.txt` file must be at the root of your website:
   - ✅ Correct: `https://username.github.io/repo/app-ads.txt`
   - ❌ Wrong: `https://username.github.io/repo/folder/app-ads.txt`

3. **File Format**: The file should contain exactly:
   ```
   google.com, pub-2240821992848494, DIRECT, f08c47fec0942fa0
   ```
   (No extra spaces, no extra lines unless needed)

4. **Verification Time**: AdMob verification can take 24-48 hours. Be patient!

## ✅ Checklist

- [ ] GitHub Pages enabled in repository settings
- [ ] `app-ads.txt` file is in the repository root
- [ ] GitHub Pages URL is accessible (test in browser)
- [ ] `app-ads.txt` is accessible at root URL (test directly)
- [ ] Developer website added to Google Play Console
- [ ] Waited for Google Play to process the update
- [ ] Clicked "Check for updates" in AdMob
- [ ] Waiting for AdMob verification (24-48 hours)

## 🎯 Your Specific Details

- **Publisher ID**: `pub-2240821992848494`
- **App Package**: `com.stanleylcmgm.pocketfinance`
- **App Name**: Pocket Finance
- **GitHub Pages URL Format**: `https://YOUR_USERNAME.github.io/star/app-ads.txt`

Replace `YOUR_USERNAME` with your actual GitHub username!
