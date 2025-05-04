import express, { json } from 'express';
import cors from 'cors';
import connectDB from './db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const app = express();
const port = process.env.PORT || 5100;

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log('Database connection established');
    })
    .catch((error) => {
        console.error('Could not connect to database:', error);
        process.exit(1);
    });

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});