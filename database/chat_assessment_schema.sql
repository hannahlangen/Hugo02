-- Additional tables for chat-based assessment system

-- Assessment invitations table
CREATE TABLE assessment_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) UNIQUE NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    participant_name VARCHAR(255),
    company_name VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    invitation_token VARCHAR(255) REFERENCES assessment_invitations(token),
    current_question INTEGER DEFAULT 0,
    responses JSONB DEFAULT '[]'::jsonb,
    dimension_scores JSONB DEFAULT '{}'::jsonb,
    hugo_type_result VARCHAR(10),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_assessment_invitations_token ON assessment_invitations(token);
CREATE INDEX idx_assessment_invitations_email ON assessment_invitations(participant_email);
CREATE INDEX idx_chat_sessions_invitation_token ON chat_sessions(invitation_token);
CREATE INDEX idx_chat_sessions_email ON chat_sessions(participant_email);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Add trigger to update completed_at when assessment is completed
CREATE OR REPLACE FUNCTION update_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_completed_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_completed_at();
