-- Migration: Recommendation Engine Tables
-- Version: 004
-- Date: 2025-10-02

-- Recommendation requests table
CREATE TABLE IF NOT EXISTS recommendation_requests (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('find_member', 'build_team', 'identify_gaps')),
    request_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_recommendation_requests_company ON recommendation_requests(company_id);
CREATE INDEX idx_recommendation_requests_type ON recommendation_requests(request_type);
CREATE INDEX idx_recommendation_requests_created_at ON recommendation_requests(created_at DESC);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES recommendation_requests(id) ON DELETE CASCADE,
    recommendation_data JSONB NOT NULL,
    synergy_score DECIMAL(3,2) CHECK (synergy_score >= 0 AND synergy_score <= 1),
    algorithm_version VARCHAR(20) DEFAULT '1.0.0',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recommendations_request ON recommendations(request_id);
CREATE INDEX idx_recommendations_synergy ON recommendations(synergy_score DESC);

-- Recommendation feedback table
CREATE TABLE IF NOT EXISTS recommendation_feedback (
    id SERIAL PRIMARY KEY,
    recommendation_id INTEGER REFERENCES recommendations(id) ON DELETE CASCADE,
    accepted BOOLEAN NOT NULL,
    actual_synergy DECIMAL(3,2) CHECK (actual_synergy IS NULL OR (actual_synergy >= 0 AND actual_synergy <= 1)),
    comments TEXT,
    feedback_date TIMESTAMP DEFAULT NOW(),
    feedback_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_feedback_recommendation ON recommendation_feedback(recommendation_id);
CREATE INDEX idx_feedback_accepted ON recommendation_feedback(accepted);
CREATE INDEX idx_feedback_date ON recommendation_feedback(feedback_date DESC);

-- Team performance history table
CREATE TABLE IF NOT EXISTS team_performance_history (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    synergy_score DECIMAL(3,2) CHECK (synergy_score >= 0 AND synergy_score <= 1),
    performance_metrics JSONB,
    recorded_at TIMESTAMP DEFAULT NOW(),
    recorded_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_team_performance_team ON team_performance_history(team_id);
CREATE INDEX idx_team_performance_date ON team_performance_history(recorded_at DESC);

-- ML model versions table
CREATE TABLE IF NOT EXISTS ml_model_versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL UNIQUE,
    model_type VARCHAR(50) NOT NULL,
    training_data_size INTEGER,
    validation_score DECIMAL(5,4),
    model_file_path TEXT,
    deployed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ml_model_active ON ml_model_versions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_ml_model_version ON ml_model_versions(version);

-- Add experience_years to users table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='experience_years') THEN
        ALTER TABLE users ADD COLUMN experience_years INTEGER;
    END IF;
END $$;

-- Add cultural_profile to users table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='cultural_profile') THEN
        ALTER TABLE users ADD COLUMN cultural_profile JSONB;
    END IF;
END $$;

-- Comments
COMMENT ON TABLE recommendation_requests IS 'Stores requests for team recommendations';
COMMENT ON TABLE recommendations IS 'Stores generated recommendations with scores';
COMMENT ON TABLE recommendation_feedback IS 'Stores user feedback on recommendations for ML training';
COMMENT ON TABLE team_performance_history IS 'Tracks team performance over time';
COMMENT ON TABLE ml_model_versions IS 'Manages ML model versions and deployments';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON recommendation_requests TO hugo_user;
GRANT SELECT, INSERT, UPDATE ON recommendations TO hugo_user;
GRANT SELECT, INSERT, UPDATE ON recommendation_feedback TO hugo_user;
GRANT SELECT, INSERT, UPDATE ON team_performance_history TO hugo_user;
GRANT SELECT ON ml_model_versions TO hugo_user;

GRANT USAGE, SELECT ON SEQUENCE recommendation_requests_id_seq TO hugo_user;
GRANT USAGE, SELECT ON SEQUENCE recommendations_id_seq TO hugo_user;
GRANT USAGE, SELECT ON SEQUENCE recommendation_feedback_id_seq TO hugo_user;
GRANT USAGE, SELECT ON SEQUENCE team_performance_history_id_seq TO hugo_user;
