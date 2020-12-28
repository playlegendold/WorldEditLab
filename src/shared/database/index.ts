import { Sequelize } from 'sequelize';
import {
  initSchematic, initSchematicCategory, initUser, Schematic, SchematicCategory, User,
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
  initSchematicCategory(sequelize);

  Schematic.belongsTo(User, { as: 'uploadedBy' });
  Schematic.belongsTo(SchematicCategory, { as: 'category' });

  sequelize.sync({});
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
