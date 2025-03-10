INSERT OR IGNORE INTO roles (name) VALUES ('admin');
INSERT OR IGNORE INTO roles (name) VALUES ('user');

-- Default User
-- username: admin
-- password: admin

INSERT OR IGNORE INTO users (username, email, password) VALUES (
  'admin',
  'temp@mail.com',
  '8d89b5e2772fa4161f3ba737b041f8e2156d1c7bfa11b13247566428fe24cec3a1a5a1cb94552310cf2ec3ef074d6082255efe03d09d0b469772045942dad47f.57c9341390db8345050e252b7eb4e0d3'
);

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2);
