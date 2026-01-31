import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { connectDB } from './config/db.js';
import 'dotenv/config';

import approverRoutes from './routes/approverRoutes.js';
import applicationRoutes from './routes/applications.js'; // correct import

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: false
}));

app.use(express.json());

app.use('/api/approver', approverRoutes);
app.use('/applications', applicationRoutes);

const startServer = async () => {
  const PORT = process.env.PORT || 3000;

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();