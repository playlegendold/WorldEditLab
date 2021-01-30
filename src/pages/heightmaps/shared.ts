import {
  Access, Role, User,
} from '../../shared/models';
import { Heightmap } from '../../shared/models/heightmap';

export const createResponseFromRow = (row: Heightmap, user: User) => {
  let uploadedBy;
  if (row.uploadedBy) {
    uploadedBy = row.uploadedBy.name;
  } else if (user !== undefined && user.id === row.uploadedById) {
    uploadedBy = user.name;
  }
  return {
    uuid: row.uuid,
    name: row.name,
    createdAt: row.createdAt,
    access: row.access,
    uploadedBy,
    write: row.access === Access.PRIVATE
      || row.uploadedById === user?.id
      || user?.role === Role.ADMIN,
    category: row.categoryId,
  };
};
