SELECT EXISTS(SELECT 1 FROM users WHERE username = ? OR email = ?) AS userExists;
