import dotenv from 'dotenv';
import db from './config/database.js';
import app from './app.js';

// Load environment variables
dotenv.config();

// Set port
const PORT = process.env.PORT || 5001;

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Connect to database
(async () => {
  try {
    await db.authenticate();
    console.log('Database connection has been established successfully.');
    // Sync database (create tables if they don't exist)
    // In production, use migrations instead
    await db.sync({ alter: true });
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// For Vercel serverless deployment
export default app; 