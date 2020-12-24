import {
  DataTypes, Model, Sequelize,
} from 'sequelize';
import { Buffer } from 'buffer';
import { Access } from './access';
import { User } from './user';

export enum SchematicFormat {
  SCHEM,
  SCHEMATIC,
}

interface SchematicAttributes {
  uuid?: string;
  name: string;
  uploadedById?: number;
  access: Access;
  rawData: Buffer;
  format: number;
}

export class Schematic extends Model<SchematicAttributes> implements SchematicAttributes {
  public uuid!: string;

  public name!: string;

  public uploadedById!: number;

  public access!: Access;

  public rawData!: Buffer;

  public format!: number;

  public createdAt!: Date;

  public uploadedBy!: User;
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
