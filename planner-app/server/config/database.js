import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../planner.sqlite'),
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;
