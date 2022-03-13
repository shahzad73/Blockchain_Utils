'use strict'  
const Web3 = require('web3');
var dotenv =  require('dotenv')
dotenv.load({path: __dirname + '/config.txt'});

const async = require('async');
const mysql = require("./modules/mysql");
const ethereum = require("./modules/ethereum");
const fs = require('fs');

const Tx = require('ethereumjs-tx').Transaction;

const ERC20Token =  JSON.parse(fs.readFileSync("./data/ERC20.json", "utf8")); 
const ERC1404Token = JSON.parse(fs.readFileSync("./data/ERC1404.json", "utf8")); 


// deploy the contract without truffle with node
// https://medium.com/coinmonks/deploy-smart-contract-with-web3js-account-private-key-no-truffle-solidity-tutorial-2-5926fface340

//https://github.com/ethereum/wiki/wiki/JavaScript-API#example-45

/*
    node EthereumUtils getGas
    node EthereumUtils EncryptKey 03fd0b64a5a5204da6690c2e3c7478fc38a90b2fb819fd52615157c02ab1b35c aaa ~/keystore0forPolyMath.txt
    node EthereumUtils DecryptKey aaa ~/keystore.txt
    node EthereumUtils etherBalance 0xDB0d238BAeF0bDE591841a66eC886f3dC7A8De48
    node EthereumUtils stoTokenBalance 0x9c2F684cCA0Bc981e96Af82BF82A56ae3997BcA1
    node EthereumUtils TotalSupply
    node EthereumUtils checkInvestorWhiteListed 0xB520234B0530a4EE5737Fca29636B840AfB6EbD2
    node EthereumUtils whiteListInvestor aaa ~/keystore.txt 0xB520234B0530a4EE5737Fca29636B840AfB6EbD2 true
    node EthereumUtils sendTokens aaa ~/keystore.txt 0xB520234B0530a4EE5737Fca29636B840AfB6EbD2 1000
    node EthereumUtils forceTransfer aaa ~/keystore.txt 0xDB0d238BAeF0bDE591841a66eC886f3dC7A8De48  100
    node EthereumUtils create aaa ~/keystore.txt 1000
    node EthereumUtils burn aaa ~/keystore.txt 1000
*/
 
var abi_contract = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burnFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "registry",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "addMinter",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceMinter",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isMinter",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_registry",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "reason",
          "type": "uint8"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "CheckStatus",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "account",
          "type": "address"
        }
      ],
      "name": "MinterAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "account",
          "type": "address"
        }
      ],
      "name": "MinterRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "forceTransfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "_service",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
var abi_service =  [
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x715018a6"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x8da5cb5b"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x8f32d59b"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "whitelisted",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xd936547e"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xf2fde38b"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event",
      "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "user",
          "type": "address"
        }
      ],
      "name": "addWhitelistAddress",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x94a7ef15"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "user",
          "type": "address"
        }
      ],
      "name": "removeWhitelistAddress",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb7ecbaae"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "user",
          "type": "address"
        }
      ],
      "name": "isInvestorWhiteListed",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xf3c6e993"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_token",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "check",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x803fcd43"
    }
  ];

//https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8

var contract_address = "0xed039c7a98196C87a8D16129dD768953063bB42C";
var service_address = "0xed039c7a98196C87a8D16129dD768953063bB42C";
//var linkToBlockchainServer = "HTTP://127.0.0.1:7545";
// 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9
var linkToBlockchainServer = "https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";




if (process.argv[2] == "getGas") {
    // node EthereumUtils getGas
    
    ethereum.getGas(linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "EncryptKey") { 
    // node EthereumUtils EncryptKey f32805a8e67ab4f0a412e62af31c36c7b5ae4f31bbeeae2eb55f2e0655a328fb aaa /home/shahzad/Keystor672E.txt

     var data = ethereum.encryptKey(process.argv[3], process.argv[4], linkToBlockchainServer); 
     fs.writeFileSync(process.argv[5], JSON.stringify(data));
	 console.log(JSON.stringify(data));
     process.exit(0);
}

if (process.argv[2] == "TotalSupply") {
    //// node EthereumUtils TotalSupply
	ethereum.getTotalSupplyOfTokens( ERC1404ABI, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "DecryptKey") {
    // node EthereumUtils DecryptKey aaa  /home/shahzad/WorkingDocuments/data/Keystore_D13D.txt
    // node EthereumUtils DecryptKey aaa  /home/shahzad/Ethereum_Faer.txt	
	// node EthereumUtils DecryptKey password ~/WAWTest.txt

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    console.log(data2.privateKey);
    console.log(data2.address);
    process.exit(0);
}

if (process.argv[2] == "etherBalance") {

	// node EthereumUtils etherBalance 0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9
	ethereum.getAccountEtherBalance( process.argv[3], abi_contract, contract_address, linkToBlockchainServer).then(function(data) {
		
		console.log(Web3.utils.fromWei(data, "ether") + " ETH").toFixed(4);
		
        process.exit(0);
	})

}

if (process.argv[2] == "stoTokenBalance") {
	// node EthereumUtils stoTokenBalance 0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d

	ethereum.getAccountStoBalance( process.argv[3], abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "getOwner") {
	// node EthereumUtils getOwner

	ethereum.getOwner( ERC1404ABI, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "checkInvestorWhiteListed") {
    // node EthereumUtils checkInvestorWhiteListed 0x1a8929fbE9abEc00CDfCda8907408848cBeb5300

	ethereum.checkIsInvestorWhitelistedInService( process.argv[3], ERC1404ABI, service_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "whiteListInvestor") {

    // node EthereumUtils whiteListInvestor aaa /home/shahzad/WorkingDocuments/data/Keystore_D13D_aaa.txt 0x1a8929fbE9abEc00CDfCda8907408848cBeb5300 true

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
	
	
    ethereum.whitelisAddress(4, data2.address, process.argv[5], process.argv[6], data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, ERC1404Token.abi).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "sendTokens") {

    //node EthereumUtils sendTokens aaa /home/shahzad/WorkingDocuments/data/Keystore_D13D_aaa.txt  0x1a8929fbE9abEc00CDfCda8907408848cBeb5300 10

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
    ethereum.sendTokens(data2.address, process.argv[5], parseInt(process.argv[6]),  data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, abi_contract).then(function(data){
		console.log(data);
        process.exit(0);
	});

}

if (process.argv[2] == "approve") {

    //node EthereumUtils approve a ~/WorkingDocuments/Ethereum_localkey2.txt 0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9 300
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
    ethereum.approve(data2.address, process.argv[5], parseInt(process.argv[6]),  data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, abi_contract).then(function(data){
		console.log(data);
        process.exit(0);
	});

}

if (process.argv[2] == "allowance") {
	// node EthereumUtils allowance 0xcD063145Fcd75aca7C2c3CaD2675B4328dbd8f83  0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9 

	ethereum.getAccountAllowance( process.argv[3], process.argv[4] , abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}


if (process.argv[2] == "getERC20Transaction") {
		// node EthereumUtils getERC20Transaction 0xc3c7cbf3c5a938495e934eba3d37fb0ed3ed87c1d86cd5d9b5af76b48a158a65
	
		ethereum.getERC20TransactionDetails( process.argv[3], linkToBlockchainServer).then(function(data){
				console.log(data);
				process.exit(0);
				
		})
}

if (process.argv[2] == "getETHTransaction") {
		// node EthereumUtils getETHTransaction 0x08b60e2035de0bfa010fb516778134383cb3a96d25786dd0a5c4d1b5241b4695
	
		ethereum.getTransferredETHFomTransaction( process.argv[3], linkToBlockchainServer).then(function(data){
				console.log(data);
				process.exit(0);
				
		})
}



``





if (process.argv[2] == "forceTransfer") {

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
        
    ethereum.forceTransfer( process.argv[5], data2.address, parseInt(process.argv[6]),  data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, abi_contract ).then(function(data){
		console.log(data);
        process.exit(0);
	});

}

if (process.argv[2] == "create") {

	// node EthereumUtils create a ~/WorkingDocuments/Ethereum_polymathkey.txt 1000
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    console.log(data2)
	ethereum.tokenCreateBurn(1, 1, data2.address, parseInt(process.argv[5]), data2.privateKey.substring(2), contract_address, linkToBlockchainServer, abi_contract).then(function(data){
		console.log("done");
        process.exit(0);
	})
	
}

if (process.argv[2] == "burn") {

	// node EthereumUtils burn a ~/WorkingDocuments/Ethereum_localkey.txt 1000
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
	ethereum.tokenCreateBurn(2, 4, data2.address,  process.argv[5],  data2.privateKey.substring(2), contract_address, linkToBlockchainServer, abi_contract).then(function(data){
		console.log("done");
        process.exit(0);
	})

}

if (process.argv[2] == "test") {
    //node EthereumUtils test
    
    ethereum.test().then(function(data) {
        console.log(data);
        process.exit(0);
    });
}

if (process.argv[2] == "deploy") {
	  // This will deploy ERC20 token to blockchain 
	  //node EthereumUtils deploy
	
	(async () => {
		
		var web3 = new Web3(new Web3.providers.HttpProvider(linkToBlockchainServer));
			

			  const encodedParameters = web3.eth.abi.encodeParameters(
				[ 'address', 'uint256', 'string'],
				['0x5b31fC93a7a120D467651BF2aD15b0940E0Fcbd5', '100000000000000000000000', 'MyContractName2']
			  ).slice(2);		
		
		
			// prepare the transaction:
			var contractName = "Test Contract"
			var rawTx = {
				  from: "0x5b31fC93a7a120D467651BF2aD15b0940E0Fcbd5",
				  data: ByteCode + encodedParameters,
				  gas: 2000000
			}

			
			// sign and send the transaction
			//let contractAddress
			web3.eth.accounts.signTransaction(rawTx, '813ddff82e05736b19ad1abf16060bab69f62e0ef88493295328d10d2b3d1193')
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
		
				
	})();   
   
}

if (process.argv[2] == "deployERC20") {
	  // This will deploy ERC20 token to blockchain 
	  //node EthereumUtils deployERC20
	
	(async () => {
		
		var web3 = new Web3(new Web3.providers.HttpProvider(linkToBlockchainServer));
			

			  const encodedParameters = web3.eth.abi.encodeParameters(
				[ 'address', 'uint256', 'string'],
				['0x1a8929fbE9abEc00CDfCda8907408848cBeb5300', '100000000000000000000000', 'ER20']
			  ).slice(2);		


		
			// prepare the transaction:
			var contractName = "Test Contract"
			var rawTx = {
				  from: "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300",
				  data:  ERC20Token.bytecode  + encodedParameters,
				  gas: 2000000
			}

			
			let estimateGasPromise = web3.eth.estimateGas({
				data: ERC20Token.bytecode  + encodedParameters
			});						
			const allPromises = Promise.all([estimateGasPromise]);
			allPromises.then((results) => {
					console.log(results);			 //  1229935  will be returned 
			})			
			
			
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
		
				
	})();   
   
}

if (process.argv[2] == "deployERC20") {
	const Web3 = require("web3")

	const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/YOUR_PROJECT_ID"))

	web3.eth.getBalance("0x52bc44d5378309EE2abF1539BF71dE1b7d7bE3b5", function(err, result) {
	  if (err) {
		console.log(err)
	  } else {
		console.log(web3.utils.fromWei(result, "ether") + " ETH")
	  }
	})
}

function decryptKeyFromFile(file, password) {
	let data = fs.readFileSync(file, 'utf8')
    return ethereum.decryptKey(data, password, linkToBlockchainServer);
    
    //return    {"privateKey": "", "address": ""}
}



if (process.argv[2] == "compileSmartContract") {
  // node EthereumUtils compileSmartContract

  const solc = require('solc');
  const path = require('path');  
  
  const tokenSalePath = path.resolve(__dirname, 'data', 'contract.sol');
  var source = fs.readFileSync(tokenSalePath, 'utf-8');

  var solcInput = {
    language: "Solidity",
    sources: { 
        contract: {
            content: source
        }
     },
    settings: {
        optimizer: {
            enabled: true
        },
        evmVersion: "byzantium",
        outputSelection: {
            "*": {
              "": [
                "legacyAST",
                "ast"
              ],
              "*": [
                "abi",
                "evm.bytecode.object",
                "evm.bytecode.sourceMap",
                "evm.deployedBytecode.object",
                "evm.deployedBytecode.sourceMap",
                "evm.gasEstimates"
              ]
            },
        }
    }
};

solcInput = JSON.stringify(solcInput);
var contractObject = solc.compile(solcInput);
contractObject = JSON.parse(contractObject);

console.log(JSON.stringify(contractObject) );

}



/*

const fs   = require("fs");
const Web3 = require("web3");

const NODE_ADDRESS  = "...";
const PRIVATE_KEY   = "...";
const CONTRACT_NAME = "...";
const CONTRACT_ARGS = [...];

async function scan(message) {
    process.stdout.write(message);
    return await new Promise(function(resolve, reject) {
        process.stdin.resume();
        process.stdin.once("data", function(data) {
            process.stdin.pause();
            resolve(data.toString().trim());
        });
    });
}

async function getGasPrice(web3) {
    while (true) {
        const nodeGasPrice = await web3.eth.getGasPrice();
        const userGasPrice = await scan(`Enter gas-price or leave empty to use ${nodeGasPrice}: `);
        if (/^\d+$/.test(userGasPrice))
            return userGasPrice;
        if (userGasPrice == "")
            return nodeGasPrice;
        console.log("Illegal gas-price");
    }
}

async function getTransactionReceipt(web3) {
    while (true) {
        const hash = await scan("Enter transaction-hash or leave empty to retry: ");
        if (/^0x([0-9A-Fa-f]{64})$/.test(hash)) {
            const receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt)
                return receipt;
            console.log("Invalid transaction-hash");
        }
        else if (hash) {
            console.log("Illegal transaction-hash");
        }
        else {
            return null;
        }
    }
}

async function send(web3, account, transaction) {
    while (true) {
        try {
            const options = {
                data    : transaction.encodeABI(),
                gas     : await transaction.estimateGas({from: account.address}),
                gasPrice: await getGasPrice(web3),
            };
            const signed  = await web3.eth.accounts.signTransaction(options, account.privateKey);
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            return receipt;
        }
        catch (error) {
            console.log(error.message);
            const receipt = await getTransactionReceipt(web3);
            if (receipt)
                return receipt;
        }
    }
}

async function run() {
    const web3        = new Web3(NODE_ADDRESS);
    const account     = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    const abi         = fs.readFileSync(CONTRACT_NAME + ".abi", {encoding: "utf8"});
    const bin         = fs.readFileSync(CONTRACT_NAME + ".bin", {encoding: "utf8"});
    const contract    = new web3.eth.Contract(JSON.parse(abi));
    const options     = {data: "0x" + bin, arguments: CONTRACT_ARGS};
    const transaction = contract.deploy(options);
    const receipt     = await send(web3, account, transaction);
    console.log(receipt.contractAddress);
    if (web3.currentProvider.constructor.name == "WebsocketProvider")
        web3.currentProvider.connection.close();
}









		
			  ByteCode = ByteCode + encodedParameters
				
		
			  const nonce = await web3.eth.getTransactionCount("0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9");
			  const gasPrice = await web3.eth.getGasPrice();
				console.log("11111----" + gasPrice);
			   //const gasLimit = await web3.eth.estimateGas({ ByteCode });
				//console.log( "2222----" + gasLimit )
			  const privateKey = Buffer.from("a6109eb204c2d36abe1f620fcd7cca49b926cc11a18d7a2536a71a8a0d695880", 'hex');
				

			  const txObject = {
				nonce: web3.utils.toHex(nonce),
				gasLimit: web3.utils.toHex(20000000000),
				gasPrice: web3.utils.toHex(gasPrice),
				data: ByteCode,
				chainId: 42
			  };			
			
			  const tx = new Tx(txObject);
			  tx.sign("a6109eb204c2d36abe1f620fcd7cca49b926cc11a18d7a2536a71a8a0d695880");

			  const serializedTx = tx.serialize();
			  const raw = '0x' + serializedTx.toString('hex');

			  const txReceipt = await web3.eth.sendSignedTransaction(raw);
			  console.log('Contract Address:', txReceipt.contractAddress);
			  console.log('Transaction Hash:', txReceipt.transactionHash);		

*/








