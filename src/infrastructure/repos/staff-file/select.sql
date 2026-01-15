SELECT f.* FROM files f JOIN staffFile sf ON f.id = sf.fileId WHERE sf.staffId = ?;
