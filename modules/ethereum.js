const Web3 = require('web3');
const ethereumjs = require('ethereumjs-tx');
const Accounts = require('web3-eth-accounts');
//const Personal = require('web3-eth-personal');
//const Eth = require('web3-eth');

//var web3 = new Web3( new Web3.providers.HttpProvider('http://localhost:8545') );
//const accounts = new Accounts('ws://127.0.0.1:8545');
//const personal = new Personal(Personal.givenProvider || 'ws://127.0.0.1:8545');
//const eth = new Eth(Eth.givenProvider || 'ws://127.0.0.1:8545');


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
        
    getTransactionCount: function(address) {
        
        return new Promise(function(resolve, reject) 
        {	         
            eth.getTransactionCount(address).then(function(data){
                resolve(data);
            });
        }); 
        
        //ethereum.getAccountBalance("0x108e10b96e1ed7a41df6de923480c44b7fcaad28 ").then(function(data){  console.log(data); })        
    },


	
    sendTokens: function(fromAddress, sendAddress, amountToSend, abi, contractAddress, web3Address) {

        return new Promise(function(resolve, reject) {
			
				var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				if(web3.isConnected()) {
					
					  //var acc = Accounts.privateKeyToAccount('0xc0270793c6d211618dbef578aa380e744547e417e21fb295235ee2d4c94cd04e');
					var account = web3.eth.accounts.privateKeyToAccount("0xc0270793c6d211618dbef578aa380e744547e417e21fb295235ee2d4c94cd04e");
					
					  //console.log(acc);
	
					
					  var contract = web3.eth.contract(abi);

					  var incubator = contract.at(contractAddress);				
					
					  const transactionObject = {
						 from: account,
						 gas: 2000000,
						 gasPrice: 4
					  };

					  incubator.transfer.sendTransaction 
					  ( sendAddress, amountToSend, transactionObject, (error, result)=> {
						  	resolve({"code":"1", data: result})
					  }); 


					/*var count = web3.eth.getTransactionCount("0x64aa9045ed3f11af8981458db106bef048a0dc47");
					var count = web3.eth.getTransactionCount(fromAddress);
					var contract = web3.eth.contract(abi).at(contractAddress);
					var rawTransaction = {
						"from": fromAddress,
						"nonce": web3.toHex(count+1),
						"gasPrice": "0x04e3b29200",
						"gasLimit": "0x7458",
						"to": contractAddress,
						"value": "0x0",
						"data": contract.transfer(sendAddress, 10, {from: fromAddress}),
						"chainId": 0x03
					};

					var privKey = new Buffer.from('c0270793c6d211618dbef578aa380e744547e417e21fb295235ee2d4c94cd04e', 'hex');
					var tx = new ethereumjs(rawTransaction);

					tx.sign(privKey);
					var serializedTx = tx.serialize();
					
					
					web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
						if (!err)
							console.log(hash);
						else
							console.log(err);
					});	*/				


				} else {
					resolve({"code":"0", "message":"connection error"})
				}
			
		})
        
    },

    getAccountBalance: function(address, abi, contractAddress, web3Address) {
		
		//node EthereumUtils balance 0xb1e5b680fc802f086b5857bd73b62b79c6dfc235
        return new Promise(function(resolve, reject) {

				var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				if(web3.isConnected()) {

					  var contract = web3.eth.contract(abi);

					  var incubator = contract.at(contractAddress);

					  //web3.eth.defaultAccount= address;
					  //var currentMetaMaskUser = web3.eth.accounts[0];	
					  //console.log(currentMetaMaskUser);									
					  
					  incubator.balanceOf.call(address, {}, 
					  (error, result)=> {
						  resolve({"code":"0", "data": result.toString()});
					  });
					  
				} else {
					resolve({"code":"0", "message":"connection error"})
				}
		});
 
    },
	
	createNewToken: function(abi, contractAddress, web3Address) {
		
        return new Promise(function(resolve, reject) {		
		
				var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				if(web3.isConnected()) {
					
					  var contract = web3.eth.contract(abi);

					  var incubator = contract.at(contractAddress);				
					
					  const transactionObject = {
						 from: "0xb1e5b680fc802f086b5857bd73b62b79c6dfc235",
						 gas: 2000000,
						 gasPrice: 4
					  };

					  incubator.mint.sendTransaction 
					  ( "0xb1e5b680fc802f086b5857bd73b62b79c6dfc235", 10000, transactionObject, (error, result)=> {
						  	resolve({"code":"1", data: result})
					  });

				} else {
					resolve({"code":"0", "message":"connection error"})
				}

		})
	
	
	}
	
	
}




