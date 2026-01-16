SELECT f.* FROM files f INNER JOIN newsFile nf ON f.id = nf.fileId WHERE nf.newsId = ?;
