# How to Update Closed Test with New AAB

This guide shows you how to upload a new AAB to update your existing Closed Test release in Google Play Console.

## 📦 Step-by-Step Instructions

### Step 1: Download Your New AAB

1. From your EAS build output, you have the download link:
   ```
   https://expo.dev/artifacts/eas/qbRp8DoYA1rs4VXRLxJE9U.aab
   ```
2. Download the `.aab` file to your computer
3. Note the file location (you'll need it in Step 3)

### Step 2: Go to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Sign in with your developer account
3. Select your app (Pocket Finance)

### Step 3: Navigate to Closed Testing

1. In the left sidebar, click **Testing** → **Closed testing**
2. You should see your existing closed test track
3. Click on the closed test track name (e.g., "Testers" or whatever you named it)

### Step 4: Handle Draft Release (If Present)

**⚠️ IMPORTANT:** If you see a draft release (like "Untitled release" in Draft status), you must handle it first before creating a new release.

**You have two options:**

#### Option A: Edit and Use the Draft Release (Recommended)
1. Find the **"Untitled release"** (or any draft release) in the Releases section
2. Click **"Edit release"** button next to it
3. Upload your new AAB file in the draft release
4. Add release notes
5. Save and roll out the release

#### Option B: Discard the Draft Release
1. Find the **"Untitled release"** (or any draft release)
2. Click **"Edit release"**
3. Look for a **"Discard"** or **"Delete"** button (usually at the bottom)
4. Confirm discarding the draft
5. Now you can create a new release

### Step 5: Create a New Release (If No Draft)

**Only if you don't have a draft release or you discarded it:**

1. Look for a button that says:
   - **"Create new release"** or
   - **"New release"** or
   - **"Add release"**
2. Click that button

### Step 6: Upload the New AAB

1. You'll see a form for creating a new release
2. Look for the section to upload your app bundle:
   - **"App bundles and APKs"** section
   - Or a button that says **"Upload"** or **"Browse files"**
3. Click **"Upload"** or **"Browse"**
4. Select your new `.aab` file (the one you downloaded)
5. Wait for the upload to complete (this may take a few minutes)

### Step 7: Review Release Details

After upload, Google Play Console will show:
- **Version code**: Should show `2` (your new version)
- **Version name**: Should show `1.0.1`
- **Release name**: You can optionally add a name like "IAP Fix Update"

### Step 8: Add Release Notes (Optional but Recommended)

1. Scroll down to find **"Release notes"** section
2. Add notes about what changed, for example:
   ```
   - Fixed in-app purchase flow for Remove Ads feature
   - Updated to react-native-iap v14 API
   - Bug fixes and improvements
   ```
3. You can add notes in multiple languages if needed

### Step 3: Review and Save

1. Review all the information
2. Make sure the version code is `2` (higher than your previous version)
3. Click **"Save"** or **"Review release"**

### Step 4: Review the Release

1. You'll be taken to a review page
2. Check that everything looks correct:
   - ✅ Version code: 2
   - ✅ Version name: 1.0.1
   - ✅ AAB file uploaded successfully
   - ✅ Release notes added (if you added them)
3. Click **"Review release"** or **"Start rollout to Closed testing"**

### Step 5: Start Rollout

1. You'll see a confirmation screen
2. Click **"Start rollout to Closed testing"** or **"Rollout release"**
3. The new version will be available to your testers!

## ⏱️ Processing Time

- **Upload**: Usually takes 1-5 minutes
- **Processing/Review**: Google Play needs to process and review the AAB
  - **Typical time**: 30 minutes to 2 hours
  - **Can take longer**: Sometimes up to 24 hours (rare)
  - **Status shows**: "in review" while processing
- **Available to testers**: Only after review is complete and status changes to "Available to selected testers"

### Understanding the Review Status

When you see **"Release 2 (1.0.1) in review"** in Google Play Console:
- ✅ Your AAB was uploaded successfully
- ⏳ Google Play is processing and reviewing it
- ⏸️ Testers **cannot** see the update yet (this is normal!)
- ✅ Once review completes, status will change to "Available to selected testers"
- ✅ Then testers will see the "Update" button in Play Store

## ✅ Verification

### While Release is "In Review"

1. **Check the status in Play Console**:
   - Go to **Testing** → **Closed testing** → Your track
   - Look at the track summary: it will show "Release 2 (1.0.1) **in review**"
   - This means Google Play is still processing your release

2. **What testers see during review**:
   - ❌ **No update button** in Play Store (this is normal!)
   - ✅ They see "Open" and "Uninstall" buttons (current version)
   - ⏳ They must wait until review completes

### After Review Completes

1. **Status changes**:
   - The status will change from "in review" to "**Available to selected testers**"
   - You'll see a green checkmark ✅

2. **Testers will see**:
   - ✅ **"Update" button** appears in Play Store
   - ✅ Notification that an update is available
   - ✅ Can install the new version

3. **How to check if review is complete**:
   - Go to **Testing** → **Closed testing** → Your track
   - Look for "**Available to selected testers**" status
   - Check the Releases tab - the release should show as active

## 🔄 Alternative: Quick Update Path

If you're already in the Closed testing section:

1. **Testing** → **Closed testing** → [Your track name]
2. Find the **"Releases"** tab
3. Click **"Create new release"** or **"New release"**
4. Upload your new AAB
5. Add release notes
6. **"Review release"** → **"Start rollout"**

## 📱 What Testers Will See

- Testers will get a notification that an update is available
- They can update through the Play Store
- The update will include your IAP fix

## 👥 About Your Testers

**Good news!** You don't need to add new testers or find 12 testers again.

- ✅ **Same testers**: Your existing testers in the closed test track will automatically get access to the new release
- ✅ **No re-invitation needed**: They're already part of the test track
- ✅ **Automatic update**: They'll see the update in Play Store and can install it
- ✅ **Count remains**: The 12+ testers you already have still count toward the production requirements

**What happens:**
1. You upload the new AAB to the same closed test track
2. Google Play processes it
3. Your existing testers automatically see the update available
4. They can update through Play Store (just like any app update)
5. The tester count and 14-day requirement continue from your original release

## 🚨 Important Notes

1. **Version Code Must Be Higher**: Your new version code (2) must be higher than the previous one (1) ✅

2. **Same Signing Key**: The AAB must be signed with the same key as your previous release (EAS handles this automatically) ✅

3. **Processing Time**: Wait for Google Play to process the AAB before it's available to testers

4. **Rollback Available**: If something goes wrong, you can rollback to the previous version from the release history

## 🐛 Troubleshooting

### "Version code must be higher" Error
- ✅ Already fixed! Your version code is 2, which is higher than 1

### "Upload failed" Error
- Check your internet connection
- Make sure the AAB file isn't corrupted
- Try uploading again

### "Processing failed" Error
- Check the error message in Play Console
- Usually related to app signing or manifest issues
- EAS builds should handle this correctly

### "Create new release" Button is Greyed Out / Disabled

**This is the most common issue!** You have a draft release that needs to be handled first.

**Solution:**
1. Look for an **"Untitled release"** or any release with **"Draft"** status
2. Click **"Edit release"** next to the draft
3. **Option 1 (Recommended)**: Upload your new AAB to the draft release, add notes, and roll it out
4. **Option 2**: Discard the draft release, then create a new one

**Why this happens:**
- Google Play only allows one draft release at a time
- You must complete (roll out) or discard the draft before creating a new one

### Can't find "Create new release" button
- Make sure you're in the correct closed test track
- You might need to scroll down
- Check if you have the right permissions
- **Check for draft releases first** - this is usually the cause

## 📋 Quick Checklist

- [ ] Downloaded new AAB file
- [ ] Logged into Google Play Console
- [ ] Navigated to Closed testing → Your track
- [ ] Clicked "Create new release"
- [ ] Uploaded new AAB file
- [ ] Verified version code is 2
- [ ] Added release notes (optional)
- [ ] Reviewed and saved release
- [ ] Started rollout to Closed testing
- [ ] Waited for processing (30-60 minutes)

## 🎯 Next Steps After Upload

### Step 1: Wait for Review to Complete

1. **Monitor the status**:
   - Check Google Play Console periodically
   - Look for status change from "in review" to "Available to selected testers"
   - **Typical wait time**: 30 minutes to 2 hours

2. **What to do while waiting**:
   - ✅ Nothing! Just wait for Google Play to finish processing
   - ✅ You can check the Releases tab to see the status
   - ⏳ Don't worry if it takes a while - this is normal

### Step 2: After Review Completes

1. **Verify the release is live**:
   - Status should show "Available to selected testers"
   - Green checkmark should appear

2. **Test the update yourself**:
   - Open Play Store on your test device
   - You should now see an "Update" button
   - Install the update
   - Test the "Remove Ads" purchase flow
   - Verify the fix works

3. **Notify testers** (optional):
   - Let them know an update is available
   - Ask them to check Play Store for the update
   - Ask them to test the IAP feature

4. **Monitor feedback**:
   - Check if testers report any issues
   - Verify purchases are working correctly

## ⚠️ Common Questions

### "Why is it still 'in review' after 1 hour?"

**This is normal!** Google Play review can take:
- **Quick**: 30 minutes
- **Typical**: 1-2 hours
- **Sometimes**: Up to 24 hours (rare)

**What to do:**
- Just wait - there's nothing you can do to speed it up
- Check back in a few hours
- The status will change automatically when ready

### "Testers still don't see update button" (Even though status is "Available to selected testers")

**This is a common issue!** Even when the release is live, it can take time to propagate. Try these steps:

#### Step 1: Force Play Store to Check for Updates

1. **On the test device/emulator:**
   - Open **Play Store** app
   - Pull down from the top to **refresh** (swipe down gesture)
   - Wait a few seconds for it to check

2. **Or manually check:**
   - Go to **Play Store** → **My apps & games**
   - Look for your app in the "Updates" tab
   - Pull down to refresh the list

#### Step 2: Clear Play Store Cache

1. **On Android device:**
   - Go to **Settings** → **Apps** → **Google Play Store**
   - Tap **Storage**
   - Tap **Clear cache** (NOT Clear data)
   - Go back and open Play Store again
   - Check for updates

#### Step 3: Restart Play Store

1. **Close Play Store completely:**
   - Open recent apps (swipe up from bottom)
   - Swipe away Play Store
   - Reopen Play Store
   - Check for updates

#### Step 4: Verify Tester Account

1. **Check you're signed in correctly:**
   - In Play Store, tap your profile icon (top right)
   - Verify the email matches your tester account
   - If wrong account, sign out and sign in with tester account

2. **Verify tester status:**
   - Make sure the account is added to your closed test track
   - Go to Play Console → **Testing** → **Closed testing** → **Testers** tab
   - Verify the email is listed

#### Step 5: Wait a Bit Longer

- **Propagation delay**: Can take 15-30 minutes after status changes
- **Different regions**: May propagate at different times
- **Just wait**: Sometimes it just needs more time

#### Step 6: Uninstall and Reinstall (Last Resort)

If nothing else works:
1. Uninstall the app from the device
2. Wait 5 minutes
3. Go to Play Store and search for your app
4. Install it fresh - it will install the latest version

#### Step 7: Check Version on Device

1. **Verify what version is installed:**
   - Go to device **Settings** → **Apps** → **Pocket Finance**
   - Check the version number
   - If it shows version 1.0.0 (version code 1), the update hasn't reached the device yet
   - If it shows 1.0.1 (version code 2), the update is installed but Play Store might not show it

#### Quick Checklist:

- [ ] Status is "Available to selected testers" ✅ (You confirmed this)
- [ ] Refreshed Play Store (pull down to refresh)
- [ ] Checked "My apps & games" → "Updates" tab
- [ ] Cleared Play Store cache
- [ ] Restarted Play Store app
- [ ] Verified correct Google account is signed in
- [ ] Waited 15-30 minutes after status changed
- [ ] Checked device Settings → Apps to see installed version

### "How long should I wait?"

- **Minimum**: 30 minutes
- **Typical**: 1-2 hours
- **Maximum**: 24 hours (very rare)
- **If longer**: Check Play Console for any error messages

### "Status is 'Available' but no Update button appears"

**This is normal!** There's a propagation delay. Try:

1. **Refresh Play Store** (pull down from top)
2. **Check "My apps & games"** → "Updates" tab
3. **Clear Play Store cache** (Settings → Apps → Play Store → Clear cache)
4. **Wait 15-30 minutes** - propagation can take time
5. **Verify tester account** is signed in correctly
6. **Check installed version** in device Settings → Apps

**Note**: The update might already be available but Play Store UI hasn't refreshed yet. The "My apps & games" section often shows updates before the app's detail page does.

---

**You're all set!** Once the AAB is processed, your testers will be able to update and test the fixed IAP functionality.
