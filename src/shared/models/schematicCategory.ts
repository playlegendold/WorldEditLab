import { DataTypes, Model, Sequelize } from 'sequelize';

interface SchematicCategoryAttributes {
  id?: number;
  name: string;
}

export class SchematicCategory extends Model implements SchematicCategoryAttributes {
  public id!: number;

  public name!: string;
}

export const initSchematicCategory = async (sequelize: Sequelize) => {
  SchematicCategory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(32),
    },
  }, {
    sequelize,
    modelName: 'SchematicCategory',
    tableName: 'schematic_category',
  });
};
