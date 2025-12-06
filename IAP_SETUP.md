# In-App Purchase Setup Guide

This guide explains how to set up real in-app purchases for the "Remove Ads" feature using `react-native-iap`.

## ✅ Implementation Complete

The in-app purchase functionality has been fully implemented:
- ✅ `react-native-iap` package installed
- ✅ IAP configuration file created (`utils/iap-config.js`)
- ✅ IAP utility hook created (`utils/use-iap.js`)
- ✅ Remove Ads button updated to use real IAP
- ✅ Purchase listeners configured for real-time updates

## 📋 Prerequisites

1. **App Store Connect Account** (for iOS)
   - Your app must be registered in App Store Connect
   - You need an active Apple Developer account

2. **Google Play Console Account** (for Android)
   - Your app must be registered in Google Play Console
   - You need a Google Play Developer account

## 🔧 Configuration Steps

### Step 1: Create Product IDs

You need to create in-app purchase products in both stores. The product IDs must match what you configure in `utils/iap-config.js`.

#### For iOS (App Store Connect):

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to **My Apps** → Select your app
3. Go to **Features** → **In-App Purchases**
4. Click the **+** button to create a new in-app purchase
5. Select **Non-Consumable** (since "Remove Ads" is a one-time purchase)
6. Fill in the details:
   - **Product ID**: `remove_ads` (or your custom ID)
   - **Reference Name**: "Remove Ads"
   - **Price**: Set your price (e.g., $1.99)
   - **Display Name**: "Remove Ads"
   - **Description**: "Remove all advertisements from the app"
7. Save and submit for review

#### For Android (Google Play Console):

1. Go to [Google Play Console](https://play.google.com/console/)
2. Navigate to **Monetize** → **Products** → **In-app products**
3. Click **Create product**
4. Fill in the details:
   - **Product ID**: `remove_ads` (must match iOS if using same ID)
   - **Name**: "Remove Ads"
   - **Description**: "Remove all advertisements from the app"
   - **Price**: Set your price (e.g., $1.99)
5. Activate the product

### Step 2: Update Product IDs in Code

Edit `utils/iap-config.js` and update the product IDs to match what you created:

```javascript
export const IAP_CONFIG = {
  productIds: {
    ios: 'remove_ads', // Replace with your iOS product ID
    android: 'remove_ads', // Replace with your Android product ID
  },
  // ...
};
```

**Important**: The product IDs must match exactly what you created in the stores (case-sensitive).

### Step 3: Test the Implementation

#### Testing on iOS:

1. **Sandbox Testing**:
   - Create a sandbox test user in App Store Connect
   - Sign out of your Apple ID on the device
   - Run the app and attempt a purchase
   - When prompted, sign in with the sandbox test user
   - The purchase will be free in sandbox mode

2. **Test Product IDs**:
   - You can use test product IDs during development
   - iOS automatically uses sandbox for testing

#### Testing on Android:

1. **License Testing**:
   - Add test accounts in Google Play Console → **Settings** → **License testing**
   - Add your Gmail account as a test account
   - Purchases will be free for test accounts

2. **Test Purchases**:
   - Use a test account to make purchases
   - Purchases are automatically refunded after a few minutes

### Step 4: Rebuild Your App

After configuring the product IDs, you need to rebuild your app:

```bash
# For development build
npx expo prebuild
npx expo run:ios
# or
npx expo run:android

# For production build
eas build --platform ios
# or
eas build --platform android
```

## 🎯 How It Works

1. **User clicks "Remove Ads" button** → Modal opens
2. **Modal shows product details** → Price fetched from store
3. **User clicks "Buy Now"** → Purchase flow initiated
4. **Store handles payment** → User authenticates and pays
5. **Purchase verified** → Purchase token stored locally
6. **Ads removed** → Purchase status saved, ads hidden

## 🔒 Purchase Verification

Currently, purchases are verified and stored locally. For production, you should:

1. **Verify purchases on your backend**:
   - Send purchase token to your server
   - Verify with Apple/Google servers
   - Store purchase status in your database

2. **Add receipt validation**:
   - Validate receipts server-side
   - Prevent fraud and unauthorized access

See the TODO comment in `utils/use-iap.js` for where to add backend verification.

## 🛠️ Features Implemented

- ✅ Real in-app purchase integration
- ✅ Product fetching from stores
- ✅ Purchase processing
- ✅ Purchase restoration
- ✅ Error handling
- ✅ Loading states
- ✅ User-friendly UI

## 📱 Restore Purchases

Users can restore their purchases if they:
- Reinstall the app
- Switch devices
- Need to verify their purchase

The "Restore Purchases" button is available in the purchase modal.

## ⚠️ Important Notes

1. **Product IDs are case-sensitive** - Must match exactly
2. **Products must be approved** - Before they work in production
3. **Sandbox testing** - Use test accounts for development
4. **Rebuild required** - After changing product IDs or plugin config
5. **Backend verification** - Recommended for production security

## 🐛 Troubleshooting

### "Store not connected" error:
- Make sure you're running on a real device (not simulator/emulator)
- Check that the IAP plugin is properly configured in app.json
- Rebuild the app after adding the plugin

### "Product not found" error:
- Verify product ID matches exactly (case-sensitive)
- Ensure product is created and active in the store
- For iOS: Product must be submitted for review
- For Android: Product must be activated

### Purchase not completing:
- Check internet connection
- Verify you're using a test account (for testing)
- Check store console for any errors
- Review app logs for detailed error messages

## 📚 Additional Resources

- [react-native-iap Documentation](https://github.com/dooboolab/react-native-iap)
- [Apple In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing Guide](https://developer.android.com/google/play/billing)

## ✅ Next Steps

1. Create products in App Store Connect and Google Play Console
2. Update product IDs in `utils/iap-config.js`
3. Test purchases with sandbox/test accounts
4. Rebuild and test on real devices
5. (Optional) Implement backend verification for production

