CREATE TABLE map_markers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    latitude FLOAT8 NOT NULL,
    longitude FLOAT8 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
