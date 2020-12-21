import { Sequelize } from 'sequelize';
import {
  initSchematic, initUser, Schematic, User,
} from '../models';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data/db.sqlite',
  logging: false,
});

sequelize.authenticate().then(() => {
  console.log('Database connection has been established successfully.');
  initUser(sequelize);
  initSchematic(sequelize);

  Schematic.belongsTo(User, { as: 'uploadedBy' });

  sequelize.sync({});
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
