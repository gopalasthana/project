import { createConnection, Connection } from 'typeorm';
import { User } from '../entities/User';

export let connection: Connection;

export const initializeDatabase = async () => {
  connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'mydatabase',
    entities: [User],
    synchronize: true, // WARNING: Should be false in production
  });

  console.log('Connected to the database');
};
