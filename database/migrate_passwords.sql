-- Migration Script: Hash existing plaintext passwords
-- This script should be run ONCE after deploying the bcrypt implementation
-- WARNING: This assumes existing passwords are stored in plaintext

-- Add a temporary column for migration tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_migrated BOOLEAN DEFAULT FALSE;

-- Note: The actual password hashing must be done via the application
-- because PostgreSQL doesn't have bcrypt built-in by default.
-- 
-- This migration will be handled by a Python script that:
-- 1. Reads all users with password_migrated = FALSE
-- 2. Hashes their passwords using bcrypt
-- 3. Updates the password_hash field
-- 4. Sets password_migrated = TRUE

-- For new users, passwords will be hashed automatically by the application

-- After migration is complete, you can optionally remove the tracking column:
-- ALTER TABLE users DROP COLUMN IF EXISTS password_migrated;
