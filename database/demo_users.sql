-- 03_demo_users.sql
-- Demo-User für alle Rollen + Teamzuordnung, idempotent.

-- Alle Demo-Accounts: Passwort 'demo123' (bcrypt-Hash unten)
-- $2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i

-- Hugo Manager
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
VALUES ('hugo@hugoatwork.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Hugo', 'Manager', 'hugo_manager', true)
ON CONFLICT (email) DO NOTHING;

-- HR Manager (Demo Company)
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, department, position, is_active)
SELECT 'hr@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i',
       'Anna','Schmidt','hr_manager', c.id, 'Human Resources','HR Manager', true
FROM companies c
WHERE c.domain='demo-company.com'
AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email='hr@democompany.com');

-- Regular User
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, department, position, hugo_type, cultural_background, is_active)
SELECT 'user@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i',
       'Max','Mustermann','user', c.id, 'Product Development','Product Manager','V1','Germany', true
FROM companies c
WHERE c.domain='demo-company.com'
AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email='user@democompany.com');

-- Weitere Demo-User
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, department, position, hugo_type, cultural_background, is_active)
SELECT v.email, v.hash, v.first_name, v.last_name, 'user', c.id, v.department, v.position, v.hugo_type, v.culture, true
FROM (VALUES
  ('sarah.wilson@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Sarah','Wilson','Engineering','Senior Developer','I2','USA'),
  ('mike.chen@democompany.com',   '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Mike','Chen','Engineering','Tech Lead','E1','China'),
  ('lisa.garcia@democompany.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Lisa','Garcia','Marketing','Marketing Manager','C2','Spain')
) AS v(email, hash, first_name, last_name, department, position, hugo_type, culture)
JOIN companies c ON c.domain='demo-company.com'
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.email = v.email);

-- Teamzuordnung (kein hartes team_id = 1)
-- Alle genannten User als Member ins Team 'Product Development'
INSERT INTO team_members (team_id, user_id, role)
SELECT t.id, u.id, 'member'
FROM companies c
JOIN teams t ON t.company_id=c.id AND t.name='Product Development'
JOIN users u ON u.email IN ('user@democompany.com','sarah.wilson@democompany.com','mike.chen@democompany.com','lisa.garcia@democompany.com')
WHERE c.domain='demo-company.com'
AND NOT EXISTS (
  SELECT 1 FROM team_members tm WHERE tm.team_id=t.id AND tm.user_id=u.id
);

-- Team Lead setzen: user@democompany.com
UPDATE teams t
SET team_lead_id = u.id
FROM companies c
JOIN users u ON u.email='user@democompany.com'
WHERE t.company_id=c.id AND c.domain='demo-company.com' AND t.name='Product Development'
  AND (t.team_lead_id IS DISTINCT FROM u.id);

-- Optional: Rolle 'lead' in team_members für den Lead setzen
--UPDATE team_members tm
--SET role='lead'
--FROM companies c
--JOIN teams t ON t.id=team_id
--JOIN users u ON u.id=user_id
--WHERE c.domain='demo-company.com' AND t.company_id=c.id AND t.name='Product Development' AND u.email='user@democompany.com' AND role <> 'lead';

