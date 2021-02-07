import {
  Access, Role, User,
} from '../../shared/models';
import { Heightmap } from '../../shared/models/heightmap';

export const createResponseFromRow = (heightmap: Heightmap, user: User) => {
  let uploadedBy: string | undefined;
  if (heightmap.uploadedBy) {
    uploadedBy = heightmap.uploadedBy.name;
  } else if (user !== undefined && user.id === heightmap.uploadedById) {
    uploadedBy = user.name;
  }
  return {
    uuid: heightmap.uuid,
    name: heightmap.name,
    createdAt: heightmap.createdAt,
    access: heightmap.access,
    uploadedBy,
    write: heightmap.access === Access.PRIVATE
      || heightmap.uploadedById === user?.id
      || user?.role === Role.ADMIN,
    category: heightmap.categoryId,
  };
};
