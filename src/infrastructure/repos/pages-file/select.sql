SELECT f.* FROM files f JOIN pagesFile pf ON f.id = pf.fileId WHERE pf.pageId = ?;
