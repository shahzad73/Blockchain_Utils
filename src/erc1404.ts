import fs, { appendFileSync } from "fs";
import Web3 from "web3";

import path from "path";

const { FireblocksSDK } = require('fireblocks-sdk');

var args = process.argv.slice(2);

//local
//var contract_address = "0x3F4B2e1B4Ca4B32EF29e3bf90362d30Cc45B30a5";
//var service_address = "0x3F4B2e1B4Ca4B32EF29e3bf90362d30Cc45B30a5";

//kovan
var contract_address = "0x783b55DDf115d713c4CAf0944f42fC4eDd45387b";
var service_address = "0x783b55DDf115d713c4CAf0944f42fC4eDd45387b";

//var linkToBlockchainServer = "HTTP://127.0.0.1:7545";
var linkToBlockchainServer = "https://sepolia.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";
//var linkToBlockchainServer = "https://matic-mumbai--jsonrpc.datahub.figment.io/apikey/9737e952f56cd7bdca83d6bb4fdf1576"      //Polygone test
//var linkToBlockchainServer = "https://polygon-mainnet.g.alchemy.com/v2/-ILqUOGwJjUcoX39sWWft7QsW9SGiDzx"      //Polygone mainnet
//var linkToBlockchainServer = "https://data-seed-prebsc-1-s1.binance.org:8545"      //Binanace chain testnet    not yet tested
//var linkToBlockchainServer = "https://bsc-dataseed1.binance.org"    // Binance chain mainnet     
//var linkToBlockchainServer = "https://test-rpc.libex.ai"    // Libex testnet     
//var linkToBlockchainServer = "https://mainnet.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";
//var dolloarValue = 2000;    // Ethereum

var dolloarValue = 1861;       // mainnet 
//var dolloarValue = 1.13;         //Polygon Matic
//var dolloarValue = 312;       //BNB for bianace chain
 

const ERC1404Token = JSON.parse(fs.readFileSync("./data/ERC1404.json", "utf8")); 
const ERC1404Tokenv13 = JSON.parse(fs.readFileSync("./data/ERC1404v13.json", "utf8")); 
const ERC20Token = JSON.parse(fs.readFileSync("./data/ERC20.json", "utf8")); 
const swapper = JSON.parse(fs.readFileSync("./data/swapper.json", "utf8")); 
const dividend = JSON.parse(fs.readFileSync("./data/dividend.json", "utf8")); 


//npx ts-node src/erc1404.ts test
if(args[0] == "deployERC1404" )
    deployERC1404()
if(args[0] == "deployERC20" )
    deployERC20()
if(args[0] == "checkWhitelistAddress" )
    checkWhitelistAddress()
if(args[0] == "test" )
    testFireBlocks()
if(args[0] == "smartContractTransCost" )
    smartContractTransCost()


// npx ts-node src/erc1404.ts test
async function testFireBlocks() {

    (async () => {

            const apiSecret = fs.readFileSync(path.resolve("./src/FireBlocks_Secret.key"), "utf8");

            const baseUrl = "https://sandbox-api.fireblocks.io";

            const fireblocks = new FireblocksSDK(apiSecret, "b2569cf1-bc7c-408d-80f4-ddb1b30d9294", baseUrl);

            const internalWallets = await fireblocks.getInternalWallets();

            console.log( JSON.stringify( internalWallets ) );


    })().catch((e)=> {
        
        console.error(`Failed: ${e}`);

    })

}


//if(args[0] == "whitelistAAddress" )
//    whitelistAAddress()



//npx ts-node src/erc1404.ts deployERC1404
async function deployERC1404() {

    var web3 = new Web3(Web3.givenProvider || linkToBlockchainServer);


    const encodedParameters = web3.eth.abi.encodeParameters(
        ['uint256', 'string', 'string', 'uint256', 'uint256', 'string', 'string', 'string'],
        ['100000000000000000000000', 'ERC04', 'ERC04', 5, 18, "Site website link", "Website link document", " website document links"]
      ).slice(2);
  

    /*const encodedParameters = web3.eth.abi.encodeParameters(
        ['uint256', 'string', 'string', 'uint64', 'uint8', 'string', 'string', 'string', 'address', 'uint64'],
        ['1000000000000000000000', 'ERC04', 'ERC04', 5, 18, "Site website link", "Website link document", " website document links", "0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d", "1"]
    ).slice(2);*/


      // prepare the transaction:
      /*var rawTx = {
            from: "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300",
            data:  ERC1404Tokenv13.bytecode  + encodedParameters,
            //gas: 6721975
      }*/
                  
      let estimateGasPromise = web3.eth.estimateGas({
          from: "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300",
          data: ERC1404Token.bytecode  + encodedParameters
      });						

      const allPromises = Promise.all([estimateGasPromise]);
      var gasEstimateForContract: any = await allPromises;

      var block = await web3.eth.getBlock("latest");
      console.log("gasLimit: " + block.gasLimit);


      var PricePerGas = await web3.eth.getGasPrice();
      const etherValueOfGasPerPrice: any = Web3.utils.fromWei(PricePerGas, 'ether');
      
      //this is the constant used in multisto  i have increased the size in that estimation as well
      console.log( "Gas Estimate : " + gasEstimateForContract )				
      console.log( "Price per Gas : " + PricePerGas )		
      console.log( `Total Price in ETH :  ${gasEstimateForContract * etherValueOfGasPerPrice}  ` );		
      console.log( "$" + gasEstimateForContract * etherValueOfGasPerPrice *  dolloarValue);


}


// npx ts-node src/erc1404.ts smartContractTransCost
async function smartContractTransCost() {
    var web3 = new Web3(Web3.givenProvider || linkToBlockchainServer);

    const contract = new web3.eth.Contract(ERC1404Tokenv13.abi, "0x124D5C7816d20B599Bc08DE37C58Bf3c27F05fa9");

      var gasPrice = await web3.eth.getGasPrice();

      let estimateGasPromise = web3.eth.estimateGas({
          data: contract.methods.modifyKYCData('0x1a8929fbE9abEc00CDfCda8907408848cBeb5300', 1, 1).encodeABI()
      });
      const allPromises = Promise.all([estimateGasPromise]);
      var gas = await allPromises;

      var block = await web3.eth.getBlock("latest");
      //var gasLimit = block.gasLimit/block.transactions.length;


      const etherValue = web3.utils.fromWei(gasPrice, 'ether');
      console.log("gasLimit: " + block.gasLimit);

      //this is the constant used in multisto  i have increased the size in that estimation as well
      console.log( "Gas Estimate : ")				

      console.log(gas);

}



//npx ts-node src/erc1404.ts deployERC20
async function deployERC20() {

    var web3 = new Web3(Web3.givenProvider || linkToBlockchainServer);


    const encodedParameters = web3.eth.abi.encodeParameters(
      ['address', 'uint256', 'string'],
      ['0x1a8929fbE9abEc00CDfCda8907408848cBeb5300', '100000000000000000000000', 'ERC04']
    ).slice(2);


      // prepare the transaction:
      var rawTx = {
            from: "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300",
            //data:  ERC20Token.bytecode  + encodedParameters,
            data:  swapper.bytecode,
            gas: 6721975
      }

      
      var gasPrice = await web3.eth.getGasPrice();
                  
      let estimateGasPromise = web3.eth.estimateGas({
          data: ERC20Token.bytecode  + encodedParameters
      });						
      const allPromises = Promise.all([estimateGasPromise]);
      var gas = await allPromises;
  
      var block = await web3.eth.getBlock("latest");
      //var gasLimit = block.gasLimit/block.transactions.length;


      const etherValue = web3.utils.fromWei(gasPrice, 'ether');
      console.log("gasLimit: " + block.gasLimit);

      //this is the constant used in multisto  i have increased the size in that estimation as well
      console.log( "Gas Estimate : ")				

      console.log(gas);


        // sign and send the transaction
        //let contractAddress
        web3.eth.accounts.signTransaction(rawTx, '284e878525e21729040938f1e723a90f69f8ad336ce3f10e2357664f5249b915')
        .then((signedTx) => {
                const tt:any = signedTx.rawTransaction;
                //console.log(tt);
                const sentTx = web3.eth.sendSignedTransaction(tt);
                sentTx.on("error", err => {
                // do something on transaction error
                    console.log(err)
                });
                sentTx.on("receipt", receipt => {
                    // do something when receipt comes back
                    console.log(receipt)
                });
        }).catch((err) => {
            // do something when promise fails
            console.log(err)
        });

}


//npx ts-node src/erc1404.ts checkWhitelistAddress
async function checkWhitelistAddress() {
          
    var web3 = new Web3(Web3.givenProvider || linkToBlockchainServer);
    
    var contract = new web3.eth.Contract(ERC1404Tokenv13.abi, "0xefb575226016b2FCEFe904926752e37C8249cfc3");

            contract.methods.getKYCData("0x536062965be9590E747aC52747Db3F38Bb44DAEe").call()
            .then ( (data: any) => { 

                console.log( data );

            });
    
}


/*
//npx ts-node src/erc1404.ts whitelistAAddress
async function whitelistAAddress() {

    var web3 = new Web3(Web3.givenProvider || linkToBlockchainServer);
                
    web3.eth.net.isListening().then(() => {
        
        const contractAddress = "0x14AC81bC1cF81F9352fea1De3469f701b4b4e8DA";   
        const distributionKey = "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300";
        const contract = new web3.eth.Contract(ERC1404Tokenv13.abi, contractAddress);
        const addressToWhitelist = "0x536062965be9590E747aC52747Db3F38Bb44DAEe";

        const privateKey = Buffer.from("284e878525e21729040938f1e723a90f69f8ad336ce3f10e2357664f5249b915", 'hex');        
        web3.eth.defaultAccount = distributionKey;

        var tempData = "";
        tempData = contract.methods.modifyKYCData(addressToWhitelist, 1, 1, 1893463200).encodeABI();
        const estimateGasPromise = web3.eth.estimateGas({
            to: contractAddress,
            data: tempData
        });


        const nouncePromise = web3.eth.getTransactionCount(distributionKey, 'pending');

        const allPromises = Promise.all([estimateGasPromise, nouncePromise]);


        allPromises.then((results) => {
            // creating raw tranaction
            console.log(results)
                                
            
            const rawTransaction = {
                from: distributionKey,
                gasPrice: web3.utils.toHex(results[0] + 100000000000),
                gasLimit: web3.utils.toHex(results[0] + 1000000),
                to: contractAddress,
                value: '0x0',
                nonce: web3.utils.toHex(results[1]),
                data: ""
            };


            rawTransaction.data = contract.methods.modifyKYCData(addressToWhitelist, 0, 0, 1893463200).encodeABI();


            // creating tranaction via ethereumjs-tx
            const transaction = new ethereumjs(rawTransaction);
            
            // signing transaction with private key
            transaction.sign(privateKey);
            
            // sending transacton via web3 module
            const serializedTx = transaction.serialize();


            web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {

                console.log("done . . . . . . . .");

            });

        }).catch((err) => {
            console.log("errr 1");
        });
    })
    .catch((err) => {
        console.log("errr 2");
    });


}*/

