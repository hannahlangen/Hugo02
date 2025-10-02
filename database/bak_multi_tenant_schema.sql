-- Multi-Tenant Hugo Platform Database Schema
-- Supports Hugo Manager, HR Manager, and User roles with proper hierarchy

-- Companies (Tenants/Customers)
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    max_users INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    billing_email VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    logo_url VARCHAR(500)
);

-- User Roles Enum
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('hugo_manager', 'hr_manager', 'user');

-- Users with Multi-Tenant Support
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role NOT NULL DEFAULT 'user',
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    hugo_type VARCHAR(10), -- V1, V2, V3, I1, I2, I3, E1, E2, E3, C1, C2, C3
    cultural_background VARCHAR(100), -- For Erin Meyer's Culture Map
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    
    -- Ensure HR Managers and Users belong to a company
    CONSTRAINT users_company_check CHECK (
        (role = 'hugo_manager' AND company_id IS NULL) OR 
        (role IN ('hr_manager', 'user') AND company_id IS NOT NULL)
    )
);

-- Teams within Companies
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id),
    synergy_score DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    team_lead_id INTEGER REFERENCES users(id),
    department VARCHAR(100),
    project_focus VARCHAR(255)
);

-- Team Memberships
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- 'lead', 'member', 'contributor'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(team_id, user_id)
);

-- Assessment Sessions
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'expired'
    invited_by INTEGER REFERENCES users(id),
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    results JSONB, -- Store assessment results
    cultural_background VARCHAR(100),
    hugo_type_result VARCHAR(10)
);

-- Assessment Responses
CREATE TABLE IF NOT EXISTS assessment_responses (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    dimension_scores JSONB, -- Store V, I, E, C scores for this response
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Settings
CREATE TABLE IF NOT EXISTS company_settings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(company_id, setting_key)
);

-- Audit Log for Hugo Manager
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    company_id INTEGER REFERENCES companies(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'company', 'user', 'team', 'assessment'
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS permissions CASCADE;
-- Permissions System
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL, -- 'companies', 'users', 'teams', 'assessments'
    action VARCHAR(50) NOT NULL -- 'create', 'read', 'update', 'delete', 'manage'
);

-- Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    permission_id INTEGER NOT NULL REFERENCES permissions(id),
    
    UNIQUE(role, permission_id)
);


-- Insert Default Permissions
INSERT INTO permissions (name, description, resource, action) VALUES
-- Hugo Manager Permissions (Platform Admin)
('manage_companies', 'Manage all companies on the platform', 'companies', 'manage'),
('view_all_users', 'View all users across all companies', 'users', 'read'),
('manage_platform_settings', 'Manage platform-wide settings', 'platform', 'manage'),
('view_platform_analytics', 'View platform-wide analytics', 'analytics', 'read'),
('manage_billing', 'Manage billing and subscriptions', 'billing', 'manage'),

-- HR Manager Permissions (Company Admin)
('manage_company_users', 'Manage users within own company', 'users', 'manage'),
('manage_company_teams', 'Manage teams within own company', 'teams', 'manage'),
('send_assessments', 'Send assessment invitations', 'assessments', 'create'),
('view_company_analytics', 'View company analytics', 'analytics', 'read'),
('manage_company_settings', 'Manage company settings', 'company', 'manage'),

-- User Permissions (Employee)
('view_own_profile', 'View own profile and assessment results', 'profile', 'read'),
('update_own_profile', 'Update own profile information', 'profile', 'update'),
('view_own_teams', 'View teams user belongs to', 'teams', 'read'),
('take_assessments', 'Take personality assessments', 'assessments', 'take');

-- Assign Permissions to Roles
INSERT INTO role_permissions (role, permission_id) 
SELECT 'hugo_manager', id FROM permissions WHERE resource IN ('companies', 'users', 'platform', 'analytics', 'billing');

INSERT INTO role_permissions (role, permission_id) 
SELECT 'hr_manager', id FROM permissions WHERE name IN ('manage_company_users', 'manage_company_teams', 'send_assessments', 'view_company_analytics', 'manage_company_settings');

INSERT INTO role_permissions (role, permission_id) 
SELECT 'user', id FROM permissions WHERE name IN ('view_own_profile', 'update_own_profile', 'view_own_teams', 'take_assessments');

-- Create Indexes for Performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_teams_company_id ON teams(company_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_assessment_sessions_company_id ON assessment_sessions(company_id);
CREATE INDEX idx_assessment_sessions_token ON assessment_sessions(session_token);
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create Default Hugo Manager (Super Admin)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) 
VALUES ('admin@hugo-platform.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Hugo', 'Admin', 'hugo_manager', true);

-- Create Sample Company
INSERT INTO companies (name, domain, subscription_plan, max_users, billing_email, contact_person) 
VALUES ('Demo Company GmbH', 'demo-company.com', 'premium', 100, 'billing@demo-company.com', 'Max Mustermann');

-- Create Sample HR Manager
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, is_active) 
VALUES ('hr@demo-company.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Anna', 'Schmidt', 'hr_manager', 1, true);

-- Create Sample Team
INSERT INTO teams (name, description, company_id, created_by, team_lead_id) 
VALUES ('Product Development', 'Main product development team', 1, 2, 2);

-- Functions for Multi-Tenant Security
CREATE OR REPLACE FUNCTION check_company_access(user_id INTEGER, target_company_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    user_role user_role;
    user_company_id INTEGER;
BEGIN
    SELECT role, company_id INTO user_role, user_company_id 
    FROM users WHERE id = user_id;
    
    -- Hugo Manager can access all companies
    IF user_role = 'hugo_manager' THEN
        RETURN TRUE;
    END IF;
    
    -- HR Manager and Users can only access their own company
    IF user_role IN ('hr_manager', 'user') AND user_company_id = target_company_id THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security Policies (Optional - for extra security)
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE companies IS 'Multi-tenant companies/customers on the Hugo platform';
COMMENT ON TABLE users IS 'Users with role-based access: hugo_manager, hr_manager, user';
COMMENT ON TABLE teams IS 'Teams within companies for collaboration and synergy analysis';
COMMENT ON TABLE assessment_sessions IS 'Assessment invitations and sessions for onboarding';
COMMENT ON TABLE audit_logs IS 'Audit trail for Hugo Manager oversight';
