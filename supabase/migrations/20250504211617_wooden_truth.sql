/*
  # Fix QR code validation and access

  1. Changes
    - Drop existing policies
    - Add new policies for proper QR code access and validation
    - Allow public read access for QR code validation
    - Maintain secure update permissions for staff
  
  2. Security
    - Enable RLS
    - Allow public read access for validation
    - Restrict updates to authenticated users only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Anyone can read their own QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Only authenticated users can update QR codes" ON qr_codes;

-- Enable RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Anyone can create QR codes"
ON qr_codes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read QR codes"
ON qr_codes
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Only authenticated users can update QR codes"
ON qr_codes
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);