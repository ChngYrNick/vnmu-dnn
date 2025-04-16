-- Default Admin User
-- email: temp@mail.com
-- password: admin

INSERT INTO users (email, fullName, password, role) VALUES (
  'temp@mail.com',
  'Admin',
  '8d89b5e2772fa4161f3ba737b041f8e2156d1c7bfa11b13247566428fe24cec3a1a5a1cb94552310cf2ec3ef074d6082255efe03d09d0b469772045942dad47f.57c9341390db8345050e252b7eb4e0d3',
  'admin'
);

INSERT INTO pages (slug) VALUES ('/about');
INSERT INTO pages (slug) VALUES ('/intern');
INSERT INTO pages (slug) VALUES ('/listener');
INSERT INTO pages (slug) VALUES ('/syllabus');
INSERT INTO pages (slug) VALUES ('/literature');
