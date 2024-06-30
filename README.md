<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
</head>
<body>

<h1>ProtoCoin Backend</h1>

<h2>Introduction</h2>
<p>This project provides the backend services for ProtoCoin, including minting and transferring tokens. It is built with Express, and it interacts with the ProtoCoin smart contract on the Ethereum blockchain using Web3.</p>

<h2>Installation</h2>
<p>To use or modify this project, follow these steps:</p>
<ol>
    <li>Clone the repository: <code>git clone https://github.com/FranciscoCosta/Backend-ProtoCoin.git</code></li>
    <li>Navigate to the project directory: <code>cd Backend-ProtoCoin</code></li>
    <li>Install the dependencies: <code>npm install</code></li>
    <li>Create a <code>.env</code> file in the root directory with the following variables:</li>
</ol>
<pre><code>
NODE_URL=https://your-node-url
PRIVATE_KEY=your-private-key
CONTRACT_ADDRESS=your-contract-address
WALLET_ADDRESS=your-wallet-address
PORT=3000
CORS_ORIGIN=your-frontend-origin
</code></pre>

<h2>Usage</h2>
<p>To start the server, run:</p>
<pre><code>npm start</code></pre>
<p>The server will be running on the port specified in your <code>.env</code> file.</p>

<h2>Endpoints</h2>
<h3>GET /</h3>
<p>Returns a simple "Hello World" message.</p>
<h3>POST /mint/:wallet</h3>
<p>Mints ProtoCoin tokens to the specified wallet address. The endpoint enforces a rate limit, allowing minting once per day per wallet.</p>
<pre><code>curl -X POST http://localhost:3000/mint/{wallet_address}</code></pre>

<h2>Code Overview</h2>

<h3>Server Setup (server.ts)</h3>
<pre><code>typescript
import express, { Request, Response, NextFunction, json } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import { mintAndTransfer } from './Web3Provider';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

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
</code></pre>

<h3>Web3 Provider (Web3Provider.ts)</h3>
<pre><code>typescript
import Web3 from "web3";
const ABI = require('./abi.json');

// Initialize web3 instance connected to the node
const web3 = new Web3(`${process.env.NODE_URL}`);

// Inject the private key to the account object, adding 0x to turn it into a hex string
const account = web3.eth.accounts.privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

// Add the account to the wallet
web3.eth.accounts.wallet.add(account);

export async function mintAndTransfer(to: string): Promise<string> {
    // Connect to the contract using the contract ABI and contract address
    const contract = new web3.eth.Contract(ABI, `${process.env.CONTRACT_ADDRESS}`, {
        from: `${process.env.WALLET_ADDRESS}`
    });

    // Call the mint function of the contract
    const tx = await contract.methods.mint(to).send();

    // Return the transaction hash
    return tx.transactionHash;
}
</code></pre>

<h2>References</h2>
<p>Frontend project: <a href="https://github.com/FranciscoCosta/Faucet-Protocoin">https://github.com/FranciscoCosta/Faucet-Protocoin</a></p>
<p>Backend project: <a href="https://github.com/FranciscoCosta/Backend-ProtoCoin">https://github.com/FranciscoCosta/Backend-ProtoCoin</a></p>
<p>Token project: <a href="https://github.com/FranciscoCosta/Faucet-Protocoin">https://github.com/FranciscoCosta/Faucet-Protocoin</a></p>

<h2>License</h2>
<p>This project is licensed under the MIT License.</p>

</body>
</html>
