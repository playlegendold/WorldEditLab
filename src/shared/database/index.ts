import { Sequelize } from 'sequelize';
import {
  initSchematic, initSchematicCategory, initUser, Schematic, SchematicCategory, User,
} from '../models';
import { Heightmap, initHeightmap } from '../models/heightmap';
import { HeightmapCategory, initHeightmapCategory } from '../models/heightmapCategory';

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
  initHeightmap(sequelize);
  initHeightmapCategory(sequelize);

  Schematic.belongsTo(User, { as: 'uploadedBy' });
  Schematic.belongsTo(SchematicCategory, { as: 'category' });
  Heightmap.belongsTo(User, { as: 'uploadedBy' });
  Heightmap.belongsTo(HeightmapCategory, { as: 'category' });

  sequelize.sync({});
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
