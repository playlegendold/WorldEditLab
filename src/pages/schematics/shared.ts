import {
  Access, Role, Schematic, User,
} from '../../shared/models';

export const createResponseFromRow = (row: Schematic, user: User) => {
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
