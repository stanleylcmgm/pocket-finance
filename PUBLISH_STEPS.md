# 🚀 Step-by-Step Guide: Publish to Google Play Store

Follow these steps in order to publish your Pocket Finance app to Google Play Store.

---

## ✅ PRE-FLIGHT CHECKLIST

Before starting, make sure you have:

- [ ] Google Play Console account ($25 one-time fee paid)
- [ ] Expo account (sign up at https://expo.dev)
- [ ] EAS CLI installed globally
- [ ] Privacy Policy URL ready (REQUIRED - your app uses AdMob)
- [ ] All store assets prepared (see Step 2)

---

## STEP 1: Install EAS CLI & Login

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login
```

**Expected output:** You'll be prompted to login via browser or enter credentials.

---

## STEP 2: Prepare Store Assets

### 2.1 Generate Feature Graphic

1. Open `tools/generate-feature-graphic.html` in your browser
2. Customize if needed (or use defaults)
3. Click "Download PNG"
4. Save as `play-store-assets/feature-graphic.png`

### 2.2 Capture Screenshots

Follow `tools/SCREENSHOT_GUIDE.md` to capture screenshots:

**Minimum Required:**
- [ ] Home Screen (Dashboard)
- [ ] Balance Sheet Screen
- [ ] At least 1 more screen (Expenses/Assets/Reports)

**Recommended:**
- [ ] Home Screen
- [ ] Balance Sheet
- [ ] Expenses Tracking
- [ ] Asset Management
- [ ] Reports/Analytics

**Save screenshots to:** `play-store-assets/screenshots/`

### 2.3 Prepare App Icon

You already have: `assets/icon.png` (512x512px)

**Verify:** Make sure it's exactly 512x512px PNG format.

### 2.4 Get App Descriptions

**Short Description** (80 chars):
```
Track income, expenses, and assets. Complete financial management made simple.
```

**Full Description:** Copy from `tools/APP_DESCRIPTIONS.md` (English version)

### 2.5 Privacy Policy URL

**⚠️ CRITICAL:** Your app uses AdMob, so you MUST have a privacy policy.

**Options:**
1. Host on your website
2. Use GitHub Pages (free)
3. Use a privacy policy generator (e.g., privacypolicygenerator.info)

**Must include:**
- Data collection practices
- AdMob/Google services usage
- User rights
- Contact information

---

## STEP 3: Build Production AAB

```bash
# Make sure you're in the project root
cd "C:\Users\Stanley Lam\source\repos\Star\star"

# Build production Android App Bundle
eas build --platform android --profile production
```

**What happens:**
1. EAS will ask about keystore (first time only)
   - Answer: **Yes** (let EAS manage it)
   - **IMPORTANT:** Save the keystore credentials securely!
2. Build will start in the cloud (15-30 minutes)
3. You'll get a download link when complete

**After build completes:**
1. Download the AAB file
2. Save it: `play-store-assets/pocket-finance-v1.0.0.aab`

**Note:** The build URL will be shown in terminal and sent to your email.

---

## STEP 4: Set Up Google Play Console

### 4.1 Create Your App

1. Go to https://play.google.com/console
2. Click **"Create app"** (top right)
3. Fill in the form:
   - **App name:** `Pocket Finance`
   - **Default language:** `English (United States)`
   - **App or game:** `App`
   - **Free or paid:** `Free` (or Paid if you're charging)
   - **Declarations:** 
     - ✅ Contains ads
     - ✅ Contains in-app purchases (if you have IAP)
4. Click **"Create app"**

### 4.2 Complete Store Listing

Navigate to: **Store presence** → **Main store listing**

**Fill in required fields:**

1. **App name:** `Pocket Finance`

2. **Short description** (80 chars max):
   ```
   Track income, expenses, and assets. Complete financial management made simple.
   ```

3. **Full description** (4000 chars max):
   - Copy from `tools/APP_DESCRIPTIONS.md` (English version)
   - Or use the full description provided below

4. **App icon:**
   - Upload: `assets/icon.png` (512x512px)

5. **Feature graphic:**
   - Upload: `play-store-assets/feature-graphic.png` (1024x500px)

6. **Screenshots:**
   - Upload at least 2 screenshots from `play-store-assets/screenshots/`
   - Recommended: Upload 4-5 screenshots

7. **Privacy Policy:**
   - Enter your Privacy Policy URL
   - ⚠️ **REQUIRED** - Your app will be rejected without this!

**Optional but recommended:**
- **Category:** Finance
- **Tags:** finance, expense tracker, budgeting, money management
- **Contact details:** Your email address
- **Website:** (if you have one)

Click **"Save"** when done.

---

## STEP 5: Complete App Content

### 5.1 Privacy Policy

Navigate to: **Policy** → **App content**

1. **Privacy Policy:**
   - Enter your Privacy Policy URL
   - Mark as complete

### 5.2 Target Audience & Content Rating

1. **Target audience:**
   - Select appropriate age group (usually "Everyone" or "Teen")

2. **Content ratings:**
   - Complete the questionnaire
   - Answer honestly about your app's content
   - Submit for rating (usually instant)

### 5.3 Data Safety

Navigate to: **Policy** → **Data safety**

**Required declarations:**
- ✅ **Data collection:** Yes (AdMob collects data)
- ✅ **Third-party sharing:** Yes (Google AdMob)
- ✅ **Data types:** 
  - Device ID
  - Location (approximate)
  - App activity
  - Other (as applicable)

**Fill out the form accurately** - Google will verify this.

---

## STEP 6: Pricing & Distribution

Navigate to: **Monetization setup** → **Pricing and distribution**

1. **Countries/regions:**
   - Select countries where you want to distribute
   - Or select "All countries"

2. **Pricing:**
   - Free (or set price if paid app)

3. **Content guidelines:**
   - Read and accept

4. **Export compliance:**
   - Answer questions about encryption
   - Your app uses standard encryption (answer "No" to special encryption)

Click **"Save"**

---

## STEP 7: Upload Your App (Internal Testing First)

### 7.1 Create Internal Testing Release

1. Navigate to: **Testing** → **Internal testing**
2. Click **"Create new release"**
3. **Upload AAB:**
   - Click "Upload" 
   - Select your AAB file: `play-store-assets/pocket-finance-v1.0.0.aab`
   - Wait for upload to complete

4. **Release name:** `1.0.0 - Initial Release`

5. **Release notes:**
   ```
   Initial release of Pocket Finance
   - Track income and expenses
   - Manage assets
   - View financial reports
   - Multi-language support
   ```

6. Click **"Save"**

7. Click **"Review release"**

8. Review the summary, then click **"Start rollout to Internal testing"**

### 7.2 Add Testers

1. In **Internal testing**, go to **"Testers"** tab
2. Click **"Create email list"**
3. Add your email address (and any testers)
4. Click **"Save changes"**
5. Copy the testing link

### 7.3 Test Your App

1. Open the testing link on your Android device
2. Install the app
3. Test all features:
   - [ ] App launches correctly
   - [ ] All screens work
   - [ ] AdMob ads display (test ads should be disabled)
   - [ ] In-app purchases work (if applicable)
   - [ ] No crashes
   - [ ] Data persists correctly

**If issues found:**
- Fix bugs
- Update version in `app.json` (e.g., 1.0.1)
- Build new AAB: `eas build --platform android --profile production`
- Upload new version

---

## STEP 8: Submit to Production

Once internal testing is successful:

1. Navigate to: **Production** → **Releases**
2. Click **"Create new release"**
3. **Upload AAB:**
   - Upload the same AAB file (or new version if you made changes)
   - Wait for processing

4. **Release name:** `1.0.0 - Initial Release`

5. **Release notes:**
   ```
   Initial release of Pocket Finance
   - Track income and expenses
   - Manage assets
   - View financial reports
   - Multi-language support
   ```

6. Click **"Save"**

7. Click **"Review release"**

8. **Review checklist:**
   - [ ] Store listing is complete
   - [ ] Privacy policy is added
   - [ ] Content rating is complete
   - [ ] Data safety form is complete
   - [ ] All required sections are done

9. Click **"Start rollout to Production"**

10. **Select rollout percentage:**
    - Start with 20% (recommended for first release)
    - Or 100% if confident

11. Click **"Confirm"**

---

## STEP 9: Review Process

**What happens next:**
- Google will review your app (usually 1-7 days)
- You'll receive email updates about status
- Check Play Console dashboard for updates

**Common review issues:**
- Missing privacy policy → Add it
- Incorrect data safety → Fix declarations
- Policy violations → Address issues
- Technical issues → Fix and resubmit

**Monitor status:**
- Go to **Production** → **Releases**
- Check status: "Under review", "Approved", or "Rejected"

---

## STEP 10: App Goes Live! 🎉

**When approved:**
- Your app will appear in Google Play Store
- Users can download and install
- You'll see installs, reviews, and analytics

**Next steps:**
- Monitor user reviews
- Track analytics
- Respond to user feedback
- Plan updates

---

## 📋 QUICK REFERENCE

### Build Command
```bash
eas build --platform android --profile production
```

### Key Files
- App descriptions: `tools/APP_DESCRIPTIONS.md`
- Slogans: `tools/APP_SLOGANS.md`
- Screenshot guide: `tools/SCREENSHOT_GUIDE.md`
- Feature graphic tool: `tools/generate-feature-graphic.html`

### Important URLs
- Google Play Console: https://play.google.com/console
- Expo Dashboard: https://expo.dev
- EAS Build Status: Check your Expo dashboard

### Version Management
For future updates:
1. Update `version` in `app.json` (e.g., "1.0.1")
2. Build new AAB
3. Upload to Play Console
4. Submit for review

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Build Fails
- Check EAS build logs in Expo dashboard
- Verify all dependencies are compatible
- Ensure `app.json` is valid

### Play Console Rejects App
- Check email for specific reasons
- Common: Missing privacy policy, incorrect permissions, policy violations
- Fix issues and resubmit

### Ads Not Working
- Verify AdMob app ID is correct in `app.json`
- Check AdMob account is active
- Ensure test ads are disabled in production build

### Keystore Lost
- If you lose keystore credentials, you CANNOT update your app
- EAS manages this automatically - credentials are in your Expo account
- Never delete your Expo account!

---

## 🎯 CURRENT STATUS CHECKLIST

Use this to track your progress:

**Pre-Build:**
- [ ] EAS CLI installed and logged in
- [ ] Feature graphic generated
- [ ] Screenshots captured
- [ ] Privacy policy URL ready
- [ ] App descriptions ready

**Build:**
- [ ] Production AAB built successfully
- [ ] AAB file downloaded

**Play Console Setup:**
- [ ] App created in Play Console
- [ ] Store listing completed
- [ ] Privacy policy added
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] Pricing & distribution configured

**Testing:**
- [ ] Internal testing release created
- [ ] App tested on device
- [ ] All features working correctly

**Production:**
- [ ] Production release created
- [ ] App submitted for review
- [ ] Review status monitored

---

## 🚀 READY TO START?

Begin with **STEP 1** and work through each step methodically. Good luck with your app launch!

**Need help?** Check the detailed guide in `PLAY_STORE_PUBLISHING.md` for more information.

