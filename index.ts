import express from 'express';
import { initializeDatabase } from './utils/database';
import { authMiddleware } from './middlewares/authMiddleware';
import authRoutes from './routes/authRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await initializeDatabase();
});
