var StellarSdk = require('stellar-sdk');
var async = require('async');
var mysql = require("./mysql");
var request = require('request');


module.exports = {

	  sendPayments: function(distributionSourcePrivateKey, assetIssuerPublicKey, destinationPublicKey, assetCode, amountToSend) {
		  return new Promise(function(resolve, reject) 
		  {
			    StellarSdk.Network.useTestNetwork();
				
				var sourceKeys = StellarSdk.Keypair.fromSecret(distributionSourcePrivateKey);
				
				var assetToSet = "";
				if(assetCode == "")
					assetToSet = StellarSdk.Asset.native();
				else
					assetToSet = new StellarSdk.Asset(assetCode, assetIssuerPublicKey);
				
				var server = new StellarSdk.Server(process.env.Stellar_Server);
                
				var transaction;
				// First, check to make sure that the destination account exists.
				// You could skip this, but if the account does not exist, you will be charged
				// the transaction fee when the transaction fails.
				server.loadAccount(destinationPublicKey)
				  .catch(StellarSdk.NotFoundError, function (error) {
						reject(error);
				  })
				  .then(function() {
					   return server.loadAccount(sourceKeys.publicKey());
				  })
				  .then(function(sourceAccount) {

                    
					transaction = new StellarSdk.TransactionBuilder(sourceAccount)
					  .addOperation(StellarSdk.Operation.payment({ 
					       destination: destinationPublicKey,
						   asset: assetToSet,
						   amount: amountToSend
					  }))
					  .addMemo(StellarSdk.Memo.text('Test Transaction'))
					  .build();
					  
					  transaction.sign(sourceKeys);

					  return server.submitTransaction(transaction);
				  })
				  .then(function(result) {
					   resolve("Success");
				  })
				  .catch(function(error) {    
					   reject(error);
				  }); 
		  });
	  }, 
	  CheckTrustLine: function(issuingAccountPublicKey, receiverAccountPublicKey, assetCode) {

		  return new Promise(function(resolve, reject) 
		  {			  
				
				StellarSdk.Network.useTestNetwork();
				var server = new StellarSdk.Server(process.env.Stellar_Server);			

				server.accounts()
					  .accountId(receiverAccountPublicKey)
					  .call()
					  .then(account => account.balances.filter(balanceRecord => balanceRecord.asset_code === assetCode && 
							balanceRecord.asset_issuer === issuingAccountPublicKey)[0])
					  .then(balanceRecord => 
						{
						if (!balanceRecord) 
							return reject('Trustline does not exist.')
						 resolve(balanceRecord);
						})
						.catch(err => console.error(err))

						
					/*
					Following trustline information will be returned
					
					{ 	  balance: '0.0000000',
						  limit: '922337203685.4775807',
						  buying_liabilities: '0.0000000',
						  selling_liabilities: '0.0000000',
						  asset_type: 'credit_alphanum12',
						  asset_code: 'Security1',
						  asset_issuer: 'GDPCNNHAKEYYBPGIQWGZTNRNI5AUA7PYZK6LU2HO2UX3SAL5MD3HJIIE' 
					 }
					*/						
						
		  });
		  
	  },

    
      //Need issuing account private keys 
	  AuthrorizeTrustLine: function(issuingAccountSecretKey, receiverAccountPublicKey, assetCode, boolFlag) {
		  return new Promise(function(resolve, reject) 
		  {			  
				StellarSdk.Network.useTestNetwork();
				var server = new StellarSdk.Server(process.env.Stellar_Server);	

				var issuingAccountKeys = StellarSdk.Keypair.fromSecret(issuingAccountSecretKey);

				server.loadAccount(receiverAccountPublicKey) 
				  .catch(StellarSdk.NotFoundError, function (error) {
						reject(error);
				  })
				  .then(function() {
					   return server.loadAccount(issuingAccountKeys.publicKey());
				  })
				  .then(function(assetAccount) 
				  {				
						StellarSdk.Network.useTestNetwork();
						var server = new StellarSdk.Server(process.env.Stellar_Server);			
                              
                              var flagtmp = false;
                              if(boolFlag == "true")
                                  flagtmp = true;
                    
							  transaction = new StellarSdk.TransactionBuilder(assetAccount)
							  .addOperation(StellarSdk.Operation.allowTrust({ 
								   trustor: receiverAccountPublicKey,
								   assetCode: assetCode,
							       authorize: flagtmp
							  }))
							  .build();

							  transaction.sign(issuingAccountKeys);

							  return server.submitTransaction(transaction);
 
				  })
				  .then(function() {
                        
						resolve("Success");
				  })
				  .catch(function(error) {
							reject(error);
				  });				  
		  })
	  },
      ChangeThreshholdValuesOfAccount: function (secretKey, low, medium, high) {
          
      },
    
      
      //these function need only public keys of any account
      watchPayments: function(publicKey, asset) {
          
		  return new Promise(function(resolve, reject) 
		  {	          
                StellarSdk.Network.useTestNetwork();

                var server = new StellarSdk.Server(process.env.Stellar_Server);

                var payments = server.payments().forAccount(publicKey);

                server.payments()
                  .forAccount(publicKey)
                  .call()
                  .then(function (accountResult) {

                        var result = [];

                        for(var i = 0; i < accountResult.records.length; i++) {
                            var obj = accountResult.records[i];

                            if(obj.asset_code == asset) {
                                var op = ""
                                var add = "";
                                
                                if(obj.from == publicKey) {
                                    op = "Send";
                                    address = obj.to;
                                } else {
                                    op = "Receive";
                                    address = obj.from;                                    
                                }

                                var date = new Date(obj.created_at);
                                
                                result.push({
                                    "op": op,
                                    "date": (date.getMonth() + 1) + ' / ' + date.getDate() + ' / ' +  date.getFullYear(),
                                    "amount":  parseInt(obj.amount),
                                    "address": address
                                });
                            }
                        }
                    
                        resolve(result);
                  })
                  .catch(function (err) {
                      reject(err);
                  })
          });
          		  
	  },
	  getAccountInformation: function(publicKey, dataToReturn) {
		  
		  return new Promise(function(resolve, reject) 
		  {	  
			  StellarSdk.Network.useTestNetwork();
			  var server = new StellarSdk.Server(process.env.Stellar_Server);
				
			  server.loadAccount(publicKey).then(function(account){
				  
				  if(dataToReturn == "balances")
				  {
					  resolve(account.balances);
					  /*
							Following trustline information will be returned
							{ 	  balance: '0.0000000',
								  limit: '922337203685.4775807',
								  buying_liabilities: '0.0000000',
								  selling_liabilities: '0.0000000',
								  asset_type: 'credit_alphanum12',
								  asset_code: 'Security1',
								  asset_issuer: 'GDPCNNHAKEYYBPGIQWGZTNRNI5AUA7PYZK6LU2HO2UX3SAL5MD3HJIIE' 
							 }
					  */
				  }
				  else if (dataToReturn == "flags")
				  {
				      resolve(account.flags);
					  /* 
							 This will return following information
							 {    auth_required: false,    // With this setting, an anchor must approve anyone who wants to hold its asset.
								  auth_revocable: false,   // With this setting, an anchor can set the authorize flag of an existing trustline to freeze the assets held by an asset holder.
								  auth_immutable: false    // With this setting, none of the above authorization flags can be changed.
							 }
					  */
				  }
			  }).catch(function (err) {
				  reject(err);
			  });
		  });
	  },

    
    
      //These function used once to set the security token in blockchain
	  restrictAssetTrustLines :function(assetPrivateKey) {

		  return new Promise(function(resolve, reject) 
		  {		  
				StellarSdk.Network.useTestNetwork();

				var server = new StellarSdk.Server(process.env.Stellar_Server);			

				var issuingKeys = StellarSdk.Keypair.fromSecret(assetPrivateKey);

				server.loadAccount(issuingKeys.publicKey())
				.then(function(sourceAccount) 
				{		
					var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
					  .addOperation(StellarSdk.Operation.setOptions({
							setFlags: StellarSdk.AuthRevocableFlag | StellarSdk.AuthRequiredFlag
					  }))
					  .build();

					transaction.sign(issuingKeys);
					
					server.submitTransaction(transaction);
				})
				.then(function() {
					resolve("Success");
				})
				.catch(function(error) {
					reject(error);
				});
		  });

	  },    
    
      // The function not being used in the application
	  createTestAccount: async function(publicKey) {

			 return new Promise(function(resolve, reject) 
			 {
				var pubKey = "";
				if(publicKey == "")
				{
					var pair = StellarSdk.Keypair.random();  //				// create a completely new and unique pair of keys
					pubKey = pair.publicKey()
				}
				else
					pubKey = publicKey;
				  
				var params = {
				  url: 'https://friendbot.stellar.org',
				  qs: { addr: pubKey },
				  json: true
				};

				request.get(params, function(error, response, body) {
				  if (error || response.statusCode !== 200) {
					   reject(Error("Some Error Occured:" + error))
				  }
				  else {
					  if(publicKey == "")
						  resolve( { "secretKey":pair.secret(), "publicKey":pair.publicKey() } );
					  else
						  resolve("success");
				  }
				});
			 });
	  },
	  createTrustLine :function(assetCode, assetPublicKey, receiverPrivateKey) {
		  return new Promise(function(resolve, reject) 
		  {
			    
				StellarSdk.Network.useTestNetwork();
				var server = new StellarSdk.Server(process.env.Stellar_Server);
				
				var receivingKeys = StellarSdk.Keypair.fromSecret(receiverPrivateKey);				
				
				var assetToTrust = new StellarSdk.Asset(assetCode, assetPublicKey);

				
				server.loadAccount(receivingKeys.publicKey()).then(
				  function(receiver){
						  var transaction = new StellarSdk.TransactionBuilder(receiver)
						  // The `changeTrust` operation creates (or alters) a trustline
						  .addOperation(StellarSdk.Operation.changeTrust({
							asset: assetToTrust
						  }))
						  .build();
						
						  transaction.sign(receivingKeys);
						  
						  return server.submitTransaction(transaction);
				  })
				  .then(function() {
						 resolve("Success");
				  })
				  .catch(function(error) {
						reject(error);
				  });
		  });
	  },	  
	  manageStellarOffer: function(sellingAsset, buyingAsset, privateKey) {
		  return new Promise(function(resolve, reject) 
		  {			  
				StellarSdk.Network.useTestNetwork();
				var server = new StellarSdk.Server(process.env.Stellar_Server);	

				var assetAccountKeys = StellarSdk.Keypair.fromSecret(privateKey);

				server.loadAccount(assetAccountKeys.publicKey())
				  .then(function(account) {
						var transaction = new StellarSdk.TransactionBuilder(account)
						.addOperation(
								StellarSdk.Operation.manageOffer({
									selling: sellingAsset,
									buying: buyingAsset,
									amount: '10',
									price: '50'
								})
						)
						.build();

						transaction.sign(assetAccountKeys);

						server.submitTransaction(transaction)
						  .then(function(transactionResult) {
								console.log(JSON.stringify(transactionResult, null, 2));
								console.log(transactionResult._links.transaction.href);
								resolve(transactionResult)
						  })
						  .catch(function(err) {
								resolve(err);
						  });
				})
				.catch(function(e) {
						console.error(e);
				});

		  });
	  },

};


  /*
        multi sig  issuing account 
           set threshholds of the accounts
           delete a account from multisig
           add another account as issuing account
           sign and save a partial transaction    then other account sign it and submit the tranaction '
           
           
           
                
  
  */
  
  
  
  
  
  
  
  
  
  
/*
  
  
partially siging a transaction
var StellarSdk = require('stellar-sdk')
StellarSdk.Network.useTestNetwork();

// Create transaction with first signer
let keypair0 = StellarSdk.Keypair.random();
let account = new StellarSdk.Account(keypair0.publicKey(), '1234');

let tx = new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.payment({
      destination: 'GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA',
      asset: StellarSdk.Asset.native(),
      amount: '100',
    }))
    .build();

tx.sign(keypair0);

let encodedEnvelope = tx.toEnvelope().toXDR('base64');

// Store encodedEnvelope somewhere.

let tx2 = new StellarSdk.Transaction(encodedEnvelope);
let keypair1 = StellarSdk.Keypair.random();
tx2.sign(keypair1)

console.log(tx2.toEnvelope().toXDR('base64'))  
  
  
  
  
  
  
  
StellarSdk.Network.useTestNetwork();
var rootKeypair = StellarSdk.Keypair.fromSecret("SBQWY3DNPFWGSZTFNV4WQZLBOJ2GQYLTMJSWK3TTMVQXEY3INFXGO52X")
var account = new StellarSdk.Account(rootkeypair.publicKey(), "46316927324160");

var secondaryAddress = "GC6HHHS7SH7KNUAOBKVGT2QZIQLRB5UA7QAGLA3IROWPH4TN65UKNJPK";

var transaction = new StellarSdk.TransactionBuilder(account)
  .addOperation(StellarSdk.Operation.setOptions({
    signer: {
      ed25519PublicKey: secondaryAddress,
      weight: 1
    }
  }))
  .addOperation(StellarSdk.Operation.setOptions({
    masterWeight: 1, // set master key weight
    lowThreshold: 1,
    medThreshold: 2, // a payment is medium threshold
    highThreshold: 2 // make sure to have enough weight to add up to the high threshold!
  }))
  .build();

transaction.sign(rootKeypair); // only need to sign with the root signer as the 2nd signer won't be added to the account till after this transaction completes

// now create a payment with the account that has two signers

var transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.payment({
        destination: "GBTVUCDT5CNSXIHJTDHYSZG3YJFXBAJ6FM4CKS5GKSAWJOLZW6XX7NVC",
        asset: StellarSdk.Asset.native(),
        amount: "2000" // 2000 XLM
    }))
    .build();

var secondKeypair = StellarSdk.Keypair.fromSecret("SAMZUAAPLRUH62HH3XE7NVD6ZSMTWPWGM6DS4X47HLVRHEBKP4U2H5E7");

// now we need to sign the transaction with both the root and the secondaryAddress
transaction.sign(rootKeypair);
transaction.sign(secondKeypair);



  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

   .then(function(account){

              // new transaction builder (convenience constructor grabs tx sequence number from account object)
              let builder = new StellarSdk.TransactionBuilder(account);
              console.log("builder is " + builder);
  
              // add an operation. You can add upto 100 operations in one transaction,
              // that could be 100 payments to 100 different accounts, etc...
              // OPERATION 1: add a payment operation to the transaction for native XLM to activate the random keypair account
              builder.addOperation(
                  StellarSdk.Operation.payment({
                      destination: publicKey, // destination account address
                      asset: StellarSdk.Asset.native(), // native is XLM
                      amount: '5' // transaction amount as string, 5 XLM should be enough
                  })
              )
  
              //OPERATION 2: add a trustline to the transaction, to trust Test asset.
              builder.addOperation(
                  StellarSdk.Operation.changeTrust({
                      asset: getAsset('Test'), // see helper function above
                      source: "G..." //issuer Account of the asset.
                  })
              )
  
              // OPERATION 3: add a payment operation to the transaction for Test Asset
              builder.addOperation(
                  StellarSdk.Operation.payment({
                      destination: publicKey, // destination account address
                      asset: getAsset('Test'), // see helper function above
                      amount: '100' // transaction amount as string
                  })
              )
  
  
              // create the transaction XDR
              let transaction = builder.build();
  
              // sign the XDR
              transaction.sign(keypair);
              
              // submit to the network. this returns a promise (resolves or rejects depending on the outcome of the transaction)
              server.submitTransaction(transaction);
          })
  
  */
