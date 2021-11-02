'use strict'  
const Web3 = require('web3');
var dotenv =  require('dotenv')
dotenv.load({path: __dirname + '/config.txt'});

const async = require('async');
const mysql = require("./modules/mysql");
const ethereum = require("./modules/ethereum");
const fs = require('fs');

const Tx = require('ethereumjs-tx').Transaction;

const ERC1404Token = JSON.parse(fs.readFileSync("./data/ERC1404.json", "utf8")); 


var contract_address = "0x6eFCBcb30EF3C28eA987F807ad6FC3a6CFad1Bd1";
var service_address = "0x6eFCBcb30EF3C28eA987F807ad6FC3a6CFad1Bd1";
//var linkToBlockchainServer = "HTTP://127.0.0.1:7545";
// 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9
var linkToBlockchainServer = "https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";



if (process.argv[2] == "etherBalance") {

	// node erc1404 etherBalance 0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d
	ethereum.getAccountEtherBalance( process.argv[3], ERC1404Token.abi, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "whiteListInvestor") {

    // node erc1404 whiteListInvestor aaa /home/shahzad/WorkingDocuments/data/Keystore_5300_aaa.txt 0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d true

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
	
	
    ethereum.whitelisAddress(4, data2.address, process.argv[5], process.argv[6], data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "deployERC1404") {
	  // This will deploy ERC20 token to blockchain 
	  //node erc1404 deployERC1404
	
	(async () => {
		
		var web3 = new Web3(new Web3.providers.HttpProvider(linkToBlockchainServer));
			

		  const encodedParameters = web3.eth.abi.encodeParameters(
			['uint256', 'string', 'string'],
			['1000000000000000000000', 'ER1404', 'ER1404']
		  ).slice(2);		

			// prepare the transaction:
			var contractName = "Test Contract"
			var rawTx = {
				  from: "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300",
				  data:  ERC1404Token.bytecode  + encodedParameters,
				  gas: 12500000
			}

            
			web3.eth.getGasPrice(function(e, r) { 
				console.log("Current Gas price is : " + r) 
			})				
			
			let estimateGasPromise = web3.eth.estimateGas({
				data: ERC1404Token.bytecode  + encodedParameters
			});						
			const allPromises = Promise.all([estimateGasPromise]);
			allPromises.then((results) => {
					console.log(results);			 // 2224434 will be returned   
			})
			
			/*
			// sign and send the transaction
			//let contractAddress
			web3.eth.accounts.signTransaction(rawTx, '284e878525e21729040938f1e723a90f69f8ad336ce3f10e2357664f5249b915')
			.then((signedTx) => {
				  const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
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
			*/
				
	})();   
   
}

if (process.argv[2] == "checkInvestorWhiteListed") {
    // node erc1404 checkInvestorWhiteListed 0x1a8929fbE9abEc00CDfCda8907408848cBeb5300

	ethereum.checkIsInvestorWhitelistedInService( process.argv[3], ERC1404Token.abi, service_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "whiteListInvestor") {

    // node erc1404 whiteListInvestor aaa /home/shahzad/WorkingDocuments/data/Keystore_5300_aaa.txt 0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d true

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
	
	
    ethereum.whitelisAddress(4, data2.address, process.argv[5], process.argv[6], data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "create") {

	// node erc1404 create aaa /home/shahzad/WorkingDocuments/data/Keystore_5300_aaa.txt 1000000000000000000000
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
	ethereum.tokenCreateBurn(1, 4, data2.address, process.argv[5], data2.privateKey.substring(2), service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data){
		console.log("done");
        process.exit(0);
	})
	
}

if (process.argv[2] == "burn") {

	// node erc1404 burn aaa /home/shahzad/WorkingDocuments/data/Keystore_D13D_aaa.txt 1000
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
	ethereum.tokenCreateBurn(2, 4, data2.address,  process.argv[5],  data2.privateKey.substring(2), service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data){
		console.log("done");
        process.exit(0);
	})

}




function decryptKeyFromFile(file, password) {
	let data = fs.readFileSync(file, 'utf8')
    return ethereum.decryptKey(data, password, linkToBlockchainServer);
    
    //return    {"privateKey": "", "address": ""}
}



