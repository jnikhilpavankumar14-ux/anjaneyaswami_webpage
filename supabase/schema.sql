-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  receipt_url TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create puja_events table
CREATE TABLE IF NOT EXISTS puja_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery_meta table
CREATE TABLE IF NOT EXISTS gallery_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  caption TEXT,
  event_date DATE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  temple_email TEXT,
  temple_phone TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donors_user_id ON donors(user_id);
CREATE INDEX IF NOT EXISTS idx_puja_events_date ON puja_events(date);
CREATE INDEX IF NOT EXISTS idx_gallery_meta_created_at ON gallery_meta(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE puja_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for donors
CREATE POLICY "Users can view their own donor record"
  ON donors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own donor record"
  ON donors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for donations
CREATE POLICY "Users can view their own donations"
  ON donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM donors
      WHERE donors.id = donations.donor_id
      AND donors.user_id = auth.uid()
    )
  );

-- RLS Policies for puja_events (public read)
CREATE POLICY "Anyone can view puja events"
  ON puja_events FOR SELECT
  USING (true);

-- RLS Policies for gallery_meta (public read)
CREATE POLICY "Anyone can view gallery items"
  ON gallery_meta FOR SELECT
  USING (true);

-- RLS Policies for settings (public read)
CREATE POLICY "Anyone can view settings"
  ON settings FOR SELECT
  USING (true);

-- Note: Admin policies should be added based on your admin check function
-- For now, admins will need to use service role key for admin operations

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery
CREATE POLICY "Anyone can view gallery files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Only admins can upload to gallery"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery');

-- Storage policies for receipts
CREATE POLICY "Anyone can view receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts');

CREATE POLICY "Service role can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts');

