import path from "path";
import async from 'async';

const solc = require('solc');
const fs = require('fs');
const forgeSDK = require('forge-sdk');


var args = process.argv.slice(2);

// npx ts-node src/forge.ts test
if(args[0] == "test" ) {

    const contractPath = path.resolve(__dirname, '../contract.sol');


    // Connect to the Forge blockchain
    const forgeConnection = forgeSDK.connectToBlockchain('https://eth-sepolia.g.alchemy.com/v2/5yiTa2hWRefUdIki3OGt4buh8wyW4MJc');
    
    // Write and compile smart contract code (hypothetical Move code)
    const smartContractCode = fs.readFileSync(contractPath, 'utf8');
  
    
    // Deploy the smart contract
    const deploymentTransaction = forgeConnection.deploySmartContract({
      code: smartContractCode,
      gasLimit: 1000000, // Set gas limit as needed
    });
    
    // Handle deployment results
    deploymentTransaction.on('transactionHash', (hash: any) => {
      console.log(`Smart contract deployment transaction hash: ${hash}`);
    });
    
    deploymentTransaction.on('receipt', (receipt: { contractAddress: any; }) => {
      console.log(`Smart contract deployed at address: ${receipt.contractAddress}`);
      // Additional handling as needed
    });

}