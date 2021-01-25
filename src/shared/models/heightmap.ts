import {
  DataTypes, Model, Sequelize,
} from 'sequelize';
import { Buffer } from 'buffer';
import { Access } from './access';
import { User } from './user';
import { HeightmapCategory } from './heightmapCategory';

interface HeightmapAttributes {
  uuid?: string;
  name: string;
  access: Access;
  rawData: Buffer;

  // References
  uploadedById?: number;
  categoryId?: number;
}

export class Heightmap extends Model implements HeightmapAttributes {
  public uuid!: string;

  public name!: string;

  public access!: Access;

  public rawData!: Buffer;

  public createdAt!: Date;

  // References
  public uploadedById!: number;

  public categoryId!: number;

  // Linked Models
  public uploadedBy!: User;

  public category!: HeightmapCategory;
}

export const initHeightmap = async (sequelize: Sequelize) => {
  Heightmap.init({
    uuid: {
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(32),
    },
    access: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Access.INTERNAL,
    },
    rawData: {
      type: DataTypes.BLOB,
    },
  }, {
    sequelize,
    modelName: 'Heightmap',
    tableName: 'heightmap',
  });
};
