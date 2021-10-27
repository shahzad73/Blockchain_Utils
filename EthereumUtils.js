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






var ERC1404ABI =  [
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
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
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
      "name": "SUCCESS_CODE",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
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
          "name": "success",
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
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "removeFromBothSendAndReceiveAllowed",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "removeFromReceiveAllowed",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "addToReceiveAllowed",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "managerAddress",
          "type": "address"
        }
      ],
      "name": "addManager",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "sendAllowed",
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
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
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
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "addToBothSendAndReceiveAllowed",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "SEND_NOT_ALLOWED_CODE",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
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
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseApproval",
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
          "name": "_owner",
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
      "constant": true,
      "inputs": [
        {
          "name": "restrictionCode",
          "type": "uint8"
        }
      ],
      "name": "messageForTransferRestriction",
      "outputs": [
        {
          "name": "message",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "SEND_NOT_ALLOWED_ERROR",
      "outputs": [
        {
          "name": "",
          "type": "string"
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
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "RECEIVE_NOT_ALLOWED_ERROR",
      "outputs": [
        {
          "name": "",
          "type": "string"
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
          "name": "success",
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
          "name": "managerAddress",
          "type": "address"
        }
      ],
      "name": "removeManager",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "RECEIVE_NOT_ALLOWED_CODE",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isManager",
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
      "name": "detectTransferRestriction",
      "outputs": [
        {
          "name": "restrictionCode",
          "type": "uint8"
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
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseApproval",
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
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
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
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "addToSendAllowed",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "SUCCESS_MESSAGE",
      "outputs": [
        {
          "name": "",
          "type": "string"
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
          "name": "",
          "type": "address"
        }
      ],
      "name": "receiveAllowed",
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
          "name": "managerAddress",
          "type": "address"
        }
      ],
      "name": "checkManagerStatus",
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
          "name": "_newOwner",
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
      "constant": false,
      "inputs": [
        {
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "removeFromSendAllowed",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "managers",
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
      "inputs": [
        {
          "name": "initialAccount",
          "type": "address"
        },
        {
          "name": "initialBalance",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
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
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipRenounced",
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
    }
  ];

var ERC1404bytecode = "0x60806040523480156200001157600080fd5b506040516200378f3803806200378f833981018060405281019080805190602001909291908051906020019092919080518201929190505050828282816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816001819055508090508060039080519060200190620000b292919062000a28565b506012600460006101000a81548160ff021916908360ff160217905550505050600673__MessagesAndCodes______________________636ef3054c909160006040805190810160405280600781526020017f53554343455353000000000000000000000000000000000000000000000000008152506040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808481526020018360ff1660ff16815260200180602001828103825283818151815260200191508051906020019080838360005b83811015620001a75780820151818401526020810190506200018a565b50505050905090810190601f168015620001d55780820380516001836020036101000a031916815260200191505b5094505050505060206040518083038186803b158015620001f557600080fd5b505af41580156200020a573d6000803e3d6000fd5b505050506040513d60208110156200022157600080fd5b81019080805190602001909291905050505033600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600673__MessagesAndCodes______________________63ef0067949091606060405190810160405280603081526020017f494c4c4547414c5f5452414e534645525f53454e44494e475f4143434f554e5481526020017f5f4e4f545f57484954454c4953544544000000000000000000000000000000008152506040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156200036257808201518184015260208101905062000345565b50505050905090810190601f168015620003905780820380516001836020036101000a031916815260200191505b50935050505060206040518083038186803b158015620003af57600080fd5b505af4158015620003c4573d6000803e3d6000fd5b505050506040513d6020811015620003db57600080fd5b8101908080519060200190929190505050600c60006101000a81548160ff021916908360ff160217905550600673__MessagesAndCodes______________________63ef0067949091606060405190810160405280603281526020017f494c4c4547414c5f5452414e534645525f524543454956494e475f4143434f5581526020017f4e545f4e4f545f57484954454c495354454400000000000000000000000000008152506040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200180602001828103825283818151815260200191508051906020019080838360005b83811015620004f4578082015181840152602081019050620004d7565b50505050905090810190601f168015620005225780820380516001836020036101000a031916815260200191505b50935050505060206040518083038186803b1580156200054157600080fd5b505af415801562000556573d6000803e3d6000fd5b505050506040513d60208110156200056d57600080fd5b8101908080519060200190929190505050600c60016101000a81548160ff021916908360ff160217905550620005b283620005bb640100000000026401000000009004565b50505062000ad7565b620005d53362000700640100000000026401000000009004565b806200062e5750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515620006c9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b620006e38162000756640100000000026401000000009004565b620006fd81620008bf640100000000026401000000009004565b50565b6000600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b620007703362000700640100000000026401000000009004565b80620007c95750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151562000864576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b6001600a60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b620008d93362000700640100000000026401000000009004565b80620009325750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515620009cd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b6001600b60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1062000a6b57805160ff191683800117855562000a9c565b8280016001018555821562000a9c579182015b8281111562000a9b57825182559160200191906001019062000a7e565b5b50905062000aab919062000aaf565b5090565b62000ad491905b8082111562000ad057600081600090555060010162000ab6565b5090565b90565b612ca88062000ae76000396000f3006080604052600436106101b7576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146101bc578063095ea7b31461024c5780630e969a05146102b157806318160ddd146102e257806323b872dd1461030d5780632583cfef1461039257806326a5a554146103d557806327029357146104185780632d06177a1461045b5780632f0c92d31461049e578063313ce567146104f95780633639e9551461052a5780635c7c08b71461056d578063661884631461059e57806370a0823114610603578063715018a61461065a5780637f4ab1dd1461067157806380e08cd51461071a5780638da5cb5b146107aa57806395d89b4114610801578063a07e400f14610891578063a9059cbb14610921578063ac18de4314610986578063b5888444146109c9578063c56a3e88146109fa578063d4ce141514610a29578063d73dd62314610ab0578063dd62ed3e14610b15578063e00a1e8b14610b8c578063e7984d1714610bcf578063eff1337c14610c5f578063f281e7d114610cba578063f2fde38b14610d15578063f846553414610d58578063fdff9b4d14610d9b575b600080fd5b3480156101c857600080fd5b506101d1610df6565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102115780820151818401526020810190506101f6565b50505050905090810190601f16801561023e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561025857600080fd5b50610297600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610e94565b604051808215151515815260200191505060405180910390f35b3480156102bd57600080fd5b506102c6610f86565b604051808260ff1660ff16815260200191505060405180910390f35b3480156102ee57600080fd5b506102f7610f8b565b6040518082815260200191505060405180910390f35b34801561031957600080fd5b50610378600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610f95565b604051808215151515815260200191505060405180910390f35b34801561039e57600080fd5b506103d3600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061107d565b005b3480156103e157600080fd5b50610416600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061118d565b005b34801561042457600080fd5b50610459600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506112e3565b005b34801561046757600080fd5b5061049c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611439565b005b3480156104aa57600080fd5b506104df600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506114f0565b604051808215151515815260200191505060405180910390f35b34801561050557600080fd5b5061050e611510565b604051808260ff1660ff16815260200191505060405180910390f35b34801561053657600080fd5b5061056b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611523565b005b34801561057957600080fd5b50610582611633565b604051808260ff1660ff16815260200191505060405180910390f35b3480156105aa57600080fd5b506105e9600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611646565b604051808215151515815260200191505060405180910390f35b34801561060f57600080fd5b50610644600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506118d8565b6040518082815260200191505060405180910390f35b34801561066657600080fd5b5061066f611920565b005b34801561067d57600080fd5b5061069f600480360381019080803560ff169060200190929190505050611a25565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156106df5780820151818401526020810190506106c4565b50505050905090810190601f16801561070c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561072657600080fd5b5061072f611ae3565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561076f578082015181840152602081019050610754565b50505050905090810190601f16801561079c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156107b657600080fd5b506107bf611b43565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561080d57600080fd5b50610816611b69565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561085657808201518184015260208101905061083b565b50505050905090810190601f1680156108835780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561089d57600080fd5b506108a6611c07565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156108e65780820151818401526020810190506108cb565b50505050905090810190601f1680156109135780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561092d57600080fd5b5061096c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611c67565b604051808215151515815260200191505060405180910390f35b34801561099257600080fd5b506109c7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611d4d565b005b3480156109d557600080fd5b506109de611e04565b604051808260ff1660ff16815260200191505060405180910390f35b348015610a0657600080fd5b50610a0f611e17565b604051808215151515815260200191505060405180910390f35b348015610a3557600080fd5b50610a94600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611e27565b604051808260ff1660ff16815260200191505060405180910390f35b348015610abc57600080fd5b50610afb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611f0a565b604051808215151515815260200191505060405180910390f35b348015610b2157600080fd5b50610b76600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050612106565b6040518082815260200191505060405180910390f35b348015610b9857600080fd5b50610bcd600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061218d565b005b348015610bdb57600080fd5b50610be46122e3565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610c24578082015181840152602081019050610c09565b50505050905090810190601f168015610c515780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b348015610c6b57600080fd5b50610ca0600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061231c565b604051808215151515815260200191505060405180910390f35b348015610cc657600080fd5b50610cfb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061233c565b604051808215151515815260200191505060405180910390f35b348015610d2157600080fd5b50610d56600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050612392565b005b348015610d6457600080fd5b50610d99600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506123fa565b005b348015610da757600080fd5b50610ddc600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050612550565b604051808215151515815260200191505060405180910390f35b60028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e8c5780601f10610e6157610100808354040283529160200191610e8c565b820191906000526020600020905b815481529060010190602001808311610e6f57829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b600081565b6000600154905090565b60008383836000610fa7848484611e27565b9050600060ff168160ff1614610fbc82611a25565b901515611064576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561102957808201518184015260208101905061100e565b50505050905090810190601f1680156110565780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50611070888888612570565b9450505050509392505050565b6110863361233c565b806110de5750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515611178576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b611181816123fa565b61118a8161118d565b50565b6111963361233c565b806111ee5750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515611288576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b6000600b60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b6112ec3361233c565b806113445750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156113de576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b6001600b60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561149557600080fd5b6001600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b600a6020528060005260406000206000915054906101000a900460ff1681565b600460009054906101000a900460ff1681565b61152c3361233c565b806115845750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561161e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b6116278161218d565b611630816112e3565b50565b600c60009054906101000a900460ff1681565b600080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508083101515611758576000600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506117ec565b61176b838261292b90919063ffffffff16565b600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a3600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561197c57600080fd5b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167ff8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c6482060405160405180910390a26000600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6060600660000160008360ff1660ff1681526020019081526020016000208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611ad75780601f10611aac57610100808354040283529160200191611ad7565b820191906000526020600020905b815481529060010190602001808311611aba57829003601f168201915b50505050509050919050565b606060405190810160405280603081526020017f494c4c4547414c5f5452414e534645525f53454e44494e475f4143434f554e5481526020017f5f4e4f545f57484954454c49535445440000000000000000000000000000000081525081565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611bff5780601f10611bd457610100808354040283529160200191611bff565b820191906000526020600020905b815481529060010190602001808311611be257829003601f168201915b505050505081565b606060405190810160405280603281526020017f494c4c4547414c5f5452414e534645525f524543454956494e475f4143434f5581526020017f4e545f4e4f545f57484954454c4953544544000000000000000000000000000081525081565b60003383836000611c79848484611e27565b9050600060ff168160ff1614611c8e82611a25565b901515611d36576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611cfb578082015181840152602081019050611ce0565b50505050905090810190601f168015611d285780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50611d418787612944565b94505050505092915050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611da957600080fd5b6000600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b600c60019054906101000a900460ff1681565b6000611e223361233c565b905090565b6000600a60008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515611e9357600c60009054906101000a900460ff169050611f03565b600b60008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515611efd57600c60019054906101000a900460ff169050611f02565b600090505b5b9392505050565b6000611f9b82600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054612b6490919063ffffffff16565b600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a36001905092915050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6121963361233c565b806121ee5750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515612288576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b6001600a60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b6040805190810160405280600781526020017f535543434553530000000000000000000000000000000000000000000000000081525081565b600b6020528060005260406000206000915054906101000a900460ff1681565b6000600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156123ee57600080fd5b6123f781612b80565b50565b6124033361233c565b8061245b5750600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156124f5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4f6e6c79206d616e6167657273206f72206f776e657273206d6179207065726681526020017f6f726d207468697320616374696f6e000000000000000000000000000000000081525060400191505060405180910390fd5b6000600a60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b60096020528060005260406000206000915054906101000a900460ff1681565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482111515156125bf57600080fd5b600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561264a57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415151561268657600080fd5b6126d7826000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461292b90919063ffffffff16565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061276a826000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054612b6490919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061283b82600560008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461292b90919063ffffffff16565b600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b600082821115151561293957fe5b818303905092915050565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561299357600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141515156129cf57600080fd5b612a20826000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461292b90919063ffffffff16565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550612ab3826000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054612b6490919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b60008183019050828110151515612b7757fe5b80905092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515612bbc57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff16600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a380600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a72305820bc62f5437cea906df99f0035b4c07f3b14ffdbe4a9dbbebfa1ddb9744d56d0c80029";





if (process.argv[2] == "deployERC1404") {
	  // This will deploy ERC20 token to blockchain 
	  //node EthereumUtils deployERC1404
	
	(async () => {
		
		var web3 = new Web3(new Web3.providers.HttpProvider(linkToBlockchainServer));
			

			  const encodedParameters = web3.eth.abi.encodeParameters(
				[ 'address', 'uint256', 'string'],
				['0x5b31fC93a7a120D467651BF2aD15b0940E0Fcbd5', '100000000000000000000000', 'T1404']
			  ).slice(2);		
		
		
			const convert = (from, to) => str => Buffer.from(str, from).toString(to);
		    const utf8ToHex = convert('utf8', 'hex')
		
			// prepare the transaction:
			var contractName = "Test Contract"
			var rawTx = {
				  from: "0x5b31fC93a7a120D467651BF2aD15b0940E0Fcbd5",
				  data:  utf8ToHex(ERC1404bytecode)  + encodedParameters,
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








