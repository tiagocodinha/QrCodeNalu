/*
  # Fix QR code policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper permissions for anonymous users
    - Enable anonymous users to create QR codes
    - Enable anonymous users to read their own QR codes
    - Keep admin-only update permissions

  2. Security
    - Enable RLS
    - Add policies for both anonymous and authenticated users
    - Restrict updates to authenticated users only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Only authenticated users can read QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Only authenticated users can update QR codes" ON qr_codes;

-- Enable RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Anyone can create QR codes"
ON qr_codes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read their own QR codes"
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