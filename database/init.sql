CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    company_id INTEGER REFERENCES companies(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO companies (name, description) VALUES 
('Demo Company', 'A sample company for testing Hugo App v2')
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, is_active) VALUES
('hugo@hugoatwork.com', 'hugo123', 'Hugo', 'Manager', 'hugo_manager', NULL, true),
('hr@democompany.com', 'hr123', 'Anna', 'Schmidt', 'hr_manager', 1, true),
('user@democompany.com', 'user123', 'Max', 'Mustermann', 'user', 1, true)
ON CONFLICT (email) DO NOTHING;
