# Sri Abhayanjaneya Swamy Temple Gandlapalli - Website

A modern, responsive, and secure website for Sri Abhayanjaneya Swamy Temple with donation management, gallery, admin panel, and more.

## Features

- 🏛️ **Temple Information**: History, founders, mission statement, and puja schedule
- 💰 **Donations**: Secure Razorpay integration with receipt generation
- 📸 **Gallery**: Photo and video gallery with admin-only uploads
- 👥 **User Dashboard**: View donation history and download receipts
- 🔐 **Authentication**: Email/Phone OTP and password-based authentication
- 🛡️ **Admin Panel**: Manage donations, puja schedule, gallery, and settings
- 📱 **Responsive Design**: Mobile-friendly with Tailwind CSS
- 🔒 **Security**: HTTPS, CSP, XSS & CSRF protections, server-side payment verification

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Razorpay
- **Deployment**: Vercel/Netlify

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Razorpay account
- GitHub account (for deployment)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/anjaneyaswami_webpage.git
cd anjaneyaswami_webpage
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `supabase/schema.sql`
3. Go to Storage and create two buckets:
   - `gallery` (public)
   - `receipts` (public)
4. Note your Supabase URL and keys from Settings > API

### 4. Set Up Razorpay

1. Create an account at [razorpay.com](https://razorpay.com)
2. Get your Key ID and Key Secret from Dashboard > Settings > API Keys
3. Set up webhook URL: `https://your-domain.com/api/webhook`
4. Note your webhook secret

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Site Configuration
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CONTACT_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
NEXT_PUBLIC_CONTACT_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
TEMPLE_PHONE=8885209456
NEXT_PUBLIC_TEMPLE_PHONE=8885209456

# Admin Configuration
ADMIN_EMAIL=sriabhayanjaneyaswamytemplegpl@gmail.com
ADMIN_PHONE=8885209456

# Optional: Error Tracking
SENTRY_DSN=your_sentry_dsn
```

### 6. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the SQL schema from `supabase/schema.sql` in your Supabase SQL Editor. This will create:

- `donors` - Donor information
- `donations` - Donation records
- `admins` - Admin users
- `puja_events` - Puja schedule
- `gallery_meta` - Gallery metadata
- `settings` - Site settings

## Admin Access

Admin accounts are automatically granted access if they sign up with:
- Email: `sriabhayanjaneyaswamytemplegpl@gmail.com`
- Phone: `8885209456`

Additional admins can be added through the Admin Panel > Settings tab.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Create new site in [Netlify](https://netlify.com)
3. Connect GitHub repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add all environment variables in Site settings > Environment variables

### GitHub Actions (Automatic Deployment)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to Vercel on push to main branch.

## Project Structure

```
anjaneyaswami_webpage/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin panel
│   ├── auth/             # Authentication pages
│   ├── contact/          # Contact page
│   ├── dashboard/        # Donor dashboard
│   ├── donate/           # Donation page
│   ├── gallery/          # Gallery page
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utility functions
├── supabase/             # Database schema
└── public/               # Static assets
```

## API Endpoints

### Public Endpoints
- `GET /api/puja-schedule` - Get puja schedule

### Donation Endpoints
- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment signature
- `POST /api/webhook` - Razorpay webhook handler

### Admin Endpoints
- `GET /api/admin/donations` - Get all donations
- `POST /api/admin/offline-donation` - Record offline donation
- `GET /api/admin/puja-events` - Get puja events
- `POST /api/admin/puja-events` - Create puja event
- `PUT /api/admin/puja-events/[id]` - Update puja event
- `DELETE /api/admin/puja-events/[id]` - Delete puja event
- `POST /api/admin/add-admin` - Add admin user
- `PUT /api/admin/temple-contact` - Update temple contact

## Security Features

- Server-side payment signature verification
- Row Level Security (RLS) in Supabase
- CSRF protection
- XSS protection
- Rate limiting (recommended to add)
- HTTPS only in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please contact:
- Email: sriabhayanjaneyaswamytemplegpl@gmail.com
- Phone: 8885209456

## Acknowledgments

Built with ❤️ for Sri Abhayanjaneya Swamy Temple Gandlapalli

