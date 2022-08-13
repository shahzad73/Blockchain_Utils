'use strict'  
const Web3 = require('web3');
var dotenv =  require('dotenv')
console.log(__dirname)
dotenv.config({path: __dirname + '/config.txt'});


const async = require('async');
const mysql = require("./modules/mysql");
const ethereum = require("./modules/ethereum");
const fs = require('fs');

const Tx = require('ethereumjs-tx').Transaction;

const ERC1404Token = JSON.parse(fs.readFileSync("./data/ERC1404.json", "utf8")); 

//local
//var contract_address = "0x3F4B2e1B4Ca4B32EF29e3bf90362d30Cc45B30a5";
//var service_address = "0x3F4B2e1B4Ca4B32EF29e3bf90362d30Cc45B30a5";

//kovan
var contract_address = "0x783b55DDf115d713c4CAf0944f42fC4eDd45387b";
var service_address = "0x783b55DDf115d713c4CAf0944f42fC4eDd45387b";

//var linkToBlockchainServer = "HTTP://127.0.0.1:7545";
// var linkToBlockchainServer = "https://mainnet.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";
//var linkToBlockchainServer = "https://matic-mumbai--jsonrpc.datahub.figment.io/apikey/9737e952f56cd7bdca83d6bb4fdf1576"      //Polygone test
var linkToBlockchainServer = "https://matic-mainnet--jsonrpc.datahub.figment.io/apikey/9737e952f56cd7bdca83d6bb4fdf1576"      //Polygone mainnet
//var linkToBlockchainServer = "https://data-seed-prebsc-1-s1.binance.org:8545"      //Binanace chain testnet    not yet tested
//var linkToBlockchainServer = "https://bsc-dataseed1.binance.org"    // Binance chain mainnet     

//var dolloarValue = 2000;    // Ethereum
var dolloarValue = 2.35;       // Polygon    MATIC, the native tokens of Polygon
//var dolloarValue = 380;       //BNB for bianace chain
 

if (process.argv[2] == "etherBalance") {

	// node erc1404 etherBalance 0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d
	ethereum.getAccountEtherBalance( process.argv[3], ERC1404Token.abi, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

/*if (process.argv[2] == "whiteListInvestor") {

    // node erc1404 whiteListInvestor aaa /home/shahzad/WorkingDocuments/data/Keystore_5300_aaa.txt 0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d true

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);

    ethereum.whitelisAddress(4, data2.address, process.argv[5], process.argv[6], data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data){
		console.log(data);
        process.exit(0);
	})

}*/

if (process.argv[2] == "deployERC1404") {
	  // This will deploy ERC20 token to blockchain 
	  // node erc1404 deployERC1404
	
	
	(async () => {

		var web3 = new Web3(new Web3.providers.HttpProvider(linkToBlockchainServer));

		  const encodedParameters = web3.eth.abi.encodeParameters(
			['uint256', 'string', 'string', 'uint256', 'uint256', 'string', 'string', 'string'],
			['100000000000000000000000', 'ERC04', 'ERC04', 5, 18, "Site website link", "Website link document", " website document links"]
		  ).slice(2);


			// prepare the transaction:
			var rawTx = {
				  from: "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300",
				  data:  ERC1404Token.bytecode  + encodedParameters,
				  gas: 6721975
			}

			
			var gasPrice = await web3.eth.getGasPrice();
						
			let estimateGasPromise = web3.eth.estimateGas({
				data: ERC1404Token.bytecode  + encodedParameters
			});						
			const allPromises = Promise.all([estimateGasPromise]);
			var gas = await allPromises;
		
			var block = await web3.eth.getBlock("latest");
			//var gasLimit = block.gasLimit/block.transactions.length;

					
			const etherValue = Web3.utils.fromWei(gasPrice, 'ether');
			console.log("gasLimit: " + block.gasLimit);
			
			//this is the constant used in multisto  i have increased the size in that estimation as well
			console.log( "Gas Estimate : " + gas )				

			console.log( "Gas : " + gasPrice )		
			console.log( "ETH :" + gas * etherValue );		
			console.log( "$" + gas * etherValue *  dolloarValue);


		
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
    // node erc1404 checkInvestorWhiteListed 0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d

	ethereum.getKYCData( process.argv[3], ERC1404Token.abi, service_address, linkToBlockchainServer).then(function(data){
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

if (process.argv[2] == "stoTokenBalance") {
	// node erc1404 stoTokenBalance 0x1a8929fbE9abEc00CDfCda8907408848cBeb5300

	ethereum.getAccountStoBalance( process.argv[3], ERC1404Token.abi, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "sendTokens") {

    //node erc1404 sendTokens aaa /home/shahzad/WorkingDocuments/data/Keystore_5300_aaa.txt  0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d 10000000000000000000

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
    ethereum.sendTokens(data2.address, process.argv[5], parseInt(process.argv[6]),  data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data){
		console.log(data);
        process.exit(0);
	});

}



if (process.argv[2] == "approve") {

    //node erc1404 approve aaa /home/shahzad/WorkingDocuments/data/Keystore_5300_aaa.txt 0x8192706d699390D668710BD247886e3016D4672E 800000000000000000000
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
    ethereum.approve(data2.address, process.argv[5], parseInt(process.argv[6]),  data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data){
		console.log(data);
        process.exit(0);
	});

}

if (process.argv[2] == "allowance") {
	// node erc1404 allowance 0x1a8929fbE9abEc00CDfCda8907408848cBeb5300  0x8192706d699390D668710BD247886e3016D4672E 

	ethereum.getAccountAllowance( process.argv[3], process.argv[4] , ERC1404Token.abi, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "approveTransfer") {

    //node erc1404 approveTransfer aaa /home/shahzad/WorkingDocuments/data/Keystore_672E_aaa.txt  0x1a8929fbE9abEc00CDfCda8907408848cBeb5300 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9 100000000000000000000

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
    ethereum.approveTransfer(data2.address, process.argv[5], process.argv[6], parseInt(process.argv[7]),  data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data) {
		console.log(data);
        process.exit(0);
	});

}

if (process.argv[2] == "getOwner") {
	// node erc1404 getOwner

	ethereum.getOwner( ERC1404Token.abi, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}



if (process.argv[2] == "getAllowedInvestors") {
    // node erc1404 getAllowedInvestors

	ethereum.getAllowedInvestors( ERC1404Token.abi, service_address, linkToBlockchainServer ).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "getCurrentTotalInvestors") {
    // node erc1404 getCurrentTotalInvestors

	ethereum.getCurrentTotalInvestors( ERC1404Token.abi, service_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "getWhitelistAuthorityStatus") {
    // node erc1404 getWhitelistAuthorityStatus 0x1a8929fbE9abEc00CDfCda8907408848cBeb5300

	ethereum.getWhitelistAuthorityStatus( process.argv[3],  ERC1404Token.abi,  service_address, linkToBlockchainServer ).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "setStaticInformation") {
    // node erc1404 setStaticInformation 1

	ethereum.setStaticInformation( process.argv[3],  ERC1404Token.abi,  service_address, linkToBlockchainServer ).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "setWhitelistAuthorityStatus") {

    //node erc1404 setWhitelistAuthorityStatus aaa /home/shahzad/WorkingDocuments/data/Keystore_5300_aaa.txt 0x1a8929fbE9abEc00CDfCda8907408848cBeb5300 true
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
    ethereum.setWhitelistAuthorityStatus(process.argv[5], process.argv[6], data2.privateKey.substring(2), data2.address,  ERC1404Token.abi, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	});

}





function decryptKeyFromFile(file, password) {
	let data = fs.readFileSync(file, 'utf8')
    return ethereum.decryptKey(data, password, linkToBlockchainServer);
    
    //return    {"privateKey": "", "address": ""}
}



