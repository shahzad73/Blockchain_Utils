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


var abi_contract = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x06fdde03"
    },
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
      "type": "function",
      "signature": "0x095ea7b3"
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
      "type": "function",
      "signature": "0x18160ddd"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
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
      "type": "function",
      "signature": "0x23b872dd"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupplyToken",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x27213345"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x313ce567"
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
      "type": "function",
      "signature": "0x39509351"
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
      "type": "function",
      "signature": "0x40c10f19"
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
      "type": "function",
      "signature": "0x70a08231"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x95d89b41"
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
      "type": "function",
      "signature": "0x983b2d56"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceMinter",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x98650275"
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
      "type": "function",
      "signature": "0xa457c2d7"
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
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xa9059cbb"
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
      "type": "function",
      "signature": "0xaa271e1a"
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
      "type": "function",
      "signature": "0xdd62ed3e"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor",
      "signature": "constructor"
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
      "type": "event",
      "signature": "0x6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f6"
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
      "type": "event",
      "signature": "0xe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb66692"
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
      "type": "event",
      "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
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
      "type": "event",
      "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
    }
  ]
var contract_address = "0x50Cfea66d012A8e0F47a15e3dA999a67807959f5";
var privateKey = "0xf676c99a7823dc3f6e51bba014864d714306b8b0f6be86e7b19c3d3905f043d0"




if (process.argv[2] == "EncryptKey") {
    
    // node EthereumUtils EncryptKey 0x10b74b21fbd76b922c68ab06e9d0c72766a8286220e655623f974239b868cc05 Allahis1 f:\fil1.txt

     var data = ethereum.encryptKey(process.argv[3], process.argv[4]); 
     fs.writeFileSync(process.argv[5], JSON.stringify(data));
	 console.log(JSON.stringify(data))
}

if (process.argv[2] == "DecryptKey") {
    // node EthereumUtils DecryptKey Allahis1 f:\fil1.txt
    
	let data = fs.readFileSync(process.argv[4], 'utf8')
    let data2 = ethereum.decryptKey(data, process.argv[3]);
    console.log(data2.privateKey);
    console.log(data2.address);
}

if (process.argv[2] == "send") {

    //node EthereumUtils send 0x64aa9045ed3f11af8981458db106bef048a0dc47  0xe53e1915a883b29e9da61d146effc11ccc515615

    ethereum.sendTokens(process.argv[3], process.argv[4], 10, abi_contract, contract_address ,'http://localhost:8545').then(function(data){
		console.log(data);
	})

}

if (process.argv[2] == "balance") {
	
	// node EthereumUtils balance 0xb1e5b680fc802f086b5857bd73b62b79c6dfc235
	
	ethereum.getAccountBalance( process.argv[3], abi_contract, contract_address ,'http://localhost:8545').then(function(data){
		console.log(data)
	})
	
}

if (process.argv[2] == "test") {
	
	//node EthereumUtils test\
	
	const Web3 = require('web3');
	const ethereumjs = require('ethereumjs-tx');
	
	var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	
	var fromAddress = "0xb1CE379F10f8eC52DB8D97652e890B5DEeFa64EB";
	
	var count = web3.eth.getTransactionCount(fromAddress);
	var contract = web3.eth.contract(abi_contract).at(contract_address);
	var rawTransaction = {
		"from": fromAddress,
		"nonce": web3.toHex(count+1),
		"gasPrice": "0x04e3b29200",
		"gasLimit": "0x7458",
		"to": contract_address,
		"value": "0x0",
		"data": contract.balanceOf(fromAddress),
		"chainId": 0x03
	};

	var tx = new ethereumjs(rawTransaction);
	var serializedTx = tx.serialize();
	
	var result = web3.eth.call({
	   to: contract_address, 
	   data: serializedTx
	});
	console.log(result);	
	
	
}

if (process.argv[2] == "create") {
	
	//node EthereumUtils 
	ethereum.createNewToken(abi_contract, contract_address ,'http://localhost:8545').then(function(data){
		console.log("done")
	})
		
	
}

















