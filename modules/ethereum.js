const Web3 = require('web3');
const ethereumjs = require('ethereumjs-tx');
var Accounts = require('web3-eth-accounts');
const async = require('async');

//const accounts = new Accounts('ws://127.0.0.1:7545');

// protocol   1=R     2=PolyMath     3=Ravencoin     4=ERC1404
		



module.exports = {

    encryptKey: function(key, password, web3Address) {
        var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
        return web3.eth.accounts.encrypt(key, password);
    },

	
    decryptKey: function(key, password, web3Address) {
        var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
        return web3.eth.accounts.decrypt(key, password);
    },
            
	
    getGas: function(web3Address) {
        
        return new Promise(function(resolve, reject) {
            
            var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
            
            web3.eth.getGasPrice()
            .then((data)=>
                resolve(data)
            );
            
		})
        
    },
	
	
    getAccountEtherBalance: function(address, abi, contractAddress, web3Address) {
		
        return new Promise(function(resolve, reject) {
            var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

            web3.eth.getBalance(address)
            .then((data)=> {
                  console.log(data);
                resolve(data)
            });
		});
 
    },

	
    checkIsInvestorWhitelistedInService: function(address, abi, contractAddress, web3Address, fromAddress) {

        return new Promise(function(resolve, reject) {
            
            var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
            
            var contract = new web3.eth.Contract(abi, contractAddress);

					contract.methods.isInvestorWhiteListed(address).call({from: fromAddress})
					.then ( (data) => { 

						 if(data == true)
							 resolve(true);
						 else 
							 resolve(false);
					});
            
		})
    },    

	
	
	
    whiteListInvestorInService: function(address, abi, contractAddress, web3Address) {

        return new Promise(function(resolve, reject) {
            
            var web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
            
            var contract = new web3.eth.Contract(abi, contractAddress);
            
            var account = web3.eth.accounts.privateKeyToAccount("0x10b74b21fbd76b922c68ab06e9d0c72766a8286220e655623f974239b868cc05");
            
            contract.methods.isInvestorWhiteListed(address).send({from: "0xcF1Ee43b7A7E3D9a4C948acF894F26c118278d94"})
             .on("connected", function(subscriptionId){
                console.log("conected : " + subscriptionId);
             })
             .on('data', function(event){
                console.log("data" + event);
             })
             .on('receipt', function(data){
                 resolve( "receipt" + JSON.stringify(data) );
             })            
             .on('changed', function(event){
                 console.log("changed" + event);
             })
             .on('error', function(error, receipt) { 
                 
             });

		})
        
        
    },

	
    getAccountStoBalance: function(address, abi, contractAddress, web3Address) {
        
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(abi, contractAddress);
					contract.methods.balanceOf(address).call().then((balance) => {
						console.log(balance)
						val = parseFloat(   web3.utils.fromWei(balance.toString(), 'ether') , 10   );
						resolve(val);
					}).catch((err) => {
						reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
					});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountBalance` });
			}
		}));
        
    },

	
	getOwner: function(abi, contractAddress, web3Address) {

		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(abi, contractAddress);
					contract.methods.owner().call().then((owner) => {
						resolve(owner);
					}).catch((err) => {
						reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
					});


				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountBalance` });
			}
		}));
        
    },


	
	whitelisAddress: function(protocol, distributionPublciKey, publicKeyUser, authoeize, ethereumPrivateKey, ethereumContractAddress, ethereumWhitelistAddress, web3Address, whitelistAbi) {

		// authorize = true   add user to whitelist
		// authorize = false  remove user from whitelist


		

		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
                
				web3.eth.net.isListening().then(() => {
					
					const contract = new web3.eth.Contract(whitelistAbi, ethereumWhitelistAddress);
					const privateKey = Buffer.from(ethereumPrivateKey, 'hex');
					const contractAddress = ethereumWhitelistAddress;
					web3.eth.defaultAccount = distributionPublciKey;
					let estimateGasPromise = '';
					
					if (authoeize === 'true') {
                        var tempData = "";

                        if(protocol == 1 || protocol == 4)    
                                tempData = contract.methods.addWhitelistAddress(publicKeyUser).encodeABI();                        
                        else if(protocol == 2)    
                                tempData = contract.methods.modifyKYCData(publicKeyUser, 0, 0, 1893463200).encodeABI();


						estimateGasPromise = web3.eth.estimateGas({
							to: contractAddress,
							data: tempData
						});
					} else {
                        var tempData = "";
                        if(protocol == 1 || protocol == 4)    
                                tempData = contract.methods.removeWhitelistAddress(publicKeyUser).encodeABI();                        
                        else if(protocol == 2)    
                                tempData = contract.methods.modifyKYCData(publicKeyUser, 1893463200, 1893463200, 1893463200).encodeABI();


						estimateGasPromise = web3.eth.estimateGas({
							to: contractAddress,
							data: tempData
						});
					}

					const nouncePromise = web3.eth.getTransactionCount(distributionPublciKey, 'pending');

					const allPromises = Promise.all([estimateGasPromise, nouncePromise]);



					allPromises.then((results) => {
						// creating raw tranaction
						console.log(results)
						
						const rawTransaction = {
							from: distributionPublciKey,
							gasPrice: web3.utils.toHex(results[0] + 100000000000),
							gasLimit: web3.utils.toHex(results[0] + 1000000),
							to: contractAddress,
							value: '0x0',
							nonce: web3.utils.toHex(results[1]),
						};

						if (authoeize === 'true') { 
                            var tempData2 = "";
                            if(protocol == 1 || protocol == 4)       
                                    tempData2 = contract.methods.addWhitelistAddress(publicKeyUser).encodeABI();                      
                            else if(protocol == 2)    
                                    tempData2 = contract.methods.modifyKYCData(publicKeyUser, 0, 0, 1893463200).encodeABI();

                            rawTransaction.data = tempData2; 
                        } else { 
                            if(protocol == 1 || protocol == 4)    
                                    tempData2 = contract.methods.removeWhitelistAddress(publicKeyUser).encodeABI();
                            else if(protocol == 2)    
                                    tempData2 = contract.methods.modifyKYCData(publicKeyUser, 1893463200, 1893463200, 1893463200).encodeABI();

                            rawTransaction.data = tempData2;                             
                        }


						// creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);
                        
						// signing transaction with private key
						transaction.sign(privateKey);
                        
						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log(`whitelisAddress transaction  address-${publicKeyUser}  authorize-${authoeize} Sending transaction`);

						web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {
                            
							if (err) {
								console.log(err)
								reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in whitelisAddress` });
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`whitelisAddress - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
											return;
										}
										console.log(`whitelisAddress transaction completed with txId-${txId}`);
										resolve('ok');
									},
								);
							}
						});

					}).catch((err) => {
				        reject({ code: '0', message: `${err.message}. Error in one of the Promises in allPromises in whitelisAddress` });
					});
				})
				.catch((err) => {
				    reject({ code: '0', message: `${err.message}.  Ethereum network connection error in whitelisAddress` });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in whitelisAddress` });
			}
		}));
	},

	
	sendTokens: function(myAddress, toAddress, amountToSend, ethereumPrivateKey, ethereumContractAddress, ethereumWhitelistAddress, web3Address, contractabi) {
        
        return new Promise(((resolve, reject) => {
            
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
                
				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(contractabi, ethereumContractAddress);
					const privateKey = Buffer.from(ethereumPrivateKey, 'hex');                    
                    const amount = web3.utils.toHex(amountToSend);
					const contractAddress = ethereumContractAddress;
                    
					web3.eth.defaultAccount = myAddress;
                    
					let estimateGasPromise = '';

                    estimateGasPromise = web3.eth.estimateGas({
                        to: ethereumContractAddress,
                        data: contract.methods.transfer(toAddress, amount).encodeABI(),
                    });

					const nouncePromise = web3.eth.getTransactionCount(myAddress, 'pending');

					const allPromises = Promise.all([nouncePromise, estimateGasPromise]);
                    
					allPromises.then((results) => {

						// creating raw tranaction
						const rawTransaction = {
							from: myAddress,
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: 93399 + 1000000,
							to: ethereumContractAddress,
							value: 0x0,
                            data: contract.methods.transfer(toAddress, amount).encodeABI(),
							nonce: web3.utils.toHex(results[0]),
						};


						// creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);

						// signing transaction with private key
						transaction.sign(privateKey);

						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log( `Sending transaction`);

						web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {

							if (err) {
								reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in whitelisAddress` });
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`sendTokens - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
											return;
										}
										console.log(`sendTokens transaction completed with txId-${txId}`);
										resolve('ok');
									},
								);
							}
						});

					}).catch((err) => {
                        console.log( err.toString() );
				        reject({ code: '0', message: `${err.message}. Error in one of the Promises in allPromises in sendTokens` });
					});
				})
				.catch((err) => {
				    reject({ code: '0', message: `${err.message}.  Ethereum network connection error in sendTokens` });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in sendTokens` });
			}
		}));

	},

    
	approve: function(myAddress, toAddress, amountToSend, ethereumPrivateKey, ethereumContractAddress, ethereumWhitelistAddress, web3Address, contractabi) {
        
        return new Promise(((resolve, reject) => {
            
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
                
				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(contractabi, ethereumContractAddress);
					const privateKey = Buffer.from(ethereumPrivateKey, 'hex');                    
                    const amount = web3.utils.toHex(amountToSend);
					const contractAddress = ethereumContractAddress;
                    
					web3.eth.defaultAccount = myAddress;
                    
					let estimateGasPromise = '';

                    estimateGasPromise = web3.eth.estimateGas({
                        to: ethereumContractAddress,
                        data: contract.methods.approve(toAddress, amount).encodeABI(),
                    });

					const nouncePromise = web3.eth.getTransactionCount(myAddress, 'pending');

					const allPromises = Promise.all([nouncePromise, estimateGasPromise]);
                    
					allPromises.then((results) => {

						// creating raw tranaction
						const rawTransaction = {
							from: myAddress,
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: 93399 + 1000000,
							to: ethereumContractAddress,
							value: 0x0,
                            data: contract.methods.approve(toAddress, amount).encodeABI(),
							nonce: web3.utils.toHex(results[0]),
						};


						// creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);

						// signing transaction with private key
						transaction.sign(privateKey);

						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log( `Sending transaction`);

						web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {

							if (err) {
								reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in whitelisAddress` });
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`sendTokens - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
											return;
										}
										console.log(`sendTokens transaction completed with txId-${txId}`);
										resolve('ok');
									},
								);
							}
						});

					}).catch((err) => {
                        console.log( err.toString() );
				        reject({ code: '0', message: `${err.message}. Error in one of the Promises in allPromises in sendTokens` });
					});
				})
				.catch((err) => {
				    reject({ code: '0', message: `${err.message}.  Ethereum network connection error in sendTokens` });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in sendTokens` });
			}
		}));

	},

	
    getAccountAllowance: function(fromaddress, toaddress, abi, contractAddress, web3Address) {
        
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(abi, contractAddress);

					contract.methods.allowance(fromaddress, toaddress).call().then((balance) => {
						resolve(balance.toString());
					}).catch((err) => {
						reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountAllowance` });
					});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountAllowance' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountAllowance` });
			}
		}));
        
    },

	
    forceTransfer: function(fromAddress, toAddress, amountToSend, ethereumPrivateKey, ethereumContractAddress, ethereumWhitelistAddress, web3Address, contractabi) {
        
        return new Promise(((resolve, reject) => {
            
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
                
				web3.eth.net.isListening().then(() => {
                    
					const contract = new web3.eth.Contract(contractabi, ethereumContractAddress);
					const privateKey = Buffer.from(ethereumPrivateKey, 'hex');
                    const amount = web3.utils.toHex(amountToSend);
					const contractAddress = ethereumContractAddress;
					web3.eth.defaultAccount = toAddress;
                    
					let estimateGasPromise = '';
                    
                    estimateGasPromise = web3.eth.estimateGas({
                        to: ethereumContractAddress,
                        data: contract.methods.forceTransfer(fromAddress, toAddress, amount).encodeABI(),
                    });

					const nouncePromise = web3.eth.getTransactionCount(toAddress, 'pending');

					const allPromises = Promise.all([estimateGasPromise, nouncePromise]);

					allPromises.then((results) => {
						// creating raw tranaction
                        
						const rawTransaction = {
							from: toAddress,
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: web3.utils.toHex(results[0] + 1000000),
							to: ethereumContractAddress,
							value: '0x0',
                            data: contract.methods.forceTransfer(fromAddress, toAddress, amount).encodeABI(),
							nonce: web3.utils.toHex(results[1]),
						};
                       
						// creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);

						// signing transaction with private key
						transaction.sign(privateKey);

						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log( `Sending force transaction`);

						web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {
                            
							if (err) {
								reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in forceTransfer` });
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`forceTransfer - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
											return;
										}
										console.log(`forceTransfer transaction completed with txId-${txId}`);
										resolve('ok');
									},
								);
							}
						});
					}).catch((err) => {
				        reject({ code: '0', message: `${err.message}. Error in one of the Promises in allPromises in forceTransfer` });
					});
				})
				.catch((err) => {
				    reject({ code: '0', message: `${err.message}.  Ethereum network connection error in forceTransfer` });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in forceTransfer` });
			}
		}));                
        
    },

	
	tokenCreateBurn: function(operation, protocolType, myAddress, amountToSend, ethereumPrivateKey, ethereumContractAddress, web3Address, contractabi) {

       return new Promise(((resolve, reject) => {
    
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
                
				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(contractabi, ethereumContractAddress);
					const privateKey = Buffer.from(ethereumPrivateKey, 'hex');
                    const amount = web3.utils.toHex(amountToSend);
					const contractAddress = ethereumContractAddress;
					web3.eth.defaultAccount = myAddress;

					console.log( amount )
                    var tempData = "";
                    if(protocolType == 1 || protocolType == 4) {
                            //R Token
                            if(operation == 1)                        
                                    tempData = contract.methods.mint(myAddress, amount).encodeABI();
                            else if(operation == 2)                                       
                                    tempData = contract.methods.burn(amount).encodeABI();                                    

                    } else if (protocolType == 2) {
                            //PolyMath
                            if(operation == 1)
                                    tempData = contract.methods.issue( myAddress, amount, Buffer.from([0]) ).encodeABI();
                            else if(operation == 2)                           
                                    tempData = contract.methods.redeemFrom( myAddress, amount, Buffer.from([0]) ).encodeABI();
                    }


					
                    let estimateGasPromise = web3.eth.estimateGas({
                        to: ethereumContractAddress,
                        data: tempData
                    });
                    

                    const nouncePromise = web3.eth.getTransactionCount(myAddress, 'pending');

                    //const allPromises = Promise.all([estimateGasPromise, nouncePromise]);
                    const allPromises = Promise.all([nouncePromise]);
                    
					allPromises.then((results) => {
                            // creating raw tranaction               
							console.log(results);
                            const rawTransaction = {
                                    from: myAddress,
                                    gasPrice: web3.utils.toHex(120 * 1e9),
                                    //gasLimit: web3.utils.toHex(results[0] + 1000000),
                                    gasLimit: web3.utils.toHex(1000000),                                
                                    to: ethereumContractAddress,
                                    value: 0x0,
                                    //nonce: web3.utils.toHex(results[1]),
                                    nonce: web3.utils.toHex(results[0]),                                
                                    data: tempData
                            };

                            // creating tranaction via ethereumjs-tx
                            const transaction = new ethereumjs(rawTransaction);

                            // signing transaction with private key
                            transaction.sign(privateKey);

                            // sending transacton via web3 module
                            const serializedTx = transaction.serialize();

                            console.log( `Sending transaction to mint tokens`);

                            web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {

                                if (err) {
                                    reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in mint tokens` });
                                } else {
                                    async.retry(
                                        { times: 5, interval: 1000 },
                                        (callbackRetry) => {
                                            web3.eth.getTransactionReceipt(txId).then((data) => {
                                                if (data == null) {
                                                    callbackRetry('error', 0);
                                                } else {
                                                    callbackRetry(null, 1);
                                                }
                                            });
                                        }, (err2, result) => {
                                            if (err2 != null) {
                                                console.log(`mint tokens - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
                                                reject(err2);
                                            } else {
                                                console.log(`mint tokens transaction completed with txId-${txId}`);
                                                resolve('ok');
                                            }
                                        },
                                    );
                                }
                            });

					}).catch((err) => {
				        reject({ code: '0', message: `${err.message}. Error in one of the Promises in allPromises in 1 tokenCreateBurn` });
					});

				}).catch((err) => {
				    reject({ code: '0', message: `${err.message}.  Ethereum network connection error in 2 tokenCreateBurn` });
				});

			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in 3 tokenCreateBurn` });
			}
		}));
	
	},

	
	burnToken: function(protocolType, myAddress, amountToSend, ethereumPrivateKey, ethereumContractAddress, web3Address, contractabi) {
                    
       return new Promise(((resolve, reject) => {
    
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				web3.eth.net.isListening().then(() => {
                    
					const contract = new web3.eth.Contract(contractabi, ethereumContractAddress);
					const privateKey = Buffer.from(ethereumPrivateKey, 'hex');
                    const amount = web3.utils.toHex(amountToSend);
					const contractAddress = ethereumContractAddress;
                    
					web3.eth.defaultAccount = myAddress;
                    
					let estimateGasPromise = '';
                    
                    var tempData = "";
                    if(protocolType == 1)
                            tempData = contract.methods.burn(amount).encodeABI();
                    else if (protocolType == 2) {
                            tempData = contract.methods.redeemFrom( amount, Buffer.from([0]) ).encodeABI();
                    }
                    
                    estimateGasPromise = web3.eth.estimateGas({
                        to: ethereumContractAddress,
                        data: tempData
                    });

					const nouncePromise = web3.eth.getTransactionCount(myAddress, 'pending');
                    
					const allPromises = Promise.all([estimateGasPromise, nouncePromise]);

					allPromises.then((results) => {
						// creating raw tranaction
                        console.log(results);

						const rawTransaction = {
							from: myAddress,
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: web3.utils.toHex(results[0] + 1000000),
							to: ethereumContractAddress,
							value: 0x0,
                            data: tempData,
							nonce: web3.utils.toHex(results[1]),
						};


						// creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);

						// signing transaction with private key
						transaction.sign(privateKey);

						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log( `Sending transaction to burn tokens`);

						/*web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {
                            
							if (err) {
								reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in burn tokens` });
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`burn tokens - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
											return;
										}
										console.log(`burn tokens transaction completed with txId-${txId}`);
										resolve('ok');
									},
								);
							}
						});*/
					}).catch((err) => {
				        reject({ code: '0', message: `${err.message}. Error in one of the Promises in allPromises in burn` });
					});
				})
				.catch((err) => {
				    reject({ code: '0', message: `${err.message}.  Ethereum network connection error in burn` });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in burn` });
			}
		}));
	
	},

	
    sendTransactionToEthereumNetwork: function(web3Address, contract, ethereumContractAddress, ethereumPrivateKey, fromAddress, functionDataABI, logTransactionName) {
        
        return new Promise((resolve, reject) => {
    
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				web3.eth.net.isListening().then(() => {
                    
					const privateKey = Buffer.from(ethereumPrivateKey, 'hex');
					web3.eth.defaultAccount = fromAddress;
                    
					let estimateGasPromise = "";

                    estimateGasPromise = web3.eth.estimateGas({
                        to: ethereumContractAddress,
                        data: functionDataABI,
                    });

					const nouncePromise = web3.eth.getTransactionCount(fromAddress, 'pending');

					const allPromises = Promise.all([estimateGasPromise, nouncePromise]);

					allPromises.then((results) => {
						// creating raw tranaction
                        
                        console.log(results);
                        
						const rawTransaction = {
							from: fromAddress,
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: web3.utils.toHex(results[0] + 1000000),
							to: ethereumContractAddress,
							value: '0x0',
                            data: functionDataABI,
							nonce: web3.utils.toHex(results[1]),
						};


						// creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);

						// signing transaction with private key
						transaction.sign(privateKey);

						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log( `${logTransactionName} - Sending transaction`);

						web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {
                            
							if (err) {
								reject( err.message );
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`${logTransactionName} - Some error occured and execution cannot be confirmed ${err2.toString()}`);
											reject( err.message );
										}
										console.log(`${logTransactionName} - Transaction completed with txId-${txId}`);
										resolve('ok');
									},
								);
							}
						});

					}).catch((err) => {
				        reject( err.message );
					});
				})
				.catch((err) => {
				    reject( err.message );
				});
			} catch (err) {
				reject( err.message );
			}
		});
        
    },
    
	
    getTotalSupplyOfTokens: function(abi, contractAddress, web3Address) {
        
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(abi, contractAddress);

					contract.methods.totalSupply().call().then((balance) => {
						resolve(balance.toString());
					}).catch((err) => {
						reject({ code: '0', message: `${err.message}. Error calling getTotalSupplyOfTokens` });
					});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getTotalSupplyOfTokens' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getTotalSupplyOfTokens` });
			}
		}));
        
    },

	
	

	
	
	// ---------------------------------------------------
	//PolyMath ERC1400 specific  info contract 
	// ---------------------------------------------------	
	
	getWhitelistAddress( address, contractInfoABI, web3Address) {
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(contractInfoABI, address);
						
								//bytes32("GeneralTransferManager")					
								contract.methods.getModulesByName(  web3.utils.asciiToHex("GeneralTransferManager")   ).call().then((balance) => {
									resolve(balance);
								}).catch((err) => {
									reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
								});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance11' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountBalance` });
			}
		}));
	},
	
	getInvestorCount(address, contractInfoABI, web3Address)  {
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(contractInfoABI, address);
						
								//bytes32("GeneralTransferManager")					
								contract.methods.getInvestorCount().call().then((count) => {
									resolve(count);
								}).catch((err) => {
									reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
								});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance11' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountBalance` });
			}
		}));
	},	
	
	getInvestors(address, contractInfoABI, web3Address)  {
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(contractInfoABI, address);
						
								//bytes32("GeneralTransferManager")					
								contract.methods.getInvestors().call().then((count) => {
									resolve(count);
								}).catch((err) => {
									reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
								});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance11' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountBalance` });
			}
		}));
	},		
	
	getCheckpointTimes(address, contractInfoABI, web3Address)  {
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(contractInfoABI, address);
						
								//bytes32("GeneralTransferManager")					
								contract.methods.getCheckpointTimes().call().then((count) => {
									resolve(count);
								}).catch((err) => {
									reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
								});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance11' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountBalance` });
			}
		}));
	},		

    getKYCData: function(address, abi, contractAddress, web3Address) {
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(abi, contractAddress);

						contract.methods.getKYCData([address]).call().then((status) => {
							resolve(status);
						}).catch((err) => {
							reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
						});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance11' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountBalance` });
			}
		}));
        
    },

    getAllKYCData: function(abi, contractAddress, web3Address) {
		return new Promise(((resolve, reject) => {
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

				web3.eth.net.isListening().then(() => {
					const contract = new web3.eth.Contract(abi, contractAddress);

						contract.methods.getAllKYCData().call().then((status) => {
							resolve(status);
						}).catch((err) => {
							reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
						});

				}).catch(() => {
					reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance11' });
				});
			} catch (err) {
				reject({ code: '0', message: `${err.message}. Error occured in getAccountBalance` });
			}
		}));
        
		
		/*

		Result {
		  '0': [
			'0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9',
			'0xcD063145Fcd75aca7C2c3CaD2675B4328dbd8f83',
			'0xa73CF314dF3bA384235181495065d25343E7956F',
			'0xB520234B0530a4EE5737Fca29636B840AfB6EbD2',
			'0xF735763f57b62a388E371A394FE610fD258C6Bf7',
			'0xDD569e104B88c1ede857CcC41fd5639073448D58',
			'0x5b31fC93a7a120D467651BF2aD15b0940E0Fcbd5',
			'0xDB0d238BAeF0bDE591841a66eC886f3dC7A8De48',
			'0x0CfEc6Ad847fa8DEdbf165E488F332BE0411afB8'
		  ],
		  '1': [
			'1262304000', '1262304000',
			'1262304000', '0',
			'1262304000', '1262304000',
			'0',          '0',
			'0'
		  ],
		  '2': [
			'1262304000', '1262304000',
			'1262304000', '0',
			'1262304000', '1262304000',
			'0',          '0',
			'0'
		  ],
		  '3': [
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200'
		  ],
		  investors: [
			'0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9',
			'0xcD063145Fcd75aca7C2c3CaD2675B4328dbd8f83',
			'0xa73CF314dF3bA384235181495065d25343E7956F',
			'0xB520234B0530a4EE5737Fca29636B840AfB6EbD2',
			'0xF735763f57b62a388E371A394FE610fD258C6Bf7',
			'0xDD569e104B88c1ede857CcC41fd5639073448D58',
			'0x5b31fC93a7a120D467651BF2aD15b0940E0Fcbd5',
			'0xDB0d238BAeF0bDE591841a66eC886f3dC7A8De48',
			'0x0CfEc6Ad847fa8DEdbf165E488F332BE0411afB8'
		  ],
		  canSendAfters: [
			'1262304000', '1262304000',
			'1262304000', '0',
			'1262304000', '1262304000',
			'0',          '0',
			'0'
		  ],
		  canReceiveAfters: [
			'1262304000', '1262304000',
			'1262304000', '0',
			'1262304000', '1262304000',
			'0',          '0',
			'0'
		  ],
		  expiryTimes: [
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200',
			'1893463200'
		  ]
		}



*/
		
		
		
    },
	
	
		
	
	
    test: function() {
        return new Promise(((resolve, reject) => {
            
            
            
            
            
            
        }));
    }
};




