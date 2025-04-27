import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

// If in Vercel production environment, use in-memory SQLite
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  db = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });
} else {
  // For development/testing, use file-based SQLite
  // Create a directory for SQLite database if it doesn't exist
  const dbDir = join(__dirname, '../../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  db = new Sequelize({
    dialect: 'sqlite',
    storage: join(dbDir, 'socialgood.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
}

export default db; 