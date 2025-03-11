import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// conect to mongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected Successfully to mongoDB');
        app.listen(PORT, () => console.log(`server running on port${PORT}`));
    })
    .catch((err) => console.error(`Error: ${err}`))

app.use('/api/auth', authRoutes);

