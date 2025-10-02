-- 02_multi_tenant_schema.sql
-- Kern-Schema + Defaultdaten + Zusatztabellen/-views, idempotent.

-- 1) Enum-Typ sicher anlegen (kein DROP hier!)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('hugo_manager', 'hr_manager', 'user');
  END IF;
END$$;

-- 2) Kernschema -------------------------------------------------------------

-- Companies
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

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role NOT NULL DEFAULT 'user',
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    hugo_type VARCHAR(10),
    cultural_background VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    CONSTRAINT users_company_check CHECK (
        (role = 'hugo_manager' AND company_id IS NULL) OR
        (role IN ('hr_manager', 'user') AND company_id IS NOT NULL)
    )
);

-- Teams
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

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(team_id, user_id)
);

-- Assessments
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    invited_by INTEGER REFERENCES users(id),
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    results JSONB,
    cultural_background VARCHAR(100),
    hugo_type_result VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS assessment_responses (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    dimension_scores JSONB,
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

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    company_id INTEGER REFERENCES companies(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL
);

-- Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    permission_id INTEGER NOT NULL REFERENCES permissions(id),
    UNIQUE(role, permission_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_teams_company_id ON teams(company_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_company_id ON assessment_sessions(company_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_token ON assessment_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 3) Default-Daten (idempotent) -------------------------------------------

-- Permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('manage_companies','Manage all companies on the platform','companies','manage'),
('view_all_users','View all users across all companies','users','read'),
('manage_platform_settings','Manage platform-wide settings','platform','manage'),
('view_platform_analytics','View platform-wide analytics','analytics','read'),
('manage_billing','Manage billing and subscriptions','billing','manage'),
('manage_company_users','Manage users within own company','users','manage'),
('manage_company_teams','Manage teams within own company','teams','manage'),
('send_assessments','Send assessment invitations','assessments','create'),
('view_company_analytics','View company analytics','analytics','read'),
('manage_company_settings','Manage company settings','company','manage'),
('view_own_profile','View own profile and assessment results','profile','read'),
('update_own_profile','Update own profile information','profile','update'),
('view_own_teams','View teams user belongs to','teams','read'),
('take_assessments','Take personality assessments','assessments','take')
ON CONFLICT (name) DO NOTHING;

-- Rollen → Berechtigungen
INSERT INTO role_permissions (role, permission_id)
SELECT 'hugo_manager', p.id FROM permissions p
WHERE p.resource IN ('companies','users','platform','analytics','billing')
ON CONFLICT (role, permission_id) DO NOTHING;

INSERT INTO role_permissions (role, permission_id)
SELECT 'hr_manager', p.id FROM permissions p
WHERE p.name IN ('manage_company_users','manage_company_teams','send_assessments','view_company_analytics','manage_company_settings')
ON CONFLICT (role, permission_id) DO NOTHING;

INSERT INTO role_permissions (role, permission_id)
SELECT 'user', p.id FROM permissions p
WHERE p.name IN ('view_own_profile','update_own_profile','view_own_teams','take_assessments')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Admin-User
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
VALUES ('admin@hugo-platform.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i', 'Hugo', 'Admin', 'hugo_manager', true)
ON CONFLICT (email) DO NOTHING;

-- Demo-Company
INSERT INTO companies (name, domain, subscription_plan, max_users, billing_email, contact_person)
VALUES ('Demo Company GmbH', 'demo-company.com', 'premium', 100, 'billing@demo-company.com', 'Max Mustermann')
ON CONFLICT (domain) DO NOTHING;

-- HR-Manager für Demo-Company
INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, is_active)
SELECT 'hr@demo-company.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rS.DTDtnbJioy3B9Q5qHiMiNEQP.H6i',
       'Anna','Schmidt','hr_manager', c.id, true
FROM companies c
WHERE c.domain='demo-company.com'
AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email='hr@demo-company.com');

-- Produkt-Team für Demo-Company
INSERT INTO teams (name, description, company_id)
SELECT 'Product Development','Main product development team', c.id
FROM companies c
WHERE c.domain='demo-company.com'
AND NOT EXISTS (
  SELECT 1 FROM teams t WHERE t.name='Product Development' AND t.company_id=c.id
);

-- 4) Zusatzobjekte (Hugo-Typen, Culture Map, Profile, Synergy) ------------

-- Hugo Personality Types
CREATE TABLE IF NOT EXISTS hugo_personality_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    dimension VARCHAR(20) NOT NULL,
    description TEXT,
    strengths TEXT[],
    development_areas TEXT[],
    ideal_roles TEXT[],
    communication_style TEXT,
    team_contribution TEXT,
    color_primary VARCHAR(7),
    color_secondary VARCHAR(7)
);

-- (12 Typen) – idempotent

-- (12 Typen) – Hugo System Official Types
INSERT INTO hugo_personality_types (code, name, dimension, description, strengths, development_areas, ideal_roles, communication_style, team_contribution, color_primary, color_secondary) VALUES

-- VISION Dimension
('V1','Der Wegweiser / The Pathfinder','Vision','Zeigt den Weg zu einer besseren Zukunft. Natürlicher Stratege, der komplexe Situationen durchdringt und klare Richtungen vorgibt.',
 ARRAY['Strategisches Denken','Entscheidungskraft','Führungsqualität','Visionäre Ausrichtung'],
 ARRAY['Geduld mit Details','Delegation','Mikromanagement vermeiden'],
 ARRAY['CEO','Strategie-Direktor','Innovations-Lead','Unternehmer'],
 'Direkt, inspirierend, zukunftsorientiert','Gibt Richtung vor und motiviert das Team zu langfristigen Zielen','#8B5CF6','#A78BFA'),

('V2','Der Entwickler / The Developer','Vision','Hilft Menschen und Teams zu wachsen. Menschen-Magnet, der das Beste in anderen erkennt und herausholt.',
 ARRAY['Menschen-Entwicklung','Empathische Führung','Team-Inspiration','Potenzial-Erkennung'],
 ARRAY['Schwierige Gespräche','Grenzen setzen','Distanz wahren'],
 ARRAY['People Manager','Talent-Entwickler','Coach','HR-Direktor'],
 'Unterstützend, entwicklungsorientiert, empathisch','Entwickelt Teammitglieder und fördert persönliches Wachstum','#7C3AED','#8B5CF6'),

('V3','Der Organisator / The Organizer','Vision','Schafft Ordnung und Struktur. Meister der Effizienz, der Chaos in funktionierende Systeme verwandelt.',
 ARRAY['Planung','Koordination','Effizienz','Ressourcen-Management'],
 ARRAY['Flexibilität','Spontanität','Ambiguität-Toleranz'],
 ARRAY['COO','Programm-Manager','Business Analyst','Team Lead'],
 'Strukturiert, methodisch, lösungsorientiert','Schafft Ordnung und sorgt für reibungslose Abläufe','#6D28D9','#7C3AED'),

-- INNOVATION Dimension  
('I1','Der Pionier / The Pioneer','Innovation','Erschließt neue Territorien. Mutiger Vorreiter, der unbekannte Wege geht und Neues entdeckt.',
 ARRAY['Innovation','Risikobereitschaft','Kreativität','Pioniergeist'],
 ARRAY['Ausdauer','Detailarbeit','Routine-Aufgaben'],
 ARRAY['Innovations-Manager','Startup-Gründer','R&D-Lead','Visionär'],
 'Mutig, experimentierfreudig, zukunftsorientiert','Bringt radikale neue Ideen und Ansätze ins Team','#F59E0B','#FBBF24'),

('I2','Der Architekt / The Architect','Innovation','Entwirft neue Lösungen. Kreativer Konstrukteur, der innovative Konzepte in funktionierende Designs verwandelt.',
 ARRAY['System-Design','Konzeptionelle Stärke','Problemlösung','Technische Innovation'],
 ARRAY['Schnelle Umsetzung','Pragmatismus','Kompromisse'],
 ARRAY['Solution Architect','Design Lead','CTO','Produkt-Architekt'],
 'Konzeptionell, durchdacht, designorientiert','Entwickelt innovative Lösungsarchitekturen für komplexe Probleme','#D97706','#F59E0B'),

('I3','Der Inspirator / The Inspirator','Innovation','Begeistert und motiviert. Charismatischer Katalysator, der andere für neue Ideen entflammt.',
 ARRAY['Begeisterungsfähigkeit','Kommunikation','Motivation','Energie'],
 ARRAY['Kontinuität','Detailarbeit','Nachbereitung'],
 ARRAY['Change Agent','Motivations-Speaker','Marketing-Lead','Kultur-Botschafter'],
 'Energiegeladen, begeisternd, mitreißend','Motiviert das Team und schafft Begeisterung für Neues','#B45309','#D97706'),

-- EXPERTISE Dimension
('E1','Der Forscher / The Researcher','Expertise','Erforscht die Tiefe. Neugieriger Analytiker, der komplexe Zusammenhänge durchdringt und neue Erkenntnisse gewinnt.',
 ARRAY['Analytisches Denken','Forschung','Tiefes Verständnis','Wissbegierde'],
 ARRAY['Praktische Umsetzung','Zeitmanagement','Kommunikation von Komplexität'],
 ARRAY['Researcher','Data Scientist','Analyst','Wissenschaftler'],
 'Analytisch, gründlich, wissensorientiert','Liefert fundierte Analysen und tiefes Fachwissen','#10B981','#34D399'),

('E2','Der Meister / The Master','Expertise','Beherrscht sein Handwerk. Exzellenter Könner, der durch jahrelange Praxis zur Perfektion gelangt ist.',
 ARRAY['Meisterschaft','Qualität','Präzision','Handwerkskunst'],
 ARRAY['Delegation','Wissenstransfer','Geduld mit Anfängern'],
 ARRAY['Senior Expert','Master Craftsman','Technical Lead','Qualitäts-Manager'],
 'Präzise, qualitätsorientiert, meisterhaft','Setzt höchste Qualitätsstandards und liefert exzellente Ergebnisse','#059669','#10B981'),

('E3','Der Berater / The Advisor','Expertise','Teilt sein Wissen. Weiser Ratgeber, der andere durch Expertise und Erfahrung zum Erfolg führt.',
 ARRAY['Beratung','Wissenstransfer','Mentoring','Problemlösung'],
 ARRAY['Selbstvermarktung','Abgrenzung','Zeitmanagement'],
 ARRAY['Senior Consultant','Mentor','Berater','Fachexperte'],
 'Unterstützend, lehrend, beratend','Entwickelt Team-Fähigkeiten durch Wissensaustausch','#047857','#059669'),

-- KOLLABORATION Dimension
('C1','Der Harmonizer / The Harmonizer','Kollaboration','Schafft Harmonie. Diplomatischer Vermittler, der Konflikte löst und ein positives Miteinander fördert.',
 ARRAY['Konfliktlösung','Diplomatie','Empathie','Harmonie-Schaffung'],
 ARRAY['Durchsetzungsvermögen','Schwierige Entscheidungen','Konfrontation'],
 ARRAY['Mediator','HR Business Partner','Team Coach','Konflikt-Manager'],
 'Diplomatisch, ausgleichend, harmonisierend','Schafft positive Atmosphäre und löst Konflikte','#EF4444','#F87171'),

('C2','Der Brückenbauer / The Bridge Builder','Kollaboration','Verbindet Menschen. Geschickter Netzwerker, der Silos überwindet und Zusammenarbeit ermöglicht.',
 ARRAY['Netzwerken','Verbindungen schaffen','Zusammenarbeit','Kommunikation'],
 ARRAY['Tiefgang','Fokus','Spezialisierung'],
 ARRAY['Partnership Manager','Community Manager','Scrum Master','Koordinator'],
 'Verbindend, netzwerkend, kollaborativ','Baut Brücken zwischen Teams und Abteilungen','#DC2626','#EF4444'),

('C3','Der Umsetzer / The Implementer','Kollaboration','Setzt gemeinsam um. Verlässlicher Teamplayer, der Pläne in die Tat umsetzt und Ergebnisse liefert.',
 ARRAY['Umsetzungsstärke','Zuverlässigkeit','Teamwork','Ergebnisorientierung'],
 ARRAY['Eigeninitiative','Innovation','Strategisches Denken'],
 ARRAY['Project Manager','Operations Lead','Team Lead','Delivery Manager'],
 'Zuverlässig, umsetzungsstark, teamorientiert','Sorgt für konsequente Umsetzung und Zielerreichung','#B91C1C','#DC2626')

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  dimension = EXCLUDED.dimension,
  description = EXCLUDED.description,
  strengths = EXCLUDED.strengths,
  development_areas = EXCLUDED.development_areas,
  ideal_roles = EXCLUDED.ideal_roles,
  communication_style = EXCLUDED.communication_style,
  team_contribution = EXCLUDED.team_contribution,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary;

-- Culture Map
CREATE TABLE IF NOT EXISTS culture_dimensions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    low_context_label VARCHAR(100),
    high_context_label VARCHAR(100)
);

-- Idempotente Inserts über WHERE NOT EXISTS (da keine UNIQUE-Constraint auf name)
INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label)
SELECT 'Communication','How explicitly information is communicated','Low-Context (Direct)','High-Context (Indirect)'
WHERE NOT EXISTS (SELECT 1 FROM culture_dimensions WHERE name='Communication');

INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label)
SELECT 'Evaluation','How feedback is given','Direct Negative Feedback','Indirect Negative Feedback'
WHERE NOT EXISTS (SELECT 1 FROM culture_dimensions WHERE name='Evaluation');

INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label)
SELECT 'Persuasion','How arguments are built','Principles-First','Applications-First'
WHERE NOT EXISTS (SELECT 1 FROM culture_dimensions WHERE name='Persuasion');

INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label)
SELECT 'Leading','How hierarchy and authority work','Egalitarian','Hierarchical'
WHERE NOT EXISTS (SELECT 1 FROM culture_dimensions WHERE name='Leading');

INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label)
SELECT 'Deciding','How decisions are made','Consensual','Top-Down'
WHERE NOT EXISTS (SELECT 1 FROM culture_dimensions WHERE name='Deciding');

INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label)
SELECT 'Trusting','How trust is built','Task-Based','Relationship-Based'
WHERE NOT EXISTS (SELECT 1 FROM culture_dimensions WHERE name='Trusting');

INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label)
SELECT 'Disagreeing','How disagreement is handled','Confrontational','Avoids Confrontation'
WHERE NOT EXISTS (SELECT 1 FROM culture_dimensions WHERE name='Disagreeing');

INSERT INTO culture_dimensions (name, description, low_context_label, high_context_label)
SELECT 'Scheduling','How time is managed','Linear-Time','Flexible-Time'
WHERE NOT EXISTS (SELECT 1 FROM culture_dimensions WHERE name='Scheduling');

-- User Culture Profiles
CREATE TABLE IF NOT EXISTS user_culture_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dimension_id INTEGER NOT NULL REFERENCES culture_dimensions(id),
    score INTEGER CHECK (score >= 1 AND score <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, dimension_id)
);

-- Team Synergy
CREATE TABLE IF NOT EXISTS team_synergy_metrics (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    dimension VARCHAR(20) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    member_count INTEGER NOT NULL,
    diversity_index DECIMAL(5,2),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initiale Team-Synergy für Demo-Team (falls vorhanden)
INSERT INTO team_synergy_metrics (team_id, dimension, score, member_count, diversity_index)
SELECT t.id, v.dim, v.score, v.cnt, v.diversity
FROM (
  VALUES
   ('Vision', 75.5, 4, 0.25),
   ('Innovation', 82.0, 4, 0.50),
   ('Expertise', 88.5, 4, 0.75),
   ('Connection', 70.0, 4, 0.25)
) AS v(dim, score, cnt, diversity)
JOIN companies c ON c.domain='demo-company.com'
JOIN teams t ON t.company_id=c.id AND t.name='Product Development'
WHERE NOT EXISTS (
  SELECT 1 FROM team_synergy_metrics m WHERE m.team_id = t.id AND m.dimension = v.dim
);

-- Synergy-Score im Team initial setzen (idempotent)
UPDATE teams t
SET synergy_score = 79.0
FROM companies c
WHERE t.company_id = c.id
  AND c.domain='demo-company.com'
  AND t.name='Product Development'
  AND (t.synergy_score IS NULL OR t.synergy_score = 0.00);

-- 5) Views & Funktion -------------------------------------------------------

CREATE OR REPLACE FUNCTION check_company_access(user_id INTEGER, target_company_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_var user_role;
    user_company_id INTEGER;
BEGIN
    SELECT role, company_id INTO user_role_var, user_company_id
    FROM users WHERE id = user_id;

    IF user_role_var = 'hugo_manager' THEN
        RETURN TRUE;
    END IF;

    IF user_role_var IN ('hr_manager','user') AND user_company_id = target_company_id THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE VIEW company_overview AS
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

CREATE OR REPLACE VIEW user_team_summary AS
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

