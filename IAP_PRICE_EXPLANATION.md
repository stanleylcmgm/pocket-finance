# In-App Purchase Price Explanation

## ⚠️ Important: You CANNOT Set Price in Code

For **iOS** and **Android** in-app purchases, **the price MUST be set in the store consoles**, NOT in your code.

This is a **requirement by Apple and Google** for security and policy reasons.

## 📊 How It Works

```
┌─────────────────────────────────────────────────────────┐
│  YOUR CODE                                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 1. You set Product ID: "remove_ads"               │  │
│  │ 2. Code requests product info from store          │  │
│  │ 3. Store returns: { price: "$1.99", ... }        │  │
│  │ 4. Your app displays the price from store         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↕️
┌─────────────────────────────────────────────────────────┐
│  APP STORE CONNECT (iOS) / GOOGLE PLAY CONSOLE (Android)│
│  ┌───────────────────────────────────────────────────┐  │
│  │ ✅ YOU SET THE PRICE HERE: $1.99                  │  │
│  │ ✅ Product ID: "remove_ads"                       │  │
│  │ ✅ Product Name: "Remove Ads"                     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 🔍 Where Price is Set

### For iOS:
1. Go to **App Store Connect** → Your App
2. **Features** → **In-App Purchases**
3. Create product with Product ID: `remove_ads`
4. **Set Price: $1.99** (or your desired price)
5. Submit for review

### For Android:
1. Go to **Google Play Console** → Your App
2. **Monetize** → **Products** → **In-app products**
3. Create product with Product ID: `remove_ads`
4. **Set Price: $1.99** (or your desired price)
5. Activate the product

## 💻 What Your Code Does

Your code:
1. ✅ Defines the **Product ID** (`remove_ads`)
2. ✅ Requests product info from the store
3. ✅ Displays the price returned by the store
4. ❌ **CANNOT** set the price (this is done in store consoles)

## 📝 Current Code Setup

In `utils/iap-config.js`:
```javascript
productIds: {
  ios: 'remove_ads',      // ← This matches what you create in App Store Connect
  android: 'remove_ads',  // ← This matches what you create in Google Play Console
}
```

In `components/remove-ads-button.js`:
```javascript
// The price comes from the store, not from your code
const product = products.find(p => p.productId === IAP_CONFIG.getProductId());
const productPrice = product?.price || '$1.99';  // ← Store returns the price
```

## 🎯 Step-by-Step Process

1. **You create the product in store consoles** (App Store Connect / Google Play Console)
   - Set Product ID: `remove_ads`
   - **Set Price: $1.99** ← THIS IS WHERE YOU SET THE PRICE

2. **Your code requests the product**
   - Uses Product ID: `remove_ads`
   - Store returns: `{ price: "$1.99", title: "Remove Ads", ... }`

3. **Your app displays the price**
   - Shows `$1.99` from the store response

## ❓ Why Can't I Set Price in Code?

- **Security**: Prevents apps from changing prices dynamically
- **Policy**: Apple/Google require prices to be set in their systems
- **Consistency**: Ensures prices match what's shown in store listings
- **Compliance**: Required for app store approval

## ✅ What You Need to Do

1. **Create the product in App Store Connect** (iOS)
   - Set price there: $1.99 (or your desired amount)

2. **Create the product in Google Play Console** (Android)
   - Set price there: $1.99 (or your desired amount)

3. **Your code is already set up correctly** - it will fetch and display the price from the stores

## 🔄 The Flow

```
User clicks "Remove Ads" button
    ↓
Your code: fetchProducts(['remove_ads'])
    ↓
Store returns: { productId: 'remove_ads', price: '$1.99', ... }
    ↓
Your app displays: "$1.99"
    ↓
User clicks "Buy Now"
    ↓
Store handles payment with the price YOU SET in the console
```

## 📌 Summary

- ❌ **Price is NOT set in your code**
- ✅ **Price IS set in App Store Connect (iOS) and Google Play Console (Android)**
- ✅ **Your code fetches and displays the price from the store**
- ✅ **This is the standard and required way for all in-app purchases**




