/*
  # Create QR codes table with updated RLS policies

  1. New Tables
    - `qr_codes`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `phone` (text, not null)
      - `created_at` (timestamptz, default now())
      - `used_at` (timestamptz, null)
      - `is_used` (boolean, default false)

  2. Security
    - Enable RLS on `qr_codes` table
    - Add policies for:
      - Anyone can create QR codes (including anonymous users)
      - Only authenticated users can read and update QR codes
*/

CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz,
  is_used boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Only authenticated users can read QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Only authenticated users can update QR codes" ON qr_codes;

-- Create new policies
CREATE POLICY "Anyone can create QR codes"
  ON qr_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read QR codes"
  ON qr_codes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can update QR codes"
  ON qr_codes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);