--- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_from TEXT NOT NULL,
    sent_to TEXT NOT NULL,
    body TEXT NOT NULL    
);
