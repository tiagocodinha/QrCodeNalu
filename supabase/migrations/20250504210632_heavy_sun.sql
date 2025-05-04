/*
  # Fix QR codes table policies

  1. Security Changes
    - Enable RLS on qr_codes table
    - Add policy for anonymous users to create QR codes
    - Add policy for authenticated users to read QR codes
    - Add policy for authenticated users to update QR codes

  This migration fixes the RLS policies to allow:
    - Anonymous users to create new QR codes
    - Authenticated users to read and update QR codes
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Only authenticated users can read QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Only authenticated users can update QR codes" ON qr_codes;

-- Enable RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
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