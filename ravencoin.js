const async = require('async');
const fs = require('fs');
const axios = require("axios");

const CONFIG = getConfig();
const crypto = require ("crypto");
const ravencore = require("ravencore-lib");

const Ravencoincore = require('ravencoin-core');


const serverLink = "http://127.0.0.1:8766";
//  http://127.0.0.1:8766        main net
//  http://127.0.0.1:18766      testnet
/*
npm library
https://www.npmjs.com/package/ravencore-lib?activeTab=readme  

",  "

node ravencoin listaddressesbyassets configfile=./data/ravencoinconfig.txt TST005         normal
node ravencoin listaddressesbyassets configfile=./data/ravencoinconfig.txt TST005 QUA
node ravencoin listaddressesbyassets configfile=./data/ravencoinconfig.txt TST005 RES

Tags
node ravencoin addtagtoaddress configfile=./data/ravencoinconfig.txt TST005 myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7
node ravencoin removetagfromaddress configfile=./data/ravencoinconfig.txt TST005 myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7
node ravencoin checkaddresstag configfile=./data/ravencoinconfig.txt mhx8NLZHeyxhHbR9Ji6FyEtKazA4MnLbKx TST004    
node ravencoin listaddressesfortag configfile=./data/ravencoinconfig.txt TST005    (addresses tags are assigned to)

node ravencoin getassetdata configfile=./data/ravencoinconfig.txt     this is used to get total supploy of the token

node ravencoin listassetbalancesbyaddress configfile=./data/ravencoinconfig.txt myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7

node ravencoin listtagsforaddress configfile=./data/ravencoinconfig.txt mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep

node ravencoin transferfromaddress configfile=./data/ravencoinconfig.txt mmrSGbraaxPVPR1gp9CxyTNqihHeniMA3G myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7 TST003 30

node ravencoin transferfromaddress configfile=./data/ravencoinconfig.txt mmrSGbraaxPVPR1gp9CxyTNqihHeniMA3G myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7 TST005 50


MEGATECH
$MEGATECH  myxd8nhb8Bh9h9syK2n2u6hKRyrSrAbxZ8
#MEGA

SHACOIN    mwHNuJ1MEF4MK9K2WMQXsTvVLwZSWcBZuX   1

$SHACOIN  mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep  100000     private key of this public key is cRH1BgNoy3MxXe5eRHC94VRXa1vs6VsuuVmyvadjXZvkFLurL8rF

#SHATAG   mxTs5rZGvj2kYgZFo75E3fqpPgc4sWujiF  1

ICOCOIN   mhx8NLZHeyxhHbR9Ji6FyEtKazA4MnLbKx 10000

// TST003 main asset       #TST003 qualifier        $TST003 restricted asset     mmrSGbraaxPVPR1gp9CxyTNqihHeniMA3G
 

Ravencoin_ServerURL
Ravencoin_Username
Ravencoin_Password

AssetName
AssetTag

//Retriving private key from wallet 
1.  unlocak wallet first with     walletpassphrase "Allahis@1" 100
2. dumpprivkey "mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep"



*/


if (process.argv[2] == "test") {
    //  node ravencoin test configfile=./data/ravencoinconfig.txt
        
        rpc("getblockcount", [])
            .then(function (data) {

                console.log("Holders of", CONFIG.asset);
                console.table(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}

// ---------------- RVN
if (process.argv[2] == "getaddressbalance") {
    //  node ravencoin getaddressbalance configfile=./data/ravencoinconfig.txt
        
        rpc("getaddressbalance", ["n4dQ28t5LyJf3pW5w6m8F9mvXaQ6ksWEw"])
            .then(function (data) {

                console.log("Holders of", CONFIG.asset);
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}



// --------------- Assets 
if (process.argv[2] == "listaddressesfortag") {
        // node ravencoin listaddressesfortag configfile=./data/ravencoinconfig.txt MEGA
        console.log(process.argv[4])
        rpc("listaddressesfortag", ["#" + process.argv[4]])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}	

if (process.argv[2] == "listaddressesbyassets") {
    //  node ravencoin listaddressesbyassets configfile=./data/ravencoinconfig.txt MEGATECH QUA
	//  node ravencoin listaddressesbyassets configfile=./data/ravencoinconfig.txt MEGATECH RES
	//  node ravencoin listaddressesbyassets configfile=./data/ravencoinconfig.txt MEGATECH  normal
 
	
		// use $ to get balance of restricted asset
	    // use # to get balance of number of qualifier asset
	    // use nothing to get balance of main asset
	
		var assetName = process.argv[4];	
		if(process.argv[5] != null )	 {
			if(process.argv[5] == "QUA" )
					assetName = "#" + assetName;
			if(process.argv[5] == "RES" )	
					assetName = "$" + assetName;
		}

	
        rpc("listaddressesbyasset", [assetName])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });

}     //get all addresses that has tag + their balances

if (process.argv[2] == "listmyassets") {
    //  node ravencoin listmyassets configfile=./data/ravencoinconfig.txt
        rpc("listmyassets", ["DIGICOIN"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
	
	/*
			{ MEGATECH: 100000, 'MEGATECH!': 1 }
			{
			  '#DIGI': 2,
			  DIGICOIN: 100000,
			  'DIGICOIN!': 1,
			  '$DIGICOIN': 1,


			  '#MEGA': 1,
			  MEGATECH: 100000,  
			  'MEGATECH!': 1
			  '$MEGATECH': 100000,

			}	
	
	*/
}   

//-------------
if (process.argv[2] == "freezerestrictedasset") {
    	//  node ravencoin freezerestrictedasset configfile=./data/ravencoinconfig.txt
        rpc("freezerestrictedasset", ["$DIGICOIN"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
				console.log("............")
                console.error(e.message);
          });    
}     

if (process.argv[2] == "unfreezerestrictedasset") {
    	//  node ravencoin unfreezerestrictedasset configfile=./data/ravencoinconfig.txt
        rpc("unfreezerestrictedasset", ["$DIGICOIN"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
				console.log("............")
                console.error(e.message);
          });    
}     

if (process.argv[2] == "freezeaddress") {
    	//  node ravencoin freezeaddress configfile=./data/ravencoinconfig.txt
        rpc("freezeaddress", ["$MEGATECH", "n4dQ28t5LyJf3pW5w6m8F9mvXaQ6ksWEwM"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
				console.log("............")
                console.error(e.message);
          });    
}     

if (process.argv[2] == "unfreezeaddress") {
    	//  node ravencoin unfreezeaddress configfile=./data/ravencoinconfig.txt
        rpc("unfreezeaddress", ["$MEGATECH", "n4dQ28t5LyJf3pW5w6m8F9mvXaQ6ksWEwM"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
				console.log("............")
                console.error(e.message);
          });    
}
//-------------

if (process.argv[2] == "listaddressrestrictions") {
    	//  node ravencoin listaddressrestrictions configfile=./data/ravencoinconfig.txt
        rpc("listaddressrestrictions", ["myxd8nhb8Bh9h9syK2n2u6hKRyrSrAbxZ8"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
				console.log("............")
                console.error(e.message);
          });    
}

if (process.argv[2] == "viewmyrestrictedaddresses") {
    	//  node ravencoin viewmyrestrictedaddresses configfile=./data/ravencoinconfig.txt
        rpc("viewmyrestrictedaddresses", [])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
				console.log("............")
                console.error(e.message);
          });    
	
	/*
		  {
			Address: 'n4dQ28t5LyJf3pW5w6m8F9mvXaQ6ksWEwM',
			'Asset Name': '$MEGATECH',
			Derestricted: '2021-09-15 18:34:31'
		  }
	*/
}

if (process.argv[2] == "addtagtoaddress") {		
    	//  node ravencoin addtagtoaddress configfile=./data/ravencoinconfig.txt MEGA myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7		
	
		rpc("walletpassphrase", ["Allahis@1", 60])			
		.then(function () {	

				rpc("addtagtoaddress", ["#" + process.argv[4], process.argv[5]])
					.then(function (data) {
						console.log(data);
				  })
				  .catch(function (e) {
						console.error(e.message);
				  });
			
		}).catch(function (e) {
			console.log(e)
		});							
	
}

if (process.argv[2] == "removetagfromaddress") {
    	//  node ravencoin removetagfromaddress configfile=./data/ravencoinconfig.txt MEGA myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7

		rpc("walletpassphrase", ["Allahis@1", 60])			
		.then(function () {	
			
				rpc("removetagfromaddress",  ["#" + process.argv[4], process.argv[5]])
					.then(function (data) {
						console.log(data);
				  })
				  .catch(function (e) {
						console.error(e.message);
				  });

		}).catch(function (e) {
			console.log(e)
		});				
			
}

if (process.argv[2] == "listassets") {
		// i think it shows all of the assets
    	//  node ravencoin listassets configfile=./data/ravencoinconfig.txt
        rpc("listassets", [])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
}

if (process.argv[2] == "listmyassets") {
    	//  node ravencoin listmyassets configfile=./data/ravencoinconfig.txt
        rpc("listmyassets", [])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
}



// ------------- Address
if (process.argv[2] == "getaddresstxids") {
    //  node ravencoin getaddresstxids configfile=./data/ravencoinconfig.txt
        
        rpc("getaddresstxids", ["mwC16XZ9Tq9n9FWk9iRfBetAGGtD8C11Rt"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });

}

if (process.argv[2] == "getassetdata") {
    //  node ravencoin getassetdata configfile=./data/ravencoinconfig.txt 
        
        rpc("getassetdata", ["$MEGATECH"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}

if (process.argv[2] == "listassetbalancesbyaddress") {
    	//  node ravencoin listassetbalancesbyaddress configfile=./data/ravencoinconfig.txt myxd8nhb8Bh9h9syK2n2u6hKRyrSrAbxZ8
        rpc("listassetbalancesbyaddress", [process.argv[4]])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
}

if (process.argv[2] == "checkaddresstag") {
        // node ravencoin checkaddresstag configfile=./data/ravencoinconfig.txt myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7 MEGA

        rpc("checkaddresstag", [ process.argv[4], "#" + process.argv[5] ])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}

if (process.argv[2] == "listtagsforaddress") {
        // node ravencoin listtagsforaddress configfile=./data/ravencoinconfig.txt myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7

        rpc("listtagsforaddress", [process.argv[4]])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}




// -----------------  Wallet
if (process.argv[2] == "listaccounts") {
        // node ravencoin listaccounts configfile=./data/ravencoinconfig.txt
        rpc("listaccounts", [])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });  
}

if (process.argv[2] == "getwalletinfo") {
        // node ravencoin getwalletinfo configfile=./data/ravencoinconfig.txt
        rpc("getwalletinfo", [])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });  
}

if (process.argv[2] == "transferfromaddress") {
    	 //  node ravencoin transferfromaddress configfile=./data/ravencoinconfig.txt mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7 TST004 20
	
		rpc("walletpassphrase", ["Allahis@1", 60])			
		.then(function () {

				 rpc("transferfromaddress", ["$" + process.argv[6], process.argv[4], process.argv[7], process.argv[5]])
					.then(function (data) {

						console.log(data);
				  })
				  .catch(function (e) {
						console.error(e.message);
				  });

		}).catch(function (e) {
			console.log(e)
		});	
	
			
}

// re-issue or mint new assets for investor
if (process.argv[2] == "issueNewAssets") {
    	//  node ravencoin issueNewAssets configfile=./data/ravencoinconfig.txt mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep SHACOIN 20
			
		// issuerestrictedasset "asset_name" qty "verifier" "to_address" 
		//reissuerestrictedasset "asset_name" qty to_address ( change_verifier ) ( "new_verifier" ) "( change_address )" ( new_units ) ( reissuable ) "( new_ipfs )"		
	
		rpc("reissuerestrictedasset", [process.argv[5], 200, process.argv[4] ] )
		.then(function (data) {
			 console.log(data)
		}).catch(function (e) {
			 console.log(e.toString())
		});

}

if (process.argv[2] == "encryptdecrypt") {
		// node ravencoin encryptdecrypt configfile=./data/ravencoinconfig.txt
		
	
	const secret = 'Allahis@1111';
	const hash = crypto.createHmac('sha256', secret)
					   .update('Allahis@1111')
					   .digest('hex');
	
	
	const algorithm = 'aes-256-ctr';
	const secretKey =  hash.substring(0,32);     
	const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update("mhx8NLZHeyxhHbR9Ji6FyEtKazA4MnLbKx"), cipher.final()]);

	const data = {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
	
    console.log (data);	
	
	
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(data.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(data.content, 'hex')), decipher.final()]);

    console.log( decrpyted.toString() );	
	
	
}

if (process.argv[2] == "dumpWalletAddressPrivateKey") {
		// node ravencoin dumpWalletAddressPrivateKey configfile=./data/ravencoinconfig.txt
		
		rpc("walletpassphrase", ["Allahis@1", 60])			
		.then(function () {
			 
				rpc("dumpprivkey", ["mhx8NLZHeyxhHbR9Ji6FyEtKazA4MnLbKx"])			
				.then(function (data) {

						console.log(data);

				}).catch(function (e) {
					console.log(e)
				});				
			
		}).catch(function (e) {
			console.log(e)
		});	
}

if (process.argv[2] == "sendRawTransaction") {
	
			//	node ravencoin sendRawTransaction configfile=./data/ravencoinconfig.txt

	
	/*
			var params = {
			  'insight_url': 'https://api.testnet.ravencoin.org/api',
			  'asset': 'SHACOIN',
			  'amount': 100,
			  'asset_from_addresses': 'mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep',
			  'rvn_from_address': 'mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep',
			  'private_keys': ['cRH1BgNoy3MxXe5eRHC94VRXa1vs6VsuuVmyvadjXZvkFLurL8rF', 'cRH1BgNoy3MxXe5eRHC94VRXa1vs6VsuuVmyvadjXZvkFLurL8rF'],
			  'to_address': 'myxd8nhb8Bh9h9syK2n2u6hKRyrSrAbxZ8',
			  'asset_change_address': 'mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep',
			  'rvn_change_address': 'mxogYG3E5Nn5pG2pRK5a53tMYbLe83Kcep'
			}

			var insight =  ravencore.Insight(params.insight_url)

			var getAssetUtxos = function (from_address, asset) {
			  return new Promise(function (resolve, reject) {
				insight.addrAssetUtxo(from_address, asset, function (res) { resolve(res) })
			  })
			}

			var getRvnUtxos = function (from_address) {
			  return new Promise(function (resolve, reject) {
				insight.passthroughGet('/addr/' + from_address + '/utxo', function (res) { resolve(res) })
			  })
			}

			var createTransaction = function (utxos) {
			  return new Promise(function (resolve, reject) {
				t = new ravencore.Transaction()
				  .from(utxos)
				  .to(params.to_address, params.amount, params.asset)
				  .change(params.rvn_change_address)
				  .change(params.asset_change_address, params.asset)
				  .sign(params.private_keys)
				resolve(t)
			  })
			}

			var transaction;

			Promise.all([
			  getAssetUtxos(params.asset_from_addresses, params.asset),
			  getRvnUtxos(params.rvn_from_address)
			]).then(function (results) {
			  return _.flatten(results)
			}).then(function (utxos) {
			  return createTransaction(utxos)
			}).then(function (t) {
			  transaction = t
			  
			})
			
*/			
}


if (process.argv[2] == "issueAssets") {
		// node ravencoin issueAssets configfile=./data/ravencoinconfig.txt
	
		rpc("walletpassphrase", ["Allahis@1", 60])			
		.then(function () {
				
				// issue "asset_name" qty "( to_address )" "( change_address )" ( units ) ( reissuable ) ( has_ipfs ) "( ipfs_hash
				rpc("issue", ["TestAsset123", 100 ])			
				.then(function () {

					console.log("Created");

				}).catch(function (e) {
					console.log(e.toString())
				});	
			
			
		}).catch(function (e) {
			console.log(e)
		});	

}



if (process.argv[2] == "revncorebalance") { 
	
	//node ravencoin revncorebalance  configfile=./data/ravencoinconfig.txt
	
	const client = new Ravencoincore({ 
		 network: 'regtest',
		 username: 'supermegasecret',
		 password: 'supermegasecret'
	});

	client.getBalance().then(data => {
		console.log(data);		
	})

}


if (process.argv[2] == "createIssueAsset") {

		// node ravencoin createIssueAsset configfile=./data/ravencoinconfig.txt	 	
	
		rpc("walletpassphrase", ["Allahis@1", 600])			
		.then(function () {
			
				const options = {
					  auth: {
							username: "supermegasecret",
							password: "supermegasecret",
					  },
				};
			
				const serverURL = 'http://127.0.0.1:18766'

				  const rpcResponse = axios.post(serverURL, {"method": 'issue', "params": ["TESTINGAB02", "1000"], "jsonrpc": "2.0"}, options);

				  rpcResponse.then((re) => {
					  		console.log(re.data.result);
				  });
				  rpcResponse.catch((e) => {
							console.log(e.response.data)
				  });	

		}).catch(function (e) {
			console.log(e)
		});				
	
}



// ----------------------------------------------------------------------------
// These are steps for ravencoin assets 

//1  create main asset    i thin only 1 quality is needed because restricted asset will get transferred
if (process.argv[2] == "createIssueAsset1") {

		// node ravencoin createIssueAsset1 configfile=./data/ravencoinconfig.txt

		rpc("walletpassphrase", ["Allahis@1", 600])			
		.then(function () {
				rpc("issue", ["TST005", 1, "mmrSGbraaxPVPR1gp9CxyTNqihHeniMA3G"])			
				.then(function () {

						console.log("Done")

				}).catch(function (e) {
					console.log(e)
				});

		}).catch(function (e) {
			console.log(e)
		});				

}

//2   create qualifier      more qualifiers cannot be created and max is 10 so create as much as you can
//issuequalifierasset  "asset_name" qty "( to_address )" "( change_address )" ( has_ipfs ) "( ipfs_hash )"
if (process.argv[2] == "createQualifier") {

		// node ravencoin createQualifier configfile=./data/ravencoinconfig.txt

		rpc("walletpassphrase", ["Allahis@1", 600])			
		.then(function () {
			
			
				rpc("issuequalifierasset", ["#TST005", 10, "mmrSGbraaxPVPR1gp9CxyTNqihHeniMA3G"])			
				.then(function () {

						console.log("Done")

				}).catch(function (e) {
					console.log(e)
				});

		}).catch(function (e) {
			console.log(e)
		});

}


//3 assign qualifier to company address
//node ravencoin addtagtoaddress configfile=./data/ravencoinconfig.txt TST005 mmrSGbraaxPVPR1gp9CxyTNqihHeniMA3G

//3   create restricted asset
// issuerestrictedasset "asset_name" qty "verifier" "to_address" "( change_address )" (units) ( reissuable ) ( has_ipfs ) 
if (process.argv[2] == "createRestrictedAsset") {

		// node ravencoin createRestrictedAsset configfile=./data/ravencoinconfig.txt

		rpc("walletpassphrase", ["Allahis@1", 600])			
		.then(function () {

				rpc("issuerestrictedasset", ["TST005", 10000, "#TST005",  "mmrSGbraaxPVPR1gp9CxyTNqihHeniMA3G"])			
				.then(function () {

						console.log("Done")

				}).catch(function (e) {
					console.log(e)
				});

		}).catch(function (e) {
			console.log(e)
		});			

}



// ----------------------------------------------------------------------------



async function rpc(method, params) {
    
      const promise = new Promise((resolutionFunc, rejectionFunc) => {

        const options = {
              auth: {
                    username: CONFIG.rpcUsername,
                    password: CONFIG.rpcPassword,
              },
        };
        const data = {
              jsonrpc: "1.0",
              method,
              params,
        };
		  

        try {

			const rpcResponse = axios.post("http://127.0.0.1:18766", data, options);

			  rpcResponse.then((re) => {
					const result = re.data.result;
					resolutionFunc(result);
			  });
			  rpcResponse.catch((e) => {
					rejectionFunc(e);
			  });

        } catch (e) {
              rejectionFunc(e);
        }
      });
      return promise;
    
}    

function getConfig() {
  let config = null;
  for (const argument of process.argv) {
    if (argument.startsWith("configfile=") === true) {
      const fileName = argument.replace("configfile=", "");
      if (fs.existsSync(fileName) === false) {
			console.error("Could not locate file", fileName);
			process.exit(1);
      }
      config = JSON.parse(fs.readFileSync(fileName, "utf8"));
    }
  }

  if (config === null) {
    const message = `Could not locate the config file.
    Please start this app with "node index configfile=FILE_PATH"
    
    The config file should look like
    
    {
      "rpcUsername": "YOUR_USERNAME",
      "rpcPassword": "YOUR VERY SECRET PASSWORD",  
      "asset": "YOUR COOL ASSET"
    }
    
    `;
    console.error(message);
    process.exit(1);
  }

  return config;
}















/*

First setup Ravencoin wallet server as 

server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
assetindex=1
timestampindex=1
spentindex=1
rpcuser=supermegasecret
rpcpassword=supermegasecret


then run the server with    ./raven-qt -testnet 

*/






/*
== Addressindex ==
getaddressbalance
getaddressdeltas
getaddressmempool
getaddresstxids
getaddressutxos

== Assets ==
getassetdata "asset_name"
getcacheinfo 
getsnapshot "asset_name" block_height
---- issue "asset_name" qty "( to_address )" "( change_address )" ( units ) ( reissuable ) ( has_ipfs ) "( ipfs_hash )"
issueunique "root_name" [asset_tags] ( [ipfs_hashes] ) "( to_address )" "( change_address )"
listaddressesbyasset "asset_name" (onlytotal) (count) (start)
listassetbalancesbyaddress "address" (onlytotal) (count) (start)
listassets "( asset )" ( verbose ) ( count ) ( start )
listmyassets "( asset )" ( verbose ) ( count ) ( start ) (confs) 
purgesnapshot "asset_name" block_height
reissue "asset_name" qty "to_address" "change_address" ( reissuable ) ( new_units) "( new_ipfs )" 
sweep "privkey" ( "asset_name" | "RVN" ) 
transfer "asset_name" qty "to_address" "message" expire_time "change_address" "asset_change_address"
transferfromaddress "asset_name" "from_address" qty "to_address" "message" expire_time "rvn_change_address" "asset_change_address"
transferfromaddresses "asset_name" ["from_addresses"] qty "to_address" "message" expire_time "rvn_change_address" "asset_change_address"

== Blockchain ==
clearmempool
decodeblock "blockhex"
getbestblockhash
getblock "blockhash" ( verbosity ) 
getblockchaininfo
getblockcount

getblockhash height
getblockhashes timestamp
getblockheader "hash" ( verbose )
getchaintips
getchaintxstats ( nblocks blockhash )
getdifficulty
getmempoolancestors txid (verbose)
getmempooldescendants txid (verbose)
getmempoolentry txid
getmempoolinfo
getrawmempool ( verbose )
getspentinfo
gettxout "txid" n ( include_mempool )
gettxoutproof ["txid",...] ( blockhash )
gettxoutsetinfo
preciousblock "blockhash"
pruneblockchain
savemempool
verifychain ( checklevel nblocks )
verifytxoutproof "proof"

== Control ==
getinfo
getmemoryinfo ("mode")
getrpcinfo
help ( "command" )
stop
uptime

== Generating ==
generate nblocks ( maxtries )
generatetoaddress nblocks address (maxtries)
getgenerate
setgenerate generate ( genproclimit )

== Messages ==
clearmessages 
sendmessage "channel_name" "ipfs_hash" (expire_time)
subscribetochannel 
unsubscribefromchannel 
viewallmessagechannels 
viewallmessages 

== Mining ==
getblocktemplate ( TemplateRequest )
getkawpowhash "header_hash" "mix_hash" nonce, height, "target"
getmininginfo
getnetworkhashps ( nblocks height )
pprpcsb "header_hash" "mix_hash" "nonce"
prioritisetransaction <txid> <dummy value> <fee delta>
submitblock "hexdata"  ( "dummy" )

== Network ==
addnode "node" "add|remove|onetry"
clearbanned
disconnectnode "[address]" [nodeid]
getaddednodeinfo ( "node" )
getconnectioncount
getnettotals
getnetworkinfo
getpeerinfo
listbanned
ping
setban "subnet" "add|remove" (bantime) (absolute)
setnetworkactive true|false

== Rawtransactions ==
combinerawtransaction ["hexstring",...]
createrawtransaction [{"txid":"id","vout":n},...] {"address":(amount or object),"data":"hex",...}
decoderawtransaction "hexstring"
decodescript "hexstring"
fundrawtransaction "hexstring" ( options )
getrawtransaction "txid" ( verbose )
sendrawtransaction "hexstring" ( allowhighfees )
signrawtransaction "hexstring" ( [{"txid":"id","vout":n,"scriptPubKey":"hex","redeemScript":"hex"},...] ["privatekey1",...] sighashtype )
testmempoolaccept ["rawtxs"] ( allowhighfees )

== Restricted assets ==
addtagtoaddress tag_name to_address (change_address) (asset_data)
checkaddressrestriction address restricted_name
checkaddresstag address tag_name
checkglobalrestriction restricted_name
freezeaddress asset_name address (change_address) (asset_data)
freezerestrictedasset asset_name (change_address) (asset_data)
getverifierstring restricted_name
---- issuequalifierasset "asset_name" qty "( to_address )" "( change_address )" ( has_ipfs ) "( ipfs_hash )"
---- issuerestrictedasset "asset_name" qty "verifier" "to_address" "( change_address )" (units) ( reissuable ) ( has_ipfs ) "( ipfs_hash )"
isvalidverifierstring verifier_string
listaddressesfortag tag_name
listaddressrestrictions address
listglobalrestrictions
listtagsforaddress address
reissuerestrictedasset "asset_name" qty to_address ( change_verifier ) ( "new_verifier" ) "( change_address )" ( new_units ) ( reissuable ) "( new_ipfs )"
removetagfromaddress tag_name to_address (change_address) (asset_data)
---- transferqualifier "qualifier_name" qty "to_address" ("change_address") ("message") (expire_time) 
unfreezeaddress asset_name address (change_address) (asset_data)
unfreezerestrictedasset asset_name (change_address) (asset_data)

== Restricted ==
viewmyrestrictedaddresses 
viewmytaggedaddresses 

== Rewards ==
cancelsnapshotrequest "asset_name" block_height
distributereward "asset_name" snapshot_height "distribution_asset_name" gross_distribution_amount ( "exception_addresses" ) ("change_address") ("dry_run")
getdistributestatus "asset_name" snapshot_height "distribution_asset_name" gross_distribution_amount ( "exception_addresses" )
getsnapshotrequest "asset_name" block_height
listsnapshotrequests ["asset_name" [block_height]]
requestsnapshot "asset_name" block_height

== Util ==
createmultisig nrequired ["key",...]
estimatefee nblocks
estimatesmartfee conf_target ("estimate_mode")
signmessagewithprivkey "privkey" "message"
validateaddress "address"
verifymessage "address" "signature" "message"

== Wallet ==
abandontransaction "txid"
abortrescan
addmultisigaddress nrequired ["key",...] ( "account" )
addwitnessaddress "address"
backupwallet "destination"
bumpfee has been deprecated on the RVN Wallet.
dumpprivkey "address"
dumpwallet "filename"
encryptwallet "passphrase"
getaccount "address"
getaccountaddress "account"
getaddressesbyaccount "account"
getbalance ( "account" minconf include_watchonly )
getmasterkeyinfo
getmywords ( "account" )
getnewaddress ( "account" )
getrawchangeaddress
getreceivedbyaccount "account" ( minconf )
getreceivedbyaddress "address" ( minconf )
gettransaction "txid" ( include_watchonly )
getunconfirmedbalance
getwalletinfo
importaddress "address" ( "label" rescan p2sh )
importmulti "requests" ( "options" )
-----  importprivkey "privkey" ( "label" ) ( rescan )
importprunedfunds
importpubkey "pubkey" ( "label" rescan )
----- importwallet "filename"
keypoolrefill ( newsize )
---- listaccounts ( minconf include_watchonly)
listaddressgroupings
listlockunspent
listreceivedbyaccount ( minconf include_empty include_watchonly)
listreceivedbyaddress ( minconf include_empty include_watchonly)
listsinceblock ( "blockhash" target_confirmations include_watchonly include_removed )
listtransactions ( "account" count skip include_watchonly)
listunspent ( minconf maxconf  ["addresses",...] [include_unsafe] [query_options])
listwallets
lockunspent unlock ([{"txid":"txid","vout":n},...])
move "fromaccount" "toaccount" amount ( minconf "comment" )
removeprunedfunds "txid"
rescanblockchain ("start_height") ("stop_height")
sendfrom "fromaccount" "toaddress" amount ( minconf "comment" "comment_to" )
sendfromaddress "from_address" "to_address" amount ( "comment" "comment_to" subtractfeefromamount replaceable conf_target "estimate_mode")
sendmany "fromaccount" {"address":amount,...} ( minconf "comment" ["address",...] replaceable conf_target "estimate_mode")
sendtoaddress "address" amount ( "comment" "comment_to" subtractfeefromamount replaceable conf_target "estimate_mode")
setaccount "address" "account"
settxfee amount
signmessage "address" "message"
*/




// issue "asset_name" qty "( to_address )" "( change_address )" ( units ) ( reissuable ) ( has_ipfs ) "( ipfs_hash )"
// issuequalifierasset  "asset_name" qty "( to_address )" "( change_address )" ( has_ipfs ) "( ipfs_hash )"
// issuerestrictedasset "asset_name" qty "verifier" "to_address" "( change_address )" (units) ( reissuable ) ( has_ipfs ) 
// transferqualifier "qualifier_name" qty "to_address" ("change_address") ("message") (expire_time)




