import express , { Request, Response, NextFunction, json } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello World');
});

app.post("/mint/:wallet", (req: Request, res: Response, next: NextFunction) => {
    return res.send(`Minting to wallet ${req.params.wallet}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

     