CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE, -- user has the unhashed token as a cookie
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_ip TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    oidc_id_token TEXT NOT NULL -- used to log the user out of the OIDC provider
);

CREATE TABLE IF NOT EXISTS board (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS post (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    account_id TEXT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,

    board_id TEXT NOT NULL REFERENCES board(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reply (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    account_id TEXT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    body TEXT NOT NULL,

    post_id TEXT NOT NULL REFERENCES post(id) ON DELETE CASCADE
);
