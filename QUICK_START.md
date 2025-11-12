# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Supabase account
- [ ] Razorpay account

## 5-Minute Setup

### 1. Install Dependencies (2 minutes)
```bash
cd C:\Users\ME\anjaneyaswami_webpage
npm install
```

### 2. Configure Environment (2 minutes)
Copy `.env.example` to `.env.local` and fill in:
- Supabase URL and keys
- Razorpay keys
- Site configuration

### 3. Test Locally (1 minute)
```bash
npm run dev
```
Open http://localhost:3000

## Deployment Commands

### Initialize Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/anjaneyaswami_webpage.git
git branch -M main
git push -u origin main
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Common Issues

**Issue**: `npm: command not found`
**Solution**: Install Node.js from https://nodejs.org/

**Issue**: Build errors
**Solution**: Check all environment variables are set in `.env.local`

**Issue**: Authentication not working
**Solution**: Verify Supabase URL and keys are correct

**Issue**: Payments failing
**Solution**: Check Razorpay keys and test in test mode first

## Need Help?

See:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `SETUP_CHECKLIST.md` - Complete checklist
- `VALIDATION_REPORT.md` - Validation status

