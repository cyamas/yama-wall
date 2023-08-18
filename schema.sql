DROP TABLE IF EXISTS holds;

CREATE TABLE holds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    manufacturer TEXT NOT NULL,
    product_name TEXT NOT NULL,
    hold_type TEXT NOT NULL,
    color TEXT NOT NULL,
    width INTEGER NOT NULL,
    depth INTEGER NOT NULL,
    incut INTEGER NOT NULL,
    texture INTEGER NOT NULL,
    angle INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_bolted INTEGER NOT NULL DEFAULT 0,
    row_pos INTEGER,
    col_pos INTEGER,
    next_one INTEGER,
    next_two INTEGER,
    next_three INTEGER,
    next_four INTEGER,
    next_five INTEGER
);