import {
  Access, Role, Schematic, User,
} from '../../shared/models';

export const createResponseFromRow = (row: Schematic, user: User) => ({
  uuid: row.uuid,
  name: row.name,
  createdAt: row.createdAt,
  access: row.access,
  uploadedBy: row.uploadedBy ? row.uploadedBy.name : undefined,
  write: row.access === Access.PRIVATE
    || row.uploadedById === user?.id
    || user?.role === Role.ADMIN,
  category: row.category?.name,
});
