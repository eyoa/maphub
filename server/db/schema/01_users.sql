DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS maps CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  description TEXT,
  profile_img_url VARCHAR(255) DEFAULT "/images/profile-hex.png"
);

CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(8,6) NOT NULL,
  longitudes DECIMAL(9,6) NOT NULL,
  title VARCHAR(255),
  zoom_lv INTEGER,
  description TEXT
);
