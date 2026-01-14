SELECT f.* FROM files f JOIN studentMaterialsFile smf ON f.id = smf.fileId WHERE smf.materialId = ?;
