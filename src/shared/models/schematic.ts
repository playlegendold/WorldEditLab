import {
  DataTypes, Model, Sequelize,
} from 'sequelize';
import { Access } from './access';

interface SchematicAttributes {
  uuid: string;
  name: string;
  uploadedById?: number;
  access: Access;
  rawData: string;
}

export class Schematic extends Model<SchematicAttributes> implements SchematicAttributes {
  public uuid!: string;

  public name!: string;

  public uploadedById!: number;

  public access!: Access;

  public rawData!: string;
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
  }, {
    sequelize,
    modelName: 'Schematic',
    tableName: 'schematic',
  });
};
