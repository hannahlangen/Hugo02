#!/usr/bin/env python3
"""
Password Migration Script
Migrates plaintext passwords to bcrypt hashes
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
import os
import sys

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def get_db_connection():
    """Create database connection"""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        database=os.getenv("DB_NAME", "hugo_db"),
        user=os.getenv("DB_USER", "hugo_user"),
        password=os.getenv("DB_PASSWORD", "hugo_password"),
        port=os.getenv("DB_PORT", "5432")
    )

def migrate_passwords():
    """Migrate all plaintext passwords to bcrypt hashes"""
    conn = get_db_connection()
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Add migration tracking column if it doesn't exist
            cur.execute("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS password_migrated BOOLEAN DEFAULT FALSE
            """)
            conn.commit()
            
            # Get all users with unmigrated passwords
            cur.execute("""
                SELECT id, email, password_hash 
                FROM users 
                WHERE password_migrated = FALSE OR password_migrated IS NULL
            """)
            users = cur.fetchall()
            
            if not users:
                print("✅ No passwords to migrate. All passwords are already hashed.")
                return
            
            print(f"🔄 Found {len(users)} users with passwords to migrate...")
            
            migrated_count = 0
            failed_count = 0
            
            for user in users:
                try:
                    # Check if password is already a bcrypt hash (starts with $2b$ or $2a$ or $2y$)
                    if user['password_hash'] and (
                        user['password_hash'].startswith('$2b$') or 
                        user['password_hash'].startswith('$2a$') or 
                        user['password_hash'].startswith('$2y$')
                    ):
                        print(f"⏭️  Skipping {user['email']} - password already hashed")
                        # Mark as migrated
                        cur.execute("""
                            UPDATE users 
                            SET password_migrated = TRUE 
                            WHERE id = %s
                        """, (user['id'],))
                        conn.commit()
                        continue
                    
                    # Hash the plaintext password
                    plaintext_password = user['password_hash']
                    if not plaintext_password:
                        print(f"⚠️  Warning: User {user['email']} has no password set")
                        continue
                    
                    hashed_password = hash_password(plaintext_password)
                    
                    # Update the password hash
                    cur.execute("""
                        UPDATE users 
                        SET password_hash = %s, password_migrated = TRUE 
                        WHERE id = %s
                    """, (hashed_password, user['id']))
                    conn.commit()
                    
                    print(f"✅ Migrated password for: {user['email']}")
                    migrated_count += 1
                    
                except Exception as e:
                    print(f"❌ Failed to migrate password for {user['email']}: {str(e)}")
                    failed_count += 1
                    conn.rollback()
            
            print(f"\n📊 Migration Summary:")
            print(f"   ✅ Successfully migrated: {migrated_count}")
            print(f"   ❌ Failed: {failed_count}")
            print(f"   📝 Total processed: {len(users)}")
            
            if failed_count == 0:
                print("\n🎉 Password migration completed successfully!")
            else:
                print(f"\n⚠️  Migration completed with {failed_count} failures")
                sys.exit(1)
                
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔐 Starting password migration to bcrypt...")
    print("=" * 50)
    migrate_passwords()
