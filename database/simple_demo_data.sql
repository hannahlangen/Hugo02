-- Simplified Demo Data for Recommendation Engine
-- Matches actual database schema

-- Update existing user with Hugo type
UPDATE users SET hugo_type = 'VI', experience_years = 5 WHERE email = 'user@democompany.com';

-- Create additional users with Hugo types
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, hugo_type, experience_years, department, position)
SELECT 
  email,
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', -- password: demo123
  first_name,
  last_name,
  'user',
  1,
  hugo_type,
  experience_years,
  department,
  position
FROM (VALUES
  ('sarah.johnson@democompany.com', 'Sarah', 'Johnson', 'VI', 5, 'Engineering', 'Senior Developer'),
  ('michael.chen@democompany.com', 'Michael', 'Chen', 'VE', 8, 'Engineering', 'Tech Lead'),
  ('emma.williams@democompany.com', 'Emma', 'Williams', 'IC', 4, 'Product', 'Product Manager'),
  ('david.martinez@democompany.com', 'David', 'Martinez', 'EC', 6, 'Engineering', 'Senior Engineer'),
  ('lisa.anderson@democompany.com', 'Lisa', 'Anderson', 'VC', 7, 'Marketing', 'Marketing Director'),
  ('james.taylor@democompany.com', 'James', 'Taylor', 'IE', 5, 'Engineering', 'Innovation Lead'),
  ('sophia.brown@democompany.com', 'Sophia', 'Brown', 'C', 3, 'Sales', 'Account Manager'),
  ('robert.wilson@democompany.com', 'Robert', 'Wilson', 'E', 10, 'Engineering', 'Principal Engineer'),
  ('olivia.garcia@democompany.com', 'Olivia', 'Garcia', 'VC', 4, 'Sales', 'Sales Manager'),
  ('daniel.lee@democompany.com', 'Daniel', 'Lee', 'V', 6, 'Strategy', 'Strategy Director'),
  ('ava.thomas@democompany.com', 'Ava', 'Thomas', 'I', 3, 'Product', 'Product Designer'),
  ('william.moore@democompany.com', 'William', 'Moore', 'E', 9, 'Engineering', 'Senior Engineer'),
  ('mia.jackson@democompany.com', 'Mia', 'Jackson', 'C', 4, 'HR', 'HR Specialist'),
  ('alexander.white@democompany.com', 'Alexander', 'White', 'VI', 5, 'Engineering', 'Full Stack Developer'),
  ('isabella.harris@democompany.com', 'Isabella', 'Harris', 'EC', 7, 'Engineering', 'DevOps Engineer')
) AS data(email, first_name, last_name, hugo_type, experience_years, department, position)
ON CONFLICT (email) DO UPDATE SET
  hugo_type = EXCLUDED.hugo_type,
  experience_years = EXCLUDED.experience_years,
  department = EXCLUDED.department,
  position = EXCLUDED.position;

-- Create teams if they don't exist
INSERT INTO teams (name, description, company_id, created_by)
SELECT 
  name,
  description,
  1,
  (SELECT id FROM users WHERE email = 'hr@democompany.com')
FROM (VALUES
  ('Innovation Lab', 'Exploring new technologies and breakthrough ideas'),
  ('Product Development', 'Building and shipping core products'),
  ('Customer Success', 'Ensuring customer satisfaction and growth'),
  ('Strategic Planning', 'Long-term vision and strategy')
) AS data(name, description)
WHERE NOT EXISTS (SELECT 1 FROM teams WHERE name = data.name AND company_id = 1);

-- Add team members
WITH team_assignments AS (
  SELECT 
    t.id as team_id,
    u.id as user_id,
    'member' as role
  FROM teams t
  CROSS JOIN users u
  WHERE t.company_id = 1
  AND (
    (t.name = 'Innovation Lab' AND u.email IN ('sarah.johnson@democompany.com', 'alexander.white@democompany.com', 'ava.thomas@democompany.com'))
    OR (t.name = 'Product Development' AND u.email IN ('david.martinez@democompany.com', 'lisa.anderson@democompany.com', 'james.taylor@democompany.com'))
    OR (t.name = 'Customer Success' AND u.email IN ('sophia.brown@democompany.com', 'robert.wilson@democompany.com', 'olivia.garcia@democompany.com'))
    OR (t.name = 'Strategic Planning' AND u.email IN ('michael.chen@democompany.com', 'emma.williams@democompany.com', 'daniel.lee@democompany.com'))
  )
)
INSERT INTO team_members (team_id, user_id, role, joined_at)
SELECT team_id, user_id, role, NOW()
FROM team_assignments
ON CONFLICT DO NOTHING;

-- Print summary
DO $$
DECLARE
  user_count INT;
  team_count INT;
  member_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users WHERE company_id = 1 AND hugo_type IS NOT NULL;
  SELECT COUNT(*) INTO team_count FROM teams WHERE company_id = 1;
  SELECT COUNT(*) INTO member_count FROM team_members tm JOIN teams t ON tm.team_id = t.id WHERE t.company_id = 1;
  
  RAISE NOTICE '=== Demo Data Created Successfully ===';
  RAISE NOTICE 'Users with Hugo types: %', user_count;
  RAISE NOTICE 'Teams: %', team_count;
  RAISE NOTICE 'Team memberships: %', member_count;
  RAISE NOTICE '=====================================';
END $$;
