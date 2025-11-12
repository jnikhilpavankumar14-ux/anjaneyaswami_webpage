# Setup Checklist

Use this checklist to ensure all components are properly configured before going live.

## Pre-Deployment Setup

### 1. Supabase Configuration
- [ ] Create Supabase project
- [ ] Run `supabase/schema.sql` in SQL Editor
- [ ] Create `gallery` storage bucket (public)
- [ ] Create `receipts` storage bucket (public)
- [ ] Configure storage policies
- [ ] Enable email authentication in Auth settings
- [ ] Enable phone authentication in Auth settings (if using Twilio/MSG91)
- [ ] Copy Supabase URL and keys

### 2. Razorpay Configuration
- [ ] Create Razorpay account
- [ ] Generate API keys (Key ID and Key Secret)
- [ ] Set up webhook URL (will be updated after deployment)
- [ ] Copy webhook secret
- [ ] Test payment flow in test mode

### 3. Environment Variables
- [ ] Create `.env.local` for local development
- [ ] Add all required environment variables (see `.env.example`)
- [ ] Verify all variables are set correctly

### 4. Local Testing
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Test user signup (email and phone)
- [ ] Test user login
- [ ] Test donation flow (test mode)
- [ ] Test admin panel access
- [ ] Test gallery upload (as admin)
- [ ] Test puja schedule CRUD (as admin)
- [ ] Test offline donation recording (as admin)

### 5. Content Updates
- [ ] Update temple history text
- [ ] Add founder/trustee information
- [ ] Update mission statement if needed
- [ ] Add initial puja schedule events
- [ ] Update Google Maps embed with actual coordinates
- [ ] Add temple address details
- [ ] Update contact information

### 6. GitHub Setup
- [ ] Initialize Git repository
- [ ] Create GitHub repository `anjaneyaswami_webpage`
- [ ] Push code to GitHub
- [ ] Verify all files are committed

### 7. Deployment
- [ ] Choose deployment platform (Vercel/Netlify)
- [ ] Connect GitHub repository
- [ ] Add all environment variables
- [ ] Deploy to production
- [ ] Update Razorpay webhook URL to production domain
- [ ] Test production deployment

### 8. Post-Deployment
- [ ] Test all features in production
- [ ] Verify HTTPS is enabled
- [ ] Test payment flow in production (start with small test amount)
- [ ] Verify email receipts are sent
- [ ] Test admin panel in production
- [ ] Set up custom domain (optional)
- [ ] Configure error tracking (Sentry - optional)

### 9. Security Checklist
- [ ] Verify all API routes have proper authentication
- [ ] Check that admin routes are protected
- [ ] Verify payment signature verification is working
- [ ] Ensure RLS policies are active in Supabase
- [ ] Review and update CORS settings if needed
- [ ] Verify environment variables are not exposed in client code

### 10. Documentation
- [ ] Review README.md
- [ ] Review API.md
- [ ] Review DEPLOYMENT.md
- [ ] Document any custom configurations
- [ ] Create admin user guide (optional)

## Admin Account Setup

### Initial Admin Access
Admin accounts are automatically granted if they sign up with:
- Email: `sriabhayanjaneyaswamytemplegpl@gmail.com`
- Phone: `8885209456`

### Adding Additional Admins
1. Log in as existing admin
2. Go to Admin Panel > Settings
3. Add new admin email and phone
4. New admin must sign up with those credentials

## Testing Scenarios

### Donor Flow
1. Sign up with email/phone
2. Verify OTP
3. Make a donation
4. Complete payment
5. View donation in dashboard
6. Download receipt

### Admin Flow
1. Sign up with admin email/phone
2. Access admin panel
3. View donations list
4. Export CSV
5. Add offline donation
6. Manage puja schedule
7. Upload gallery image
8. Add new admin

## Common Issues & Solutions

### Issue: Authentication not working
- Check Supabase URL and keys
- Verify auth providers are enabled
- Check RLS policies

### Issue: Payments failing
- Verify Razorpay keys are correct
- Check webhook URL is accessible
- Test in Razorpay test mode first

### Issue: Gallery uploads failing
- Verify storage buckets exist
- Check bucket policies
- Verify admin status

### Issue: Admin panel access denied
- Verify email/phone matches admin credentials
- Check admin table in database
- Verify isAdminUser function

## Support Contacts

- Email: sriabhayanjaneyaswamytemplegpl@gmail.com
- Phone: 8885209456

## Notes

- Always test in test/staging environment before production
- Keep backups of database and environment variables
- Monitor error logs regularly
- Update dependencies periodically for security

