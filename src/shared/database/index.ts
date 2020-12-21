import { Sequelize } from 'sequelize';
import { initSchematic, initUser } from '../models';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data/db.sqlite',
  logging: false,
});

sequelize.authenticate().then(() => {
  console.log('Database connection has been established successfully.');
  initUser(sequelize);
  initSchematic(sequelize);

  sequelize.sync({});
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
