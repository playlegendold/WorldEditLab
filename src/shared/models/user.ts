import { DataTypes, Model, Sequelize } from 'sequelize';
import Role from './role';

export class User extends Model {}

export const initUser = (sequelize: Sequelize) => {
  User.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Role.GUEST,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
};
