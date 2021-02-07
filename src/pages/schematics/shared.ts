import {
  Access, Role, Schematic, User,
} from '../../shared/models';

export const createResponseFromRow = (schematic: Schematic, user: User) => {
  let uploadedBy: string | undefined;
  if (schematic.uploadedBy) {
    uploadedBy = schematic.uploadedBy.name;
  } else if (user !== undefined && user.id === schematic.uploadedById) {
    uploadedBy = user.name;
  }
  return {
    uuid: schematic.uuid,
    name: schematic.name,
    createdAt: schematic.createdAt,
    access: schematic.access,
    uploadedBy,
    write: schematic.access === Access.PRIVATE
    || schematic.uploadedById === user?.id
    || user?.role === Role.ADMIN,
    category: schematic.categoryId,
  };
};
