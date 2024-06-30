import Web3 from "web3"


const ABI = require('./abi.json');

// initialize web3 instance connected to the node
const web3 = new Web3(`${process.env.NODE_URL}`);

//inject the private key to the account object added 0x to turn it into a hex string
const account = web3.eth.accounts.privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

//add the account to the wallet
web3.eth.accounts.wallet.add(account);


export async function mintAndTransfer(to :string) : Promise<string>{

    // connect to the contract using the contract ABI and contract address
    const contract = new web3.eth.Contract(ABI, `${process.env.CONTRACT_ADDRESS}`, {
        from: `${process.env.WALLET_ADDRESS}`
    });

    // call the mint function of the contract
    const tx = await contract.methods.mint(to).send();

    // return the transaction hash
    return tx.transactionHash;
}