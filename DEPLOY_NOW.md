# Quick Deployment Guide - Deploy Now!

## Option 1: Deploy via Vercel Web Interface (Easiest - No Node.js Required)

### Steps:

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up/Login with your GitHub account

2. **Import Your Repository**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Find and select: `jnikhilpavankumar14-ux/anjaneyaswami_webpage`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

4. **Add Environment Variables** (Click "Environment Variables")
   Add these variables (you can add placeholder values for now to get it deployed):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_secret_here
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
   SITE_URL=https://your-project.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   CONTACT_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
   NEXT_PUBLIC_CONTACT_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
   TEMPLE_PHONE=8885209456
   NEXT_PUBLIC_TEMPLE_PHONE=8885209456
   ADMIN_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
   ADMIN_PHONE=8885209456
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://anjaneyaswami-webpage.vercel.app` (or similar)

## Option 2: Deploy via Netlify (Alternative)

1. **Go to Netlify**
   - Visit: https://netlify.com
   - Sign up/Login with GitHub

2. **Import Repository**
   - Click "Add new site" > "Import an existing project"
   - Select GitHub and authorize
   - Select: `anjaneyaswami_webpage`

3. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables in Site settings

4. **Deploy**
   - Click "Deploy site"

## Option 3: Deploy via Railway (Alternative)

1. **Go to Railway**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Railway auto-detects Next.js
   - Add environment variables in Variables tab

4. **Deploy**
   - Automatic deployment starts

---

## Quick Test Deployment (Without Full Configuration)

To just see if the site loads, you can deploy with minimal environment variables:

1. Deploy to Vercel (Option 1 above)
2. Add only these for basic functionality:
   ```
   NEXT_PUBLIC_SUPABASE_URL=placeholder
   NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
   ```
3. The site will deploy and be accessible, though some features won't work until you add real credentials

## Your Repository

**GitHub URL**: https://github.com/jnikhilpavankumar14-ux/anjaneyaswami_webpage

**Ready to deploy!** 🚀

