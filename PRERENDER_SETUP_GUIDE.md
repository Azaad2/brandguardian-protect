# 🚀 Prerender.io Setup Guide for BndBox.com

This guide will help you complete the Prerender.io setup for optimal Google indexing.

## ✅ What Has Been Done

1. ✓ Fixed OG image URLs in `index.html` to use `/og-images/homepage.jpg`
2. ✓ Updated `react-snap.config.js` to include `/brand-portal` route
3. ✓ Created `post-build-fix.js` script to fix prerendered HTML
4. ✓ Created `generate-sitemap.js` for dynamic sitemap generation
5. ✓ Created `netlify.toml` and `vercel.json` for hosting configuration
6. ✓ Updated build configuration for prerendering

## 🔧 Required Manual Steps

### Step 1: Update package.json Build Script

**IMPORTANT:** You need to manually update your `package.json` file (I cannot edit it directly):

```json
{
  "scripts": {
    "build": "node generate-sitemap.js && vite build && react-snap && node post-build-fix.js",
    "build:dev": "vite build --mode development"
  }
}
```

### Step 2: Sign Up for Prerender.io

1. Go to [https://prerender.io/](https://prerender.io/)
2. Sign up with your email
3. Click "Get Started Free" (14-day trial, then $50/month for 10k pages)
4. Copy your **Prerender Token** from the dashboard

### Step 3: Configure Prerender Token

#### For Netlify:
1. Open `netlify.toml`
2. Replace `YOUR_PRERENDER_TOKEN` with your actual token (line 11)
3. Deploy to Netlify

#### For Vercel:
1. Open `vercel.json`
2. Replace `YOUR_PRERENDER_TOKEN` with your actual token (line 18)
3. Deploy to Vercel

#### For Other Hosts:
Add this to your `public/_redirects` file:
```
/*  https://service.prerender.io/https://bndbox.com/:splat  200!  User-Agent=googlebot,bingbot,yandex,baiduspider,facebookexternalhit,twitterbot  X-Prerender-Token=YOUR_TOKEN
/*  /index.html  200
```

### Step 4: Verify OG Images

Ensure these files exist in `/public/og-images/`:
- ✓ `homepage.jpg` (1200×630px)
- ✓ `about.jpg` (1200×630px)
- ✓ `reseller-hub.jpg` (1200×630px)
- ✓ `brand-portal.jpg` (1200×630px)

### Step 5: Build and Deploy

```bash
# Generate sitemap
node generate-sitemap.js

# Build with prerendering
npm run build

# Verify prerendered files exist
ls -la dist/about/index.html
ls -la dist/reseller-hub/index.html
ls -la dist/brand-portal/index.html
```

### Step 6: Test Prerendering

After deployment, test with these tools:

1. **Prerender.io Tester:**
   - Go to your Prerender.io dashboard
   - Enter: `https://bndbox.com/`
   - Click "Test Prerender"
   - Verify full HTML content is visible

2. **Google Rich Results Test:**
   - https://search.google.com/test/rich-results
   - Enter: `https://bndbox.com/`
   - Verify structured data appears

3. **Facebook Debugger:**
   - https://developers.facebook.com/tools/debug/
   - Enter: `https://bndbox.com/`
   - Verify OG image and description appear

4. **LinkedIn Post Inspector:**
   - https://www.linkedin.com/post-inspector/
   - Enter: `https://bndbox.com/`

### Step 7: Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://bndbox.com`
3. Verify ownership (HTML tag or DNS)
4. Submit sitemap: `https://bndbox.com/sitemap.xml`
5. Request indexing for key pages:
   - `/`
   - `/about`
   - `/reseller-hub`
   - `/brand-portal`
   - `/blog`

## 🔍 Verification Checklist

- [ ] package.json build script updated
- [ ] Prerender.io account created
- [ ] Prerender token added to config
- [ ] Build completes successfully
- [ ] Prerendered HTML files exist in dist/
- [ ] OG images display in social media preview tools
- [ ] Google Rich Results Test passes
- [ ] Sitemap submitted to Google Search Console
- [ ] Pages begin appearing in Google search (within 1-7 days)

## 📊 Expected Results

### Before:
- Google sees only `<div id="root"></div>`
- No social media previews
- Pages not indexed

### After:
- Google sees full HTML content
- Rich social media previews with images
- All pages indexed within 1 week
- Improved search rankings (within 2-4 weeks)

## 🆓 Free Alternative to Prerender.io

If you want to avoid the $50/month cost, you can use the built-in `react-snap` prerendering:

1. Skip Prerender.io signup
2. Remove Prerender.io redirects from `netlify.toml` / `vercel.json`
3. Just use: `npm run build`
4. Deploy the prerendered `dist/` folder

**Note:** This works well for static content but won't handle dynamic content or client-side routing as effectively as Prerender.io.

## 🐛 Troubleshooting

### Pages Still Not Indexed?
- Wait 7-14 days for Google to re-crawl
- Request indexing in Search Console
- Check Coverage report for errors

### Social Previews Not Working?
- Clear Facebook/LinkedIn cache in their debugging tools
- Verify OG image URLs are absolute (https://bndbox.com/...)
- Check image size is 1200×630px

### Build Failing?
- Run `node generate-sitemap.js` first
- Ensure all dependencies installed: `npm install`
- Check console for specific errors

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Prerender.io dashboard shows your site
3. Test with curl: `curl -A "googlebot" https://bndbox.com/`
4. Contact Prerender.io support if needed

---

**Status:** ⏳ Awaiting manual package.json update and Prerender.io token
