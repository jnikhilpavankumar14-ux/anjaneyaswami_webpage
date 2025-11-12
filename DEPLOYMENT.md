# Deployment Guide

This guide will help you deploy the Sri Abhayanjaneya Swamy Temple website to Vercel or Netlify.

## Prerequisites

- GitHub account
- Vercel or Netlify account
- Supabase project set up
- Razorpay account configured

## Step 1: Push to GitHub

1. Initialize Git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub named `anjaneyaswami_webpage`

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/anjaneyaswami_webpage.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the SQL schema from `supabase/schema.sql` in the SQL Editor
3. Create storage buckets:
   - Go to Storage
   - Create bucket named `gallery` (public)
   - Create bucket named `receipts` (public)
4. Get your API keys from Settings > API

## Step 3: Configure Razorpay

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to Settings > API Keys
3. Generate Key ID and Key Secret
4. Set up webhook:
   - Go to Settings > Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhook`
   - Copy webhook secret

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository `anjaneyaswami_webpage`
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   CONTACT_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
   NEXT_PUBLIC_CONTACT_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
   TEMPLE_PHONE=8885209456
   NEXT_PUBLIC_TEMPLE_PHONE=8885209456
   ADMIN_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
   ADMIN_PHONE=8885209456
   ```
6. Click "Deploy"

### Option B: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   # ... add all other variables
   ```

5. Deploy to production:
   ```bash
   vercel --prod
   ```

## Step 5: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select `anjaneyaswami_webpage`
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add Environment Variables in Site settings > Environment variables
6. Click "Deploy site"

## Step 6: Update Razorpay Webhook URL

After deployment, update your Razorpay webhook URL to point to your production domain:
- Vercel: `https://your-project.vercel.app/api/webhook`
- Netlify: `https://your-site.netlify.app/api/webhook`

## Step 7: Verify Deployment

1. Visit your deployed site
2. Test authentication (sign up/login)
3. Test donation flow (use Razorpay test mode)
4. Verify admin panel access
5. Test gallery upload (as admin)

## Troubleshooting

### Build Errors

- Ensure all environment variables are set
- Check that Node.js version is 18+
- Verify all dependencies are in `package.json`

### Authentication Issues

- Verify Supabase URL and keys are correct
- Check that RLS policies are set up correctly
- Ensure auth providers are enabled in Supabase

### Payment Issues

- Verify Razorpay keys are correct
- Check webhook URL is accessible
- Test with Razorpay test mode first

### Storage Issues

- Verify storage buckets exist in Supabase
- Check bucket policies allow public read
- Ensure service role key has write access

## Post-Deployment Checklist

- [ ] Update Google Maps embed with actual temple coordinates
- [ ] Add trustee information from trust documents
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (automatic on Vercel/Netlify)
- [ ] Test all features in production
- [ ] Set up monitoring/error tracking (Sentry)
- [ ] Configure email service for receipts (optional)

## Continuous Deployment

The repository includes a GitHub Actions workflow that automatically deploys on push to main branch. To use it:

1. Add GitHub secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

2. Push to main branch - deployment will trigger automatically

## Support

For deployment issues, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

