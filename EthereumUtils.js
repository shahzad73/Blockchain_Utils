'use strict'  
const Web3 = require('web3');
var dotenv =  require('dotenv')
dotenv.load({path: __dirname + '/config.txt'});

const async = require('async');
const mysql = require("./modules/mysql");
const ethereum = require("./modules/ethereum");
const fs = require('fs');

const Tx = require('ethereumjs-tx').Transaction;


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

var contract_address = "0xd8272d26a012c319c8eaa9683e857b205ea4d500";
var service_address = "0x65d5b5811a64872b799d72edfb225eabfc924c09";
// var linkToBlockchainServer = "http://127.0.0.1:7545";
// 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9
 var linkToBlockchainServer = "https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";




var ByteCode = "0x60806040523480156200001157600080fd5b50604051620019ed380380620019ed83398181016040528101906200003791906200035b565b80818160039080519060200190620000519291906200020b565b5080600490805190602001906200006a9291906200020b565b5050506200007f83836200008860201b60201c565b5050506200069c565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415620000fb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000f2906200041d565b60405180910390fd5b6200010f600083836200020160201b60201c565b8060026000828254620001239190620004d4565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546200017a9190620004d4565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620001e191906200043f565b60405180910390a3620001fd600083836200020660201b60201c565b5050565b505050565b505050565b8280546200021990620005a5565b90600052602060002090601f0160209004810192826200023d576000855562000289565b82601f106200025857805160ff191683800117855562000289565b8280016001018555821562000289579182015b82811115620002885782518255916020019190600101906200026b565b5b5090506200029891906200029c565b5090565b5b80821115620002b75760008160009055506001016200029d565b5090565b6000620002d2620002cc8462000490565b6200045c565b905082815260208101848484011115620002eb57600080fd5b620002f88482856200056f565b509392505050565b600081519050620003118162000668565b92915050565b600082601f8301126200032957600080fd5b81516200033b848260208601620002bb565b91505092915050565b600081519050620003558162000682565b92915050565b6000806000606084860312156200037157600080fd5b6000620003818682870162000300565b9350506020620003948682870162000344565b925050604084015167ffffffffffffffff811115620003b257600080fd5b620003c08682870162000317565b9150509250925092565b6000620003d9601f83620004c3565b91507f45524332303a206d696e7420746f20746865207a65726f2061646472657373006000830152602082019050919050565b620004178162000565565b82525050565b600060208201905081810360008301526200043881620003ca565b9050919050565b60006020820190506200045660008301846200040c565b92915050565b6000604051905081810181811067ffffffffffffffff8211171562000486576200048562000639565b5b8060405250919050565b600067ffffffffffffffff821115620004ae57620004ad62000639565b5b601f19601f8301169050602081019050919050565b600082825260208201905092915050565b6000620004e18262000565565b9150620004ee8362000565565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620005265762000525620005db565b5b828201905092915050565b60006200053e8262000545565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b838110156200058f57808201518184015260208101905062000572565b838111156200059f576000848401525b50505050565b60006002820490506001821680620005be57607f821691505b60208210811415620005d557620005d46200060a565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620006738162000531565b81146200067f57600080fd5b50565b6200068d8162000565565b81146200069957600080fd5b50565b61134180620006ac6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c3919061100a565b60405180910390f35b6100e660048036038101906100e19190610c83565b610308565b6040516100f39190610fef565b60405180910390f35b610104610326565b604051610111919061110c565b60405180910390f35b610134600480360381019061012f9190610c34565b610330565b6040516101419190610fef565b60405180910390f35b610152610428565b60405161015f9190611127565b60405180910390f35b610182600480360381019061017d9190610c83565b610431565b60405161018f9190610fef565b60405180910390f35b6101b260048036038101906101ad9190610bcf565b6104dd565b6040516101bf919061110c565b60405180910390f35b6101d0610525565b6040516101dd919061100a565b60405180910390f35b61020060048036038101906101fb9190610c83565b6105b7565b60405161020d9190610fef565b60405180910390f35b610230600480360381019061022b9190610c83565b6106a2565b60405161023d9190610fef565b60405180910390f35b610260600480360381019061025b9190610bf8565b6106c0565b60405161026d919061110c565b60405180910390f35b6060600380546102859061123c565b80601f01602080910402602001604051908101604052809291908181526020018280546102b19061123c565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b600061031c610315610747565b848461074f565b6001905092915050565b6000600254905090565b600061033d84848461091a565b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000610388610747565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610408576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ff9061108c565b60405180910390fd5b61041c85610414610747565b85840361074f565b60019150509392505050565b60006012905090565b60006104d361043e610747565b84846001600061044c610747565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546104ce919061115e565b61074f565b6001905092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546105349061123c565b80601f01602080910402602001604051908101604052809291908181526020018280546105609061123c565b80156105ad5780601f10610582576101008083540402835291602001916105ad565b820191906000526020600020905b81548152906001019060200180831161059057829003601f168201915b5050505050905090565b600080600160006105c6610747565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610683576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067a906110ec565b60405180910390fd5b61069761068e610747565b8585840361074f565b600191505092915050565b60006106b66106af610747565b848461091a565b6001905092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156107bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107b6906110cc565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561082f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108269061104c565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258360405161090d919061110c565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561098a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610981906110ac565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156109fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f19061102c565b60405180910390fd5b610a05838383610b9b565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610a8b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a829061106c565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610b1e919061115e565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610b82919061110c565b60405180910390a3610b95848484610ba0565b50505050565b505050565b505050565b600081359050610bb4816112dd565b92915050565b600081359050610bc9816112f4565b92915050565b600060208284031215610be157600080fd5b6000610bef84828501610ba5565b91505092915050565b60008060408385031215610c0b57600080fd5b6000610c1985828601610ba5565b9250506020610c2a85828601610ba5565b9150509250929050565b600080600060608486031215610c4957600080fd5b6000610c5786828701610ba5565b9350506020610c6886828701610ba5565b9250506040610c7986828701610bba565b9150509250925092565b60008060408385031215610c9657600080fd5b6000610ca485828601610ba5565b9250506020610cb585828601610bba565b9150509250929050565b610cc8816111c6565b82525050565b6000610cd982611142565b610ce3818561114d565b9350610cf3818560208601611209565b610cfc816112cc565b840191505092915050565b6000610d1460238361114d565b91507f45524332303a207472616e7366657220746f20746865207a65726f206164647260008301527f65737300000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610d7a60228361114d565b91507f45524332303a20617070726f766520746f20746865207a65726f20616464726560008301527f73730000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610de060268361114d565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206260008301527f616c616e636500000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610e4660288361114d565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206160008301527f6c6c6f77616e63650000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610eac60258361114d565b91507f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008301527f64726573730000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610f1260248361114d565b91507f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610f7860258361114d565b91507f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008301527f207a65726f0000000000000000000000000000000000000000000000000000006020830152604082019050919050565b610fda816111f2565b82525050565b610fe9816111fc565b82525050565b60006020820190506110046000830184610cbf565b92915050565b600060208201905081810360008301526110248184610cce565b905092915050565b6000602082019050818103600083015261104581610d07565b9050919050565b6000602082019050818103600083015261106581610d6d565b9050919050565b6000602082019050818103600083015261108581610dd3565b9050919050565b600060208201905081810360008301526110a581610e39565b9050919050565b600060208201905081810360008301526110c581610e9f565b9050919050565b600060208201905081810360008301526110e581610f05565b9050919050565b6000602082019050818103600083015261110581610f6b565b9050919050565b60006020820190506111216000830184610fd1565b92915050565b600060208201905061113c6000830184610fe0565b92915050565b600081519050919050565b600082825260208201905092915050565b6000611169826111f2565b9150611174836111f2565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156111a9576111a861126e565b5b828201905092915050565b60006111bf826111d2565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b8381101561122757808201518184015260208101905061120c565b83811115611236576000848401525b50505050565b6000600282049050600182168061125457607f821691505b602082108114156112685761126761129d565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b6112e6816111b4565b81146112f157600080fd5b50565b6112fd816111f2565b811461130857600080fd5b5056fea264697066735822122006a321cdb2bc7710ae70185c7111bd2e0b231ad6c18e2949080f78af5caa474064736f6c63430008000033";

const abiERC20 = `[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]`;


if (process.argv[2] == "getGas") {
    // node EthereumUtils getGas
    
    ethereum.getGas(linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "EncryptKey") { 
    // node EthereumUtils EncryptKey cRnVt6Y3dXX2LKfgPqTkYagRvXXiFGRPKV5YpfGpGbRmvwTrM78w aaa /home/shahzad/WAWTest.txt

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
    // node EthereumUtils DecryptKey a  /home/shahzad/WorkingDocuments/data/Ethereum_polymathkey_B3c9_Pass_a.txt
    // node EthereumUtils DecryptKey aaa  /home/shahzad/Ethereum_Faer.txt	
	// node EthereumUtils DecryptKey password ~/WAWTest.txt

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
	// node EthereumUtils stoTokenBalance 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9

	ethereum.getAccountStoBalance( process.argv[3], abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "checkInvestorWhiteListed") {
    //node EthereumUtils checkInvestorWhiteListed 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9

	ethereum.checkIsInvestorWhitelistedInService( process.argv[3], abi_service, service_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})
}

if (process.argv[2] == "whiteListInvestor") {

    //node EthereumUtils whiteListInvestor a /home/shahzad/WorkingDocuments/data/Ethereum_polymathkey_B3c9_Pass_a.txt 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9 true

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


if (process.argv[2] == "deploy") {
	  // This will deploy ERC20 token to blockchain 
	  //node EthereumUtils deploy
	
	(async () => {
		
		var web3 = new Web3(new Web3.providers.HttpProvider(linkToBlockchainServer));
			

			  const encodedParameters = web3.eth.abi.encodeParameters(
				[ 'address', 'uint256', 'string'],
				['0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9', '100000000000000000000000', 'MyContractName2']
			  ).slice(2);		
		
		
			// prepare the transaction:
			var contractName = "Test Contract"
			var rawTx = {
				  from: "0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9",
				  data: ByteCode + encodedParameters,
				  gas: 2000000
			}

			
			// sign and send the transaction
			//let contractAddress
			web3.eth.accounts.signTransaction(rawTx, '0xa6109eb204c2d36abe1f620fcd7cca49b926cc11a18d7a2536a71a8a0d695880')
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




function decryptKeyFromFile(file, password) {
	let data = fs.readFileSync(file, 'utf8')
    return ethereum.decryptKey(data, password, linkToBlockchainServer);
    
    //return    {"privateKey": "", "address": ""}
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








