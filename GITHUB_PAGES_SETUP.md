# GitHub Pages Setup for Privacy Policy

## Quick Setup Steps

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Click on **Settings** (top menu bar)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch**: `main` (or `master` if that's your default branch)
   - **Folder**: `/ (root)` or `/docs` (if you put the file in a docs folder)
5. Click **Save**

### Step 2: Choose Your File Location

You have two options:

#### Option A: Use `privacy-policy.html` directly (Recommended)
- Keep the file as `privacy-policy.html` in the root of your repository
- Your URL will be: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/privacy-policy.html`

#### Option B: Rename to `index.html` (Cleaner URL)
- Rename `privacy-policy.html` to `index.html`
- Your URL will be: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Step 3: Wait for GitHub Pages to Build

- After enabling Pages, wait 1-2 minutes for GitHub to build your site
- You'll see a green checkmark when it's ready
- The URL will be displayed in the Pages settings

## Your Privacy Policy URL Format

Based on your repository structure, your URL will be one of these:

### If repository is named `star`:
- **With privacy-policy.html**: `https://YOUR_USERNAME.github.io/star/privacy-policy.html`
- **With index.html**: `https://YOUR_USERNAME.github.io/star/`

### If repository is in a subdirectory:
- If your repo is `Star/star`, the URL might be: `https://YOUR_USERNAME.github.io/Star/star/privacy-policy.html`

## How to Find Your Exact URL

1. After enabling GitHub Pages, go to: **Settings** → **Pages**
2. You'll see: "Your site is live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`"
3. Copy that URL and add `/privacy-policy.html` if you kept the original filename

## Example URLs

If your GitHub username is `stanleylam` and repository is `star`:
- **With privacy-policy.html**: `https://stanleylam.github.io/star/privacy-policy.html`
- **With index.html**: `https://stanleylam.github.io/star/`

## Testing Your URL

1. After GitHub Pages is enabled, visit your URL in a browser
2. You should see your privacy policy page
3. If you see a 404, wait a few more minutes and try again

## Important Notes

- **Public Repository Required**: Your repository must be public for free GitHub Pages (or use GitHub Pro for private repos)
- **HTTPS Required**: Google Play Console requires HTTPS URLs (GitHub Pages provides this automatically)
- **File Must Be Committed**: Make sure `privacy-policy.html` is committed and pushed to your repository
- **Branch Selection**: Use the branch where your file is located (usually `main` or `master`)

## Troubleshooting

**404 Error?**
- Wait 2-3 minutes after enabling Pages
- Check that the file is in the correct branch
- Verify the filename matches exactly (case-sensitive)

**Can't find Pages settings?**
- Make sure you're the repository owner or have admin access
- Check that you're on the correct repository

**Want a custom domain?**
- You can add a custom domain in Pages settings, but the default GitHub Pages URL works perfectly for Play Store
