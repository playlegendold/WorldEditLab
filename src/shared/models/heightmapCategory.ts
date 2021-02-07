import { DataTypes, Model, Sequelize } from 'sequelize';

interface HeightmapCategoryAttributes {
  id?: number;
  name: string;
}

export class HeightmapCategory extends Model implements HeightmapCategoryAttributes {
  public id!: number;

  public name!: string;
}

export const initHeightmapCategory = async (sequelize: Sequelize) => {
  HeightmapCategory.init({
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
    modelName: 'HeightmapCategory',
    tableName: 'heightmap_category',
  });
};
