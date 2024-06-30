import express , { Request, Response, NextFunction, json } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';

import { mintAndTransfer } from './Web3Provider';
dotenv.config();

const PORT = process.env.PORT || 3000;



const app = express();
import cors from 'cors';
app.use(cors());

app.use(morgan('dev'));

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello World');
});


const nextMint = new Map<string, number>();


app.post("/mint/:wallet", async(req: Request, res: Response, next: NextFunction) => {
    try{
        if(nextMint.has(req.params.wallet) && nextMint.get(req.params.wallet)! > Date.now()){
            return res.status(429).send('You can mint only once a day.');
        }
        const tx = await mintAndTransfer(req.params.wallet);
        res.send(tx);
    }catch(err: any){
        res.status(500).json(err);
    }finally{
        nextMint.set(req.params.wallet, Date.now() + 1000 * 60 * 60 * 24);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

     