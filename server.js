import express from 'express';
import 'dotenv/config';
import { connectDB } from './db/connect.js';


// routes
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'


const server = express();


server.use(express.json());
connectDB()


server.use('/api/user', userRouter );
server.use('/api/auth', authRouter );


server.get('/', (req, res) => {
    res.send('Server is healthy.');
});
server.listen(8080, () => {
    console.log('Server is listening on port 8080');
})
