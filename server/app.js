import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/authRouter.js';
import shiftsRouter from './routes/shiftsRouter.js';
import dotenv from 'dotenv';
import authorizeMdw from './middlewares/authorize.js';
import cors from 'cors';

console.log(process.env.PORT);
const PORT = process.env.PORT ?? 8080;
const app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(express.json());
app.use(express.urlencoded());
dotenv.config({ path: './config/.env' });

app.use('/api/shifts', authorizeMdw.checkUserIsAuthenticated, shiftsRouter);
app.use('/api/auth', authRouter);

const connectFn = async () => {
    try {
        await mongoose.connect(process.env.ACCESS_URL);
        console.log('You are now connected with MongoDB.');
        app.listen(PORT);
        console.log('Express.js server started.');
    } catch (error) {
        console.log('An error occured while connecting with MongoDB.');
        console.log(error);
    }
};

await connectFn();
