-- Create assessment_results table if not exists
CREATE TABLE IF NOT EXISTS assessment_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    personality_type VARCHAR(10) NOT NULL,
    dimension_scores JSONB NOT NULL,
    type_scores JSONB NOT NULL,
    cultural_profile JSONB,
    responses JSONB NOT NULL,
    completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);

-- Create index on completed_at for sorting
CREATE INDEX IF NOT EXISTS idx_assessment_results_completed_at ON assessment_results(completed_at DESC);
