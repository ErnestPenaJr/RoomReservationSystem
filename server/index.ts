import express from 'express';
import dotenv from 'dotenv';
import oracledb from 'oracledb';
import { authRouter } from './routes/auth';
import { roomsRouter } from './routes/rooms';
import { bookingsRouter } from './routes/bookings';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Database initialization
async function initialize() {
  try {
    await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2
    });
    console.log('Oracle database pool initialized');
  } catch (err) {
    console.error('Failed to create connection pool:', err);
    process.exit(1);
  }
}

// Routes
app.use('/api/auth', authRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

// Initialize and start server
initialize().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// Cleanup on exit
process.on('SIGINT', async () => {
  try {
    await oracledb.getPool().close(10);
    process.exit(0);
  } catch (err) {
    console.error('Error closing pool:', err);
    process.exit(1);
  }
});