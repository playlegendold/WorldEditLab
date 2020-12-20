import { DataTypes, Model, Sequelize } from 'sequelize';
import Role from './role';
import { hashPassword } from '../auth';

export class User extends Model {}

export const initUser = async (sequelize: Sequelize) => {
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

  try {
    const count = await User.count({});
    if (count === 0) {
      // Create default user
      await User.create({
        name: 'admin',
        password: hashPassword('admin'),
        role: Role.ADMIN,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
