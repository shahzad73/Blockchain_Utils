const async = require('async');
const fs = require('fs');
const axios = require("axios");

const CONFIG = getConfig();

const serverLink = "http://127.0.0.1:8766";
//  http://127.0.0.1:8766        main net
//  http://127.0.0.1:18766      testnet
  


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

// RVN
if (process.argv[2] == "getaddressbalance") {
    //  node ravencoin getaddressbalance configfile=./data/ravencoinconfig.txt
        
        rpc("getaddressbalance", ["moCyJzkXNxBpB1PzkLEGc4FQfC11zjSyqT"])
            .then(function (data) {

                console.log("Holders of", CONFIG.asset);
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}


// Assets 
if (process.argv[2] == "listaddressesfortag") {
        // node ravencoin listaddressesfortag configfile=./data/ravencoinconfig.txt
        
        rpc("listaddressesfortag", ["#MEGA"])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}	

if (process.argv[2] == "listaddressesbyassets") {
    //  node ravencoin listaddressesbyassets configfile=./data/ravencoinconfig.txt
        
        rpc("listaddressesbyasset", ["$MEGATECH"])
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

                console.log(CONFIG.asset);
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}

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

if (process.argv[2] == "listaddressrestrictions") {
    	//  node ravencoin listaddressrestrictions configfile=./data/ravencoinconfig.txt
        rpc("listaddressrestrictions", ["mvGA9tP6aAD3dcSHLEWcLJADg1ryKf14Pu"])
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
}

if (process.argv[2] == "addtagtoaddress") {
    	//  node ravencoin addtagtoaddress configfile=./data/ravencoinconfig.txt
        rpc("addtagtoaddress", ["#MEGA", "myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
}

if (process.argv[2] == "listassets") {
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



// Address
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
        
        rpc("getassetdata", ["DIGICOIN"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}

if (process.argv[2] == "listassetbalancesbyaddress") {
    	//  node ravencoin listassetbalancesbyaddress configfile=./data/ravencoinconfig.txt
        rpc("listassetbalancesbyaddress", ["myxd8nhb8Bh9h9syK2n2u6hKRyrSrAbxZ8"])
            .then(function (data) {
                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
}

if (process.argv[2] == "checkaddresstag") {
        // node ravencoin checkaddresstag configfile=./data/ravencoinconfig.txt

        rpc("checkaddresstag", ["myhyhmRiKnuqgpmyAAeujWoxoTyWpZVUi7", "#MEGA"])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}

if (process.argv[2] == "listtagsforaddress") {
        // node ravencoin listtagsforaddress configfile=./data/ravencoinconfig.txt

        rpc("listtagsforaddress", ["munskw5HqVKW5KKuALq5etxRECurgPYCkQ"])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    
}




//Wallet
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
    //  node ravencoin transferfromaddress configfile=./data/ravencoinconfig.txt
        
        rpc("transferfromaddress", ["$MEGATECH", "n4dQ28t5LyJf3pW5w6m8F9mvXaQ6ksWEwM", 20, "munskw5HqVKW5KKuALq5etxRECurgPYCkQ"])
            .then(function (data) {

                console.log(data);
          })
          .catch(function (e) {
                console.error(e.message);
          });
    //mvzRFJRNPY2JjTi3gY46ofskBnxC6WHpyz
}



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
              id: CONFIG.asset,
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
              console.log("11111111111111111111")
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

