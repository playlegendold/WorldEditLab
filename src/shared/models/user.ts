import { DataTypes, Model, Sequelize } from 'sequelize';

export class User extends Model {}

export const initUser = (sequelize: Sequelize) => {
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
};
