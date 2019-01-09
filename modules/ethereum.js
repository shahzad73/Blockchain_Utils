const Web3 = require('web3');
/*const Accounts = require('web3-eth-accounts');
const Personal = require('web3-eth-personal');
const Eth = require('web3-eth');

const web3 = new Web3( new Web3.providers.HttpProvider('http://127.0.0.1:8545') );
const accounts = new Accounts('ws://127.0.0.1:8545');
const personal = new Personal(Personal.givenProvider || 'ws://127.0.0.1:8545');
const eth = new Eth(Eth.givenProvider || 'ws://127.0.0.1:8545');
*/

module.exports = {
        
    encryptKey: function(key, password) {
        return web3.eth.accounts.encrypt(key, password);
    },

    decryptKey: function(key, password) {
        return web3.eth.accounts.decrypt(key, password);
    },

    getCoinBase: function() {
        eth.getCoinbase().then(console.log);    
    },
    
    getDefaultAccount: function() {
        return eth.defaultAccount;
    },
    
    setDefaultAccount: function(acc) {
        eth.defaultAccount= acc;
    },
    
    getGasPrice: function() {
        
        return new Promise(function(resolve, reject) 
        {	         
            eth.getGasPrice().then(function(data){
                resolve(data);
            });
        }); 
        
        //ethereum.getGasPrice().then(function(data){  console.log(data); })        
    },
    
    getAccountBalance: function(address) {
        
        return new Promise(function(resolve, reject) 
        {	         
            eth.getBalance(address).then(function(data){
                resolve(data);
            });
        }); 
        
        //ethereum.getAccountBalance("0x108e10b96e1ed7a41df6de923480c44b7fcaad28 ").then(function(data){  console.log(data); })        
    },
    
    getTransactionCount: function(address) {
        
        return new Promise(function(resolve, reject) 
        {	         
            eth.getTransactionCount(address).then(function(data){
                resolve(data);
            });
        }); 
        
        //ethereum.getAccountBalance("0x108e10b96e1ed7a41df6de923480c44b7fcaad28 ").then(function(data){  console.log(data); })        
    },

    sendTransaction: function() {
        
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
      "constant": true,
      "inputs": [],
      "name": "INITIAL_SUPPLY",
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
      "inputs": [],
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


        
        
        
        
        
        
        
        
        
        
if (typeof web3 !== 'undefined') {
 web3 = new Web3(web3.currentProvider);
} else {
 // set the provider you want from Web3.providers
 web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

        
if(web3.isConnected()) {
 

					  var contract = web3.eth.contract(abi_contract);
  					  					  
					  var incubator = contract.at("0x62218f2e94ebf205feb3c7118ccaeb3292460eb0");

					  var currentMetaMaskUser = web3.eth.accounts[0];

					  const transactionObject = {
					     from: currentMetaMaskUser,
						 gas: 2000000,
						 gasPrice: 4
					  };
					  
					  incubator.transfer.sendTransaction
					  ( "0x29bae5D98C2CaE477C120790e708c6b91BDF9560", 150, 
					  transactionObject, 
					  (error, result)=> 
					  {
						      console.log("here");
                          
                              incubator.balanceOf.call("0x29bae5D98C2CaE477C120790e708c6b91BDF9560", 
                              transactionObject, 
                              (error, result)=> 
                              {
                                  console.log(result.toString());
                              });

					  });    


  
} else {

  console.log("no");
 
}
        
        
        
        
/*        
                    web3.eth.getTransactionCount("0x35a7eaafeb53b8e7ec86bad797f54a43807b7a5e").then(function(data){
                        console.log(data);    
                    })

        
                    var MyContract = new web3.eth.Contract(abi_contract, '0x0d2c692cac86791c9c7c73f7dfec3ee38c58a7b9', {
                        from: '0x35a7eaafeb53b8e7ec86bad797f54a43807b7a5e', // default from address
                        gasPrice: '30000000000' // default gas price in wei, 20 gwei in this case
                    });
        

                    MyContract.methods.balanceOf("0xaec3349d21aab12289d4600d309c53c19062c12c").call()
                        .then(function(result){
                            console.log(result);
                    });
        
        
                    MyContract.methods.transfer("0xaec3349d21aab12289d4600d309c53c19062c12c", 50).call()
                        .then(function(result){
                            console.log("." + result);
                    });
*/
        
        
        
    }


}


