SELECT EXISTS(SELECT 1 FROM users WHERE email = ?) AS userExists;
