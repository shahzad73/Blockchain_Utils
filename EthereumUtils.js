'use strict'  

var dotenv =  require('dotenv')
dotenv.load({path: __dirname + '/config.txt'});

const async = require('async');
const mysql = require("./modules/mysql");
const ethereum = require("./modules/ethereum");
const fs = require('fs');

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

var contract_address = "0xF2A6143Bf60885d2044a744943d09ca1C05EF66F";
var service_address = "0x3a3dfefaC4290Ea514d397ccA69D188f036129D9";
var linkToBlockchainServer = "https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";

if (process.argv[2] == "getGas") {
    // node EthereumUtils getGas
    
    ethereum.getGas(linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "EncryptKey") { 
    // node EthereumUtils EncryptKey 674a573f837f781532997136904883eddb562608c8b36a41719ed04a2d0924c7 a \home\shahzad\Ethereum_localkey_2.txt

     var data = ethereum.encryptKey(process.argv[3], process.argv[4], linkToBlockchainServer); 
     fs.writeFileSync(process.argv[5], JSON.stringify(data));
	 console.log(JSON.stringify(data));
     process.exit(0);
}

if (process.argv[2] == "TotalSupply") {
    //// node EthereumUtils TotalSupply
	ethereum.getTotalSupplyOfTokens( abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "DecryptKey") {
    // node EthereumUtils DecryptKey a  \home\shahzad\Ethereum_localkey.txt

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    console.log(data2.privateKey);
    console.log(data2.address);
    process.exit(0);
}

if (process.argv[2] == "etherBalance") {

	// node EthereumUtils etherBalance 0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9
	ethereum.getAccountEtherBalance( process.argv[3], abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "stoTokenBalance") {
	// node EthereumUtils stoTokenBalance 0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9
    // node EthereumUtils stoTokenBalance 0xDB0d238BAeF0bDE591841a66eC886f3dC7A8De48

	ethereum.getAccountStoBalance( process.argv[3], abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "checkInvestorWhiteListed") {
    //node EthereumUtils checkInvestorWhiteListed 0xcD063145Fcd75aca7C2c3CaD2675B4328dbd8f83

	ethereum.checkIsInvestorWhitelistedInService( process.argv[3], abi_service, service_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "whiteListInvestor") {

    //node EthereumUtils whiteListInvestor a ~/WorkingDocuments/Ethereum_localkey.txt  0xcD063145Fcd75aca7C2c3CaD2675B4328dbd8f83 true

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
    
    ethereum.whitelisAddress(1, data2.address, process.argv[5], process.argv[6], data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, abi_service).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "sendTokens") {

    //node EthereumUtils sendTokens aaa ~/WorkingDocuments/Ethereum_localkey.txt 0xF735763f57b62a388E371A394FE610fD258C6Bf7 10
    
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



if (process.argv[2] == "forceTransfer") {

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
        
    ethereum.forceTransfer( process.argv[5], data2.address, parseInt(process.argv[6]),  data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, abi_contract ).then(function(data){
		console.log(data);
        process.exit(0);
	});

}

if (process.argv[2] == "create") {

	// node EthereumUtils create a ~/WorkingDocuments/Ethereum_localkey.txt 1000
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
	ethereum.tokenCreateBurn(1, 1, data2.address, parseInt(process.argv[5]), data2.privateKey.substring(2), contract_address, linkToBlockchainServer, abi_contract).then(function(data){
		console.log("done");
        process.exit(0);
	})
	
}

if (process.argv[2] == "burn") {

	// node EthereumUtils burn a ~/WorkingDocuments/Ethereum_localkey.txt 1000
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
	ethereum.tokenCreateBurn(2, 1, data2.address,  parseInt(process.argv[5]),  data2.privateKey.substring(2), contract_address, linkToBlockchainServer, abi_contract).then(function(data){
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



function decryptKeyFromFile(file, password) {
	let data = fs.readFileSync(file, 'utf8')
    return ethereum.decryptKey(data, password, linkToBlockchainServer);
    
    //return    {"privateKey": "", "address": ""}
}