import {
  DataTypes, Model, Sequelize,
} from 'sequelize';
import { Buffer } from 'buffer';
import { Access } from './access';
import { User } from './user';
import { SchematicCategory } from './schematicCategory';

export enum SchematicFormat {
  SCHEM,
  SCHEMATIC,
}

interface SchematicAttributes {
  uuid?: string;
  name: string;
  access: Access;
  rawData: Buffer;
  format: number;

  // References
  uploadedById?: number;
  categoryId?: number;
}

export class Schematic extends Model implements SchematicAttributes {
  public uuid!: string;

  public name!: string;

  public access!: Access;

  public rawData!: Buffer;

  public format!: number;

  public createdAt!: Date;

  // References
  public uploadedById!: number;

  public categoryId!: number;

  // Linked Models
  public uploadedBy!: User;

  public category!: SchematicCategory;
}

export const initSchematic = async (sequelize: Sequelize) => {
  Schematic.init({
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
    format: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Schematic',
    tableName: 'schematic',
  });
};
