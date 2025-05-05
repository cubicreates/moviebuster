import mongoose from 'mongoose';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with explicit path
config({ path: join(__dirname, '.env') });

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Increased timeout
            socketTimeoutMS: 60000, // Increased timeout
            family: 4,
            retryWrites: true,
            retryReads: true,
            ssl: true,
            sslValidate: true,
            // Add the following to allow connections from any IP
            directConnection: false
        });

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

export default connectDB;