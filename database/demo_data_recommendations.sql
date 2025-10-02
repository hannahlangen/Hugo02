-- Demo Data for Recommendation Engine Testing
-- This script creates comprehensive demo data for testing the recommendation system

-- First, let's create more users with diverse Hugo personality types
-- Note: Passwords are hashed with bcrypt (password: demo123 for all)

INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, created_at, updated_at)
VALUES
  -- Innovation Team Members
  ('sarah.johnson@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Sarah', 'Johnson', 'user', 1, NOW(), NOW()),
  ('michael.chen@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Michael', 'Chen', 'user', 1, NOW(), NOW()),
  ('emma.williams@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Emma', 'Williams', 'user', 1, NOW(), NOW()),
  
  -- Product Team Members
  ('david.martinez@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'David', 'Martinez', 'user', 1, NOW(), NOW()),
  ('lisa.anderson@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Lisa', 'Anderson', 'user', 1, NOW(), NOW()),
  ('james.taylor@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'James', 'Taylor', 'user', 1, NOW(), NOW()),
  
  -- Sales Team Members
  ('sophia.brown@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Sophia', 'Brown', 'user', 1, NOW(), NOW()),
  ('robert.wilson@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Robert', 'Wilson', 'user', 1, NOW(), NOW()),
  ('olivia.garcia@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Olivia', 'Garcia', 'user', 1, NOW(), NOW()),
  
  -- Available Pool
  ('daniel.lee@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Daniel', 'Lee', 'user', 1, NOW(), NOW()),
  ('ava.thomas@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Ava', 'Thomas', 'user', 1, NOW(), NOW()),
  ('william.moore@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'William', 'Moore', 'user', 1, NOW(), NOW()),
  ('mia.jackson@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Mia', 'Jackson', 'user', 1, NOW(), NOW()),
  ('alexander.white@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Alexander', 'White', 'user', 1, NOW(), NOW()),
  ('isabella.harris@democompany.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSKBdB.sIRy', 'Isabella', 'Harris', 'user', 1, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Create Hugo personality profiles for each user with diverse types
-- Hugo Types: VI (Visionary Innovator), VE (Visionary Expert), VC (Visionary Connector), IE (Innovative Expert), 
--             IC (Innovative Connector), EC (Expert Connector), V (Visionary), I (Innovator), E (Expert), C (Connector)

WITH new_users AS (
  SELECT id, email FROM users WHERE email LIKE '%@democompany.com' AND email != 'hr@democompany.com' AND email != 'user@democompany.com'
)
INSERT INTO hugo_profiles (user_id, hugo_type, vision_score, innovation_score, expertise_score, connection_score, created_at, updated_at)
SELECT 
  id,
  CASE 
    WHEN email = 'sarah.johnson@democompany.com' THEN 'VI'
    WHEN email = 'michael.chen@democompany.com' THEN 'VE'
    WHEN email = 'emma.williams@democompany.com' THEN 'IC'
    WHEN email = 'david.martinez@democompany.com' THEN 'EC'
    WHEN email = 'lisa.anderson@democompany.com' THEN 'VC'
    WHEN email = 'james.taylor@democompany.com' THEN 'IE'
    WHEN email = 'sophia.brown@democompany.com' THEN 'C'
    WHEN email = 'robert.wilson@democompany.com' THEN 'E'
    WHEN email = 'olivia.garcia@democompany.com' THEN 'VC'
    WHEN email = 'daniel.lee@democompany.com' THEN 'V'
    WHEN email = 'ava.thomas@democompany.com' THEN 'I'
    WHEN email = 'william.moore@democompany.com' THEN 'E'
    WHEN email = 'mia.jackson@democompany.com' THEN 'C'
    WHEN email = 'alexander.white@democompany.com' THEN 'VI'
    WHEN email = 'isabella.harris@democompany.com' THEN 'EC'
  END,
  CASE 
    WHEN email IN ('sarah.johnson@democompany.com', 'michael.chen@democompany.com', 'lisa.anderson@democompany.com', 'daniel.lee@democompany.com', 'alexander.white@democompany.com') THEN 85 + (RANDOM() * 15)::int
    WHEN email IN ('olivia.garcia@democompany.com') THEN 75 + (RANDOM() * 15)::int
    ELSE 40 + (RANDOM() * 20)::int
  END,
  CASE 
    WHEN email IN ('sarah.johnson@democompany.com', 'emma.williams@democompany.com', 'james.taylor@democompany.com', 'ava.thomas@democompany.com', 'alexander.white@democompany.com') THEN 85 + (RANDOM() * 15)::int
    WHEN email IN ('michael.chen@democompany.com') THEN 65 + (RANDOM() * 15)::int
    ELSE 40 + (RANDOM() * 20)::int
  END,
  CASE 
    WHEN email IN ('michael.chen@democompany.com', 'david.martinez@democompany.com', 'james.taylor@democompany.com', 'robert.wilson@democompany.com', 'william.moore@democompany.com', 'isabella.harris@democompany.com') THEN 85 + (RANDOM() * 15)::int
    ELSE 40 + (RANDOM() * 20)::int
  END,
  CASE 
    WHEN email IN ('emma.williams@democompany.com', 'lisa.anderson@democompany.com', 'david.martinez@democompany.com', 'sophia.brown@democompany.com', 'olivia.garcia@democompany.com', 'mia.jackson@democompany.com', 'isabella.harris@democompany.com') THEN 85 + (RANDOM() * 15)::int
    ELSE 40 + (RANDOM() * 20)::int
  END,
  NOW(),
  NOW()
FROM new_users
ON CONFLICT (user_id) DO NOTHING;

-- Create diverse teams with different compositions
INSERT INTO teams (name, description, company_id, created_by, created_at, updated_at)
VALUES
  ('Innovation Lab', 'Exploring new technologies and breakthrough ideas', 1, (SELECT id FROM users WHERE email = 'hr@democompany.com'), NOW(), NOW()),
  ('Product Development', 'Building and shipping core products', 1, (SELECT id FROM users WHERE email = 'hr@democompany.com'), NOW(), NOW()),
  ('Customer Success', 'Ensuring customer satisfaction and growth', 1, (SELECT id FROM users WHERE email = 'hr@democompany.com'), NOW(), NOW()),
  ('Strategic Planning', 'Long-term vision and strategy', 1, (SELECT id FROM users WHERE email = 'hr@democompany.com'), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Add team members to teams
WITH team_data AS (
  SELECT 
    t.id as team_id,
    t.name as team_name,
    u.id as user_id,
    u.email
  FROM teams t
  CROSS JOIN users u
  WHERE u.email IN (
    'sarah.johnson@democompany.com',
    'michael.chen@democompany.com',
    'emma.williams@democompany.com',
    'david.martinez@democompany.com',
    'lisa.anderson@democompany.com',
    'james.taylor@democompany.com',
    'sophia.brown@democompany.com',
    'robert.wilson@democompany.com',
    'olivia.garcia@democompany.com'
  )
  AND t.company_id = 1
)
INSERT INTO team_members (team_id, user_id, role, joined_at)
SELECT 
  team_id,
  user_id,
  'member',
  NOW()
FROM team_data
WHERE 
  (team_name = 'Innovation Lab' AND email IN ('sarah.johnson@democompany.com', 'alexander.white@democompany.com', 'ava.thomas@democompany.com'))
  OR (team_name = 'Product Development' AND email IN ('david.martinez@democompany.com', 'lisa.anderson@democompany.com', 'james.taylor@democompany.com'))
  OR (team_name = 'Customer Success' AND email IN ('sophia.brown@democompany.com', 'robert.wilson@democompany.com', 'olivia.garcia@democompany.com'))
  OR (team_name = 'Strategic Planning' AND email IN ('michael.chen@democompany.com', 'emma.williams@democompany.com'))
ON CONFLICT DO NOTHING;

-- Create historical performance data for teams
INSERT INTO team_performance_history (team_id, synergy_score, performance_rating, project_success_rate, recorded_at, notes)
SELECT 
  t.id,
  70 + (RANDOM() * 25)::int,
  3.5 + (RANDOM() * 1.5),
  0.75 + (RANDOM() * 0.20),
  NOW() - (INTERVAL '1 month' * generate_series),
  CASE 
    WHEN generate_series = 0 THEN 'Current performance metrics'
    WHEN generate_series = 1 THEN 'Last month performance'
    WHEN generate_series = 2 THEN 'Two months ago'
    ELSE 'Historical data'
  END
FROM teams t
CROSS JOIN generate_series(0, 3)
WHERE t.company_id = 1
ON CONFLICT DO NOTHING;

-- Create some recommendation requests for testing
INSERT INTO recommendation_requests (
  company_id,
  requested_by,
  request_type,
  context,
  status,
  created_at
)
SELECT 
  1,
  (SELECT id FROM users WHERE email = 'hr@democompany.com'),
  request_type,
  context,
  'completed',
  NOW() - (INTERVAL '1 day' * days_ago)
FROM (
  VALUES 
    ('find_member', '{"team_id": 1, "project_type": "innovation", "required_skills": ["creativity", "technical"]}', 1),
    ('find_member', '{"team_id": 2, "project_type": "execution", "required_skills": ["detail-oriented", "reliable"]}', 2),
    ('team_gaps', '{"team_id": 3, "focus_areas": ["technical", "leadership"]}', 3),
    ('build_team', '{"project_type": "strategic", "team_size": 5, "required_types": ["V", "E", "C"]}', 4)
) AS data(request_type, context, days_ago)
ON CONFLICT DO NOTHING;

-- Create recommendations based on the requests
WITH recent_requests AS (
  SELECT id, request_type, context::jsonb
  FROM recommendation_requests
  WHERE company_id = 1
  ORDER BY created_at DESC
  LIMIT 4
)
INSERT INTO recommendations (
  request_id,
  recommended_user_id,
  score,
  reasoning,
  impact_analysis,
  created_at
)
SELECT 
  rr.id,
  u.id,
  75 + (RANDOM() * 20)::int,
  jsonb_build_object(
    'type_match', 'High compatibility with team composition',
    'dimension_balance', 'Improves team balance in ' || hp.hugo_type || ' dimensions',
    'project_fit', 'Strong fit for ' || (rr.context->>'project_type') || ' projects',
    'synergy_potential', 'Expected synergy improvement of 15-20%'
  ),
  jsonb_build_object(
    'current_synergy', 72,
    'projected_synergy', 87,
    'improvement', 15,
    'risk_factors', jsonb_build_array('None identified'),
    'success_probability', 0.85
  ),
  NOW() - (INTERVAL '1 day' * (4 - row_number() OVER ()))
FROM recent_requests rr
CROSS JOIN LATERAL (
  SELECT u.id, hp.hugo_type
  FROM users u
  JOIN hugo_profiles hp ON hp.user_id = u.id
  WHERE u.email IN (
    'daniel.lee@democompany.com',
    'william.moore@democompany.com',
    'mia.jackson@democompany.com',
    'isabella.harris@democompany.com'
  )
  ORDER BY RANDOM()
  LIMIT 1
) u(id, hugo_type)
ON CONFLICT DO NOTHING;

-- Create feedback for some recommendations
WITH recent_recommendations AS (
  SELECT id, recommended_user_id
  FROM recommendations
  ORDER BY created_at DESC
  LIMIT 3
)
INSERT INTO recommendation_feedback (
  recommendation_id,
  feedback_type,
  rating,
  comment,
  actual_outcome,
  created_at
)
SELECT 
  id,
  CASE 
    WHEN row_number() OVER () = 1 THEN 'accepted'
    WHEN row_number() OVER () = 2 THEN 'accepted'
    ELSE 'rejected'
  END,
  CASE 
    WHEN row_number() OVER () <= 2 THEN 4 + (RANDOM())::int
    ELSE 2 + (RANDOM())::int
  END,
  CASE 
    WHEN row_number() OVER () = 1 THEN 'Excellent recommendation! Team synergy improved significantly.'
    WHEN row_number() OVER () = 2 THEN 'Good fit, working well with the team.'
    ELSE 'Not the right timing for this addition.'
  END,
  CASE 
    WHEN row_number() OVER () <= 2 THEN jsonb_build_object(
      'synergy_improvement', 12 + (RANDOM() * 8)::int,
      'performance_rating', 4.2 + (RANDOM() * 0.8),
      'team_satisfaction', 0.85 + (RANDOM() * 0.10)
    )
    ELSE NULL
  END,
  NOW() - (INTERVAL '12 hours' * row_number() OVER ())
FROM recent_recommendations
ON CONFLICT DO NOTHING;

-- Summary of created data
DO $$
DECLARE
  user_count INT;
  team_count INT;
  request_count INT;
  recommendation_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users WHERE email LIKE '%@democompany.com';
  SELECT COUNT(*) INTO team_count FROM teams WHERE company_id = 1;
  SELECT COUNT(*) INTO request_count FROM recommendation_requests WHERE company_id = 1;
  SELECT COUNT(*) INTO recommendation_count FROM recommendations;
  
  RAISE NOTICE '=== Demo Data Created Successfully ===';
  RAISE NOTICE 'Users created: %', user_count;
  RAISE NOTICE 'Teams created: %', team_count;
  RAISE NOTICE 'Recommendation requests: %', request_count;
  RAISE NOTICE 'Recommendations generated: %', recommendation_count;
  RAISE NOTICE '=====================================';
END $$;
