-- Hugo Platform Multi-Tenant Database Initialization
-- This script sets up the complete multi-tenant database structure

-- Create database if not exists (handled by Docker)
-- CREATE DATABASE hugo_platform;

-- Database is already created by Docker environment variable

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS company_settings CASCADE;
DROP TABLE IF EXISTS assessment_responses CASCADE;
DROP TABLE IF EXISTS assessment_sessions CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;

-- Execute the multi-tenant schema
\i /docker-entrypoint-initdb.d/02_multi_tenant_schema.sql

-- Insert Hugo Personality Types Reference Data
CREATE TABLE hugo_personality_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    dimension VARCHAR(20) NOT NULL, -- 'Vision', 'Innovation', 'Expertise', 'Connection'
    description TEXT,
    strengths TEXT[],
    development_areas TEXT[],
    ideal_roles TEXT[],
    communication_style TEXT,
    team_contribution TEXT,
    color_primary VARCHAR(7), -- Hex color
    color_secondary VARCHAR(7)
);

-- Insert all 12 Hugo Types
INSERT INTO hugo_personality_types (code, name, dimension, description, strengths, development_areas, ideal_roles, communication_style, team_contribution, color_primary, color_secondary) VALUES
-- Vision People (V)
('V1', 'Pathfinder', 'Vision', 'Strategic visionary who sees the big picture and charts new territories', 
 ARRAY['Strategic thinking', 'Innovation', 'Leadership', 'Future-oriented'], 
 ARRAY['Detail execution', 'Patience with routine tasks', 'Delegation'],
 ARRAY['CEO', 'Strategy Director', 'Innovation Lead', 'Entrepreneur'],
 'Direct, inspiring, future-focused',
 'Sets direction and motivates team toward long-term goals',
 '#8B5CF6', '#A78BFA'),

('V2', 'Developer', 'Vision', 'Systematic builder who transforms visions into structured realities',
 ARRAY['System design', 'Process optimization', 'Project management', 'Quality focus'],
 ARRAY['Flexibility', 'Rapid prototyping', 'Risk tolerance'],
 ARRAY['CTO', 'Product Manager', 'System Architect', 'Operations Director'],
 'Structured, methodical, solution-oriented',
 'Builds robust systems and processes for team success',
 '#7C3AED', '#8B5CF6'),

('V3', 'Organizer', 'Vision', 'Efficient coordinator who ensures visions become actionable plans',
 ARRAY['Planning', 'Coordination', 'Efficiency', 'Resource management'],
 ARRAY['Spontaneity', 'Ambiguity tolerance', 'Creative thinking'],
 ARRAY['COO', 'Program Manager', 'Business Analyst', 'Team Lead'],
 'Clear, organized, goal-oriented',
 'Ensures team stays organized and on track',
 '#6D28D9', '#7C3AED'),

-- Innovation People (I)
('I1', 'Creator', 'Innovation', 'Original thinker who generates breakthrough ideas and concepts',
 ARRAY['Creativity', 'Original thinking', 'Problem solving', 'Inspiration'],
 ARRAY['Implementation', 'Routine tasks', 'Detail focus'],
 ARRAY['Creative Director', 'R&D Lead', 'Innovation Manager', 'Designer'],
 'Inspiring, imaginative, conceptual',
 'Brings fresh perspectives and creative solutions',
 '#F59E0B', '#FBBF24'),

('I2', 'Experimenter', 'Innovation', 'Hands-on innovator who tests and refines new approaches',
 ARRAY['Experimentation', 'Rapid prototyping', 'Learning agility', 'Adaptability'],
 ARRAY['Long-term planning', 'Risk aversion', 'Perfectionism'],
 ARRAY['Product Developer', 'UX Researcher', 'Innovation Specialist', 'Startup Founder'],
 'Curious, experimental, iterative',
 'Tests ideas and helps team learn through experimentation',
 '#D97706', '#F59E0B'),

('I3', 'Optimizer', 'Innovation', 'Continuous improver who enhances existing solutions',
 ARRAY['Process improvement', 'Efficiency optimization', 'Quality enhancement', 'Analysis'],
 ARRAY['Radical change', 'Unstructured environments', 'Blue-sky thinking'],
 ARRAY['Process Manager', 'Quality Lead', 'Business Improvement', 'Consultant'],
 'Analytical, improvement-focused, systematic',
 'Continuously improves team processes and outcomes',
 '#B45309', '#D97706'),

-- Expertise People (E)
('E1', 'Specialist', 'Expertise', 'Deep expert who masters specific domains and technologies',
 ARRAY['Deep expertise', 'Technical mastery', 'Quality standards', 'Precision'],
 ARRAY['Broad perspective', 'Delegation', 'Non-technical communication'],
 ARRAY['Technical Lead', 'Subject Matter Expert', 'Researcher', 'Consultant'],
 'Precise, detailed, knowledge-focused',
 'Provides deep expertise and maintains quality standards',
 '#10B981', '#34D399'),

('E2', 'Advisor', 'Expertise', 'Knowledgeable guide who shares expertise to help others succeed',
 ARRAY['Knowledge sharing', 'Mentoring', 'Problem solving', 'Teaching'],
 ARRAY['Self-promotion', 'Competitive environments', 'Time management'],
 ARRAY['Senior Consultant', 'Mentor', 'Training Manager', 'Technical Advisor'],
 'Supportive, educational, collaborative',
 'Develops team capabilities through knowledge sharing',
 '#059669', '#10B981'),

('E3', 'Implementer', 'Expertise', 'Reliable executor who delivers high-quality results consistently',
 ARRAY['Execution excellence', 'Reliability', 'Quality delivery', 'Consistency'],
 ARRAY['Innovation', 'Ambiguity', 'Rapid change'],
 ARRAY['Senior Developer', 'Operations Manager', 'Quality Assurance', 'Project Lead'],
 'Reliable, thorough, results-oriented',
 'Ensures consistent, high-quality delivery',
 '#047857', '#059669'),

-- Connection People (C)
('C1', 'Networker', 'Connection', 'Relationship builder who connects people and creates opportunities',
 ARRAY['Relationship building', 'Networking', 'Communication', 'Opportunity creation'],
 ARRAY['Deep technical work', 'Solitary tasks', 'Conflict situations'],
 ARRAY['Sales Director', 'Partnership Manager', 'Community Manager', 'Business Development'],
 'Engaging, enthusiastic, people-focused',
 'Builds external connections and opportunities for team',
 '#EF4444', '#F87171'),

('C2', 'Collaborator', 'Connection', 'Team player who facilitates cooperation and shared success',
 ARRAY['Teamwork', 'Facilitation', 'Consensus building', 'Cooperation'],
 ARRAY['Individual accountability', 'Difficult decisions', 'Conflict resolution'],
 ARRAY['Team Lead', 'Scrum Master', 'HR Manager', 'Project Coordinator'],
 'Collaborative, inclusive, team-oriented',
 'Facilitates team collaboration and shared decision-making',
 '#DC2626', '#EF4444'),

('C3', 'Supporter', 'Connection', 'Caring helper who ensures team members feel valued and supported',
 ARRAY['Empathy', 'Support', 'Team morale', 'Individual care'],
 ARRAY['Tough decisions', 'Performance management', 'Competitive pressure'],
 ARRAY['HR Business Partner', 'Team Coach', 'Customer Success', 'Support Manager'],
 'Empathetic, caring, supportive',
 'Maintains team morale and individual well-being',
 '#B91C1C', '#DC2626');

-- Culture Map Dimensions (Erin Meyer's Framework)
CREATE TABLE culture_dimensions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    low_context_label VARCHAR(100),
    high_context_label VARCHAR(100)
);

INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label) VALUES
('Communication', 'How explicitly information is communicated', 'Low-Context (Direct)', 'High-Context (Indirect)'),
('Evaluation', 'How feedback is given', 'Direct Negative Feedback', 'Indirect Negative Feedback'),
('Persuasion', 'How arguments are built', 'Principles-First', 'Applications-First'),
('Leading', 'How hierarchy and authority work', 'Egalitarian', 'Hierarchical'),
('Deciding', 'How decisions are made', 'Consensual', 'Top-Down'),
('Trusting', 'How trust is built', 'Task-Based', 'Relationship-Based'),
('Disagreeing', 'How disagreement is handled', 'Confrontational', 'Avoids Confrontation'),
('Scheduling', 'How time is managed', 'Linear-Time', 'Flexible-Time');

-- User Culture Profiles (for Erin Meyer's Culture Map)
CREATE TABLE user_culture_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dimension_id INTEGER NOT NULL REFERENCES culture_dimensions(id),
    score INTEGER CHECK (score >= 1 AND score <= 10), -- 1 = low context, 10 = high context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, dimension_id)
);

-- Team Synergy Calculations
CREATE TABLE team_synergy_metrics (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    dimension VARCHAR(20) NOT NULL, -- 'Vision', 'Innovation', 'Expertise', 'Connection'
    score DECIMAL(5,2) NOT NULL,
    member_count INTEGER NOT NULL,
    diversity_index DECIMAL(5,2), -- How diverse the team is in this dimension
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data for Testing
-- Insert sample users for the demo company
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, hugo_type, cultural_background, department, position) VALUES
('john.doe@demo-company.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'John', 'Doe', 'user', 1, 'V1', 'Germany', 'Product', 'Product Manager'),
('sarah.wilson@demo-company.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Sarah', 'Wilson', 'user', 1, 'I2', 'USA', 'Engineering', 'Senior Developer'),
('mike.chen@demo-company.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Mike', 'Chen', 'user', 1, 'E1', 'China', 'Engineering', 'Tech Lead'),
('lisa.garcia@demo-company.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Lisa', 'Garcia', 'user', 1, 'C2', 'Spain', 'Marketing', 'Marketing Manager');

-- Add users to the sample team
INSERT INTO team_members (team_id, user_id, role) VALUES
(1, 3, 'lead'), -- John Doe as team lead
(1, 4, 'member'), -- Sarah Wilson
(1, 5, 'member'), -- Mike Chen
(1, 6, 'member'); -- Lisa Garcia

-- Calculate initial team synergy
INSERT INTO team_synergy_metrics (team_id, dimension, score, member_count, diversity_index) VALUES
(1, 'Vision', 75.5, 4, 0.25),
(1, 'Innovation', 82.0, 4, 0.50),
(1, 'Expertise', 88.5, 4, 0.75),
(1, 'Connection', 70.0, 4, 0.25);

-- Update team synergy score
UPDATE teams SET synergy_score = 79.0 WHERE id = 1;

-- Create views for easier data access
CREATE VIEW company_overview AS
SELECT 
    c.id,
    c.name,
    c.subscription_plan,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT t.id) as total_teams,
    COUNT(DISTINCT CASE WHEN u.role = 'hr_manager' THEN u.id END) as hr_managers,
    AVG(t.synergy_score) as avg_team_synergy,
    c.created_at
FROM companies c
LEFT JOIN users u ON c.id = u.company_id AND u.is_active = true
LEFT JOIN teams t ON c.id = t.company_id AND t.is_active = true
GROUP BY c.id, c.name, c.subscription_plan, c.created_at;

CREATE VIEW user_team_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.hugo_type,
    u.company_id,
    c.name as company_name,
    COUNT(tm.team_id) as team_count,
    STRING_AGG(t.name, ', ') as teams
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
LEFT JOIN team_members tm ON u.id = tm.user_id AND tm.is_active = true
LEFT JOIN teams t ON tm.team_id = t.id AND t.is_active = true
WHERE u.is_active = true
GROUP BY u.id, u.email, u.first_name, u.last_name, u.hugo_type, u.company_id, c.name;

COMMENT ON DATABASE hugo_platform IS 'Multi-tenant Hugo personality assessment and team building platform';
