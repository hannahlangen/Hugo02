-- Demo Users for Testing Hugo Platform
-- This script adds demo users for all three roles

-- Password for all demo accounts: 'demo123'
-- Hash generated with bcrypt for 'demo123'
-- $2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i

-- Hugo Manager (Platform Admin)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) 
VALUES ('hugo@hugoatwork.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Hugo', 'Manager', 'hugo_manager', true)
ON CONFLICT (email) DO NOTHING;

-- HR Manager for Demo Company
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, department, position, is_active) 
VALUES ('hr@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Anna', 'Schmidt', 'hr_manager', 1, 'Human Resources', 'HR Manager', true)
ON CONFLICT (email) DO NOTHING;

-- Regular User for Demo Company
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, department, position, hugo_type, cultural_background, is_active) 
VALUES ('user@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Max', 'Mustermann', 'user', 1, 'Product Development', 'Product Manager', 'V1', 'Germany', true)
ON CONFLICT (email) DO NOTHING;

-- Additional demo users for the team
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, department, position, hugo_type, cultural_background, is_active) VALUES
('sarah.wilson@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Sarah', 'Wilson', 'user', 1, 'Engineering', 'Senior Developer', 'I2', 'USA', true),
('mike.chen@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Mike', 'Chen', 'user', 1, 'Engineering', 'Tech Lead', 'E1', 'China', true),
('lisa.garcia@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Lisa', 'Garcia', 'user', 1, 'Marketing', 'Marketing Manager', 'C2', 'Spain', true)
ON CONFLICT (email) DO NOTHING;

-- Add users to the demo team (assuming team ID 1 exists)
INSERT INTO team_members (team_id, user_id, role) 
SELECT 1, u.id, 'member' 
FROM users u 
WHERE u.email IN ('user@democompany.com', 'sarah.wilson@democompany.com', 'mike.chen@democompany.com', 'lisa.garcia@democompany.com')
AND NOT EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = 1 AND tm.user_id = u.id);

-- Set team lead
UPDATE team_members SET role = 'lead' 
WHERE team_id = 1 AND user_id = (SELECT id FROM users WHERE email = 'user@democompany.com');

-- Update team lead in teams table
UPDATE teams SET team_lead_id = (SELECT id FROM users WHERE email = 'user@democompany.com') WHERE id = 1;

COMMENT ON TABLE users IS 'Demo users created with password: demo123';
