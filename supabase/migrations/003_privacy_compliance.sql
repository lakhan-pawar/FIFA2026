-- Privacy Compliance and Consent Management Tables
-- Migration: 003_privacy_compliance.sql

-- User consent tracking table
CREATE TABLE IF NOT EXISTS user_consent (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_settings JSONB NOT NULL DEFAULT '{
        "essential": true,
        "analytics": false,
        "personalization": true,
        "thirdPartyData": true,
        "marketing": false
    }'::jsonb,
    consent_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    version TEXT NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data export requests table
CREATE TABLE IF NOT EXISTS data_export_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    download_url TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data deletion requests table
CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_consent_user_id ON user_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_created_at ON user_consent(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_export_requests_user_id ON data_export_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_export_requests_status ON data_export_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_user_id ON data_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_status ON data_deletion_requests(status);

-- Row Level Security (RLS) policies
ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Users can only access their own consent records
CREATE POLICY "Users can view own consent" ON user_consent
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consent" ON user_consent
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only access their own data export requests
CREATE POLICY "Users can view own export requests" ON data_export_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own export requests" ON data_export_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only access their own data deletion requests
CREATE POLICY "Users can view own deletion requests" ON data_deletion_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deletion requests" ON data_deletion_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_user_consent_updated_at
    BEFORE UPDATE ON user_consent
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_export_requests_updated_at
    BEFORE UPDATE ON data_export_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_deletion_requests_updated_at
    BEFORE UPDATE ON data_deletion_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE user_consent IS 'Stores user consent preferences for data processing and privacy compliance';
COMMENT ON TABLE data_export_requests IS 'Tracks user requests for data export (GDPR Article 20)';
COMMENT ON TABLE data_deletion_requests IS 'Tracks user requests for account and data deletion (GDPR Article 17)';

COMMENT ON COLUMN user_consent.consent_settings IS 'JSON object containing consent preferences for different data processing categories';
COMMENT ON COLUMN user_consent.version IS 'Privacy policy version when consent was given';
COMMENT ON COLUMN data_export_requests.expires_at IS 'When the download link expires (typically 7 days after generation)';