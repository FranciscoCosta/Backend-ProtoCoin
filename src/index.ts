import express , { Request, Response, NextFunction, json } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
import morgan from 'morgan';

import { mintAndTransfer } from './Web3Provider';

const app = express();

app.use(morgan('dev'));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello World');
});

app.post("/mint/:wallet", async(req: Request, res: Response, next: NextFunction) => {
    try{
        const tx = await mintAndTransfer(req.params.wallet);
        res.send(tx);
    }catch(err){
        res.status(500).json(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

     