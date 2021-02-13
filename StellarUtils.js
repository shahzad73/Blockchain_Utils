'use strict'  

var dotenv =  require('dotenv')
dotenv.load({path: __dirname + '/config.txt'});

const fs = require('fs');

if (process.env.Secret_Config_File && fs.existsSync(process.env.Secret_Config_File)) {
    let rawdata = fs.readFileSync(process.env.Secret_Config_File);  
    global.CONFIGFILE_DATA = JSON.parse(rawdata);
}
else {
    var inCodeSecrets = {
        "Key_Eencription": "Default982362387jeffwefwflmwdbqcs"
    };
    
    global.CONFIGFILE_DATA = inCodeSecrets;
}

const async = require('async');
const mysql = require("./modules/mysql");
const stellarApi = require("./modules/stellar");
const key = require('./modules/encryption');

if (process.argv[2] == "SetupIssuerDistributionAccount" ) {

    // node StellarUtils SetupIssuerDistributionAccount SCGS22Y3THUB7GM7EYIHTAT7CGJL2LCUQ5L45JJ46ZQUKUKBBWFX6XBW GCWQ47VCLF76QFYZWILMKA2VYBU7ULQMX32MVOMLABFAYTFMRX64DQO4 SDWCKSMTCGWK2GEM55S2PFBOQW2OKGVENSX6JWAY457O5EDCASUDS54M GB4SYVHM7ZK6IKCP3BBCPIUB2J66AXSP6TELSWVWPRK3G2LYMTOX4NTQ DigiShares 100000

    var issuanceAccountPrivateKey = process.argv[3];
    var issuanceAccountPublicKey = process.argv[4];
    var distributionAccountPrivateKey = process.argv[5];
    var distributionAccountPublicKey = process.argv[6];
    var SecurityTokenID = process.argv[7];
    var InitialTokenSupply = process.argv[8];

    console.log(SecurityTokenID)
    
          async.waterfall([
              restrictIssuanceAccount,
              createTrustLine,
              authorizeTrustLine,
              SendSecurityTokensToDistributionAccount
          ], function (err) {
              console.log("Done ..");
          });      
          function restrictIssuanceAccount(callback){

                stellarApi.restrictAssetTrustLines(issuanceAccountPrivateKey).then(function(data) {
                    console.log("Issuance account has been restricted");
                    callback(null)
                }, function(err){
                    console.log("1111111")
                    console.log(err);
                    callback(err);
                });

          }
          function createTrustLine(callback) {
                stellarApi.createTrustLine(SecurityTokenID, issuanceAccountPublicKey, distributionAccountPrivateKey).then (function(data){
                    console.log("Trust line created");
                    callback(null)
                }, function(err){
                    console.log("create testline erro")
                    console.log( err.message );
                    callback(err)
                });
          }
          function authorizeTrustLine(callback) {
                stellarApi.AuthrorizeTrustLine(issuanceAccountPrivateKey, distributionAccountPublicKey, SecurityTokenID, "true").then
                (function(data){
                    console.log("Distribution Account trust line has been authorized");
                    callback(null);
                },
                function(err){
                    console.log("authorized trust lines")
                    console.log(err.message);
                    callback(err);
                });                                 
          }
          function SendSecurityTokensToDistributionAccount(callback) {
              stellarApi.sendPayments(issuanceAccountPrivateKey, issuanceAccountPublicKey, distributionAccountPublicKey, SecurityTokenID, InitialTokenSupply).then
              (function(data) {
                  console.log("Tokens transferred");
                  callback(null);
              },
              function(err){
                  console.log( err.message );
              });
          }

}

if (process.argv[2] == "EncryptKey") {
    // node StellarUitls EncryptKey SBA4Z34BLNFJEZFBOKV4ATSXWSPQSLC4FL3EKIHPUGDVSCBDUOP4LFL3 abc

    var str = key.encryptData(process.argv[3], process.argv[4]);
    console.log(str);
}

if (process.argv[2] == "DecryptKey") {
    //node StellarUitls DecryptKey <data> abc
    
    try {
        var str = key.decryptData(process.argv[3], process.argv[4]);
        console.log(str);
    }
    catch(error) {
      console.error("Encripton error");
    }    
}

if (process.argv[2] == "CreateTestAccount" ) {
    
    // node StellarUtils CreateTestAccount
    
                    stellarApi.createTestAccount("").then
                    (function(data){
                        var Acc = [];
                        Acc.push({"secretKey":data.secretKey, "publicKey":data.publicKey});                    
                        console.log(Acc);
                    },
                    function(err){
                        console.log( err );
                    });    
}

if (process.argv[2] == "AuthorizeAccount" ) {
    // Command     node StellarUtils AuthorizeAccount

    //  DigiShares       issuanceAccountPublicKey        Receiver Private Key
    stellarApi.createTrustLine("DigiShares", "GCWQ47VCLF76QFYZWILMKA2VYBU7ULQMX32MVOMLABFAYTFMRX64DQO4", "SDCI4I6JLE7JL6HDM7QCS367AOASIXXQY6DX356YPOXKDZRNAR45JMIO").then (function(data){
        console.log("Trust line created");
    }, function(err){
        console.log("create testline created")
        console.log( err.message );
        callback(err)
    });    

}

if (process.argv[2] == "SendToken" ) {
        // node StellarUtils SendToken

        //distributionSourcePrivateKey     assetIssuerPublicKey     destinationPublicKey     assetCode     amountToSend
        stellarApi.sendPayments("SDWCKSMTCGWK2GEM55S2PFBOQW2OKGVENSX6JWAY457O5EDCASUDS54M", 
                                "GCWQ47VCLF76QFYZWILMKA2VYBU7ULQMX32MVOMLABFAYTFMRX64DQO4", 
                                "GA3SPRZSVZ5ABMDZTMKAOPCK5JBJYCHULFQ5P57KSESXNDLYP5R4N23P", 
                                "DigiShares", 
                                "100").then
        (function(data) {
            console.log("Tokens transferred");
        },
        function(err){                        
            console.log( err.toString() );
        });


}

if (process.argv[2] == "CheckTrustLine" ) {
        // node StellarUtils CheckTrustLine

        stellarApi.CheckTrustLine ( "GCWQ47VCLF76QFYZWILMKA2VYBU7ULQMX32MVOMLABFAYTFMRX64DQO4", 
                                    "GA3SPRZSVZ5ABMDZTMKAOPCK5JBJYCHULFQ5P57KSESXNDLYP5R4N23P", 
                                    "DigiShares").then
        (function(data) {
            console.log(data);
        },
        function(err){
            console.log( "some error" );
        });
}

if (process.argv[2] == "InitializeTestAccounts") {
    // node StellarUitls InitializeTestAccounts DigiShares
    
    var SecurityTokenID = process.argv[3];     
    
                async.waterfall([
                    createAccount1,
                    createAccount2,
                    createAccount2,
                    createAccount2,
                    restrictAccounts,
                    createTrustLines,
                    AuthorizeTrustLine1,
                    AuthorizeTrustLine2,
                    AuthorizeTrustLine3,
                ], function (err, accounts) {
                    accounts.forEach(function(obj) { console.log(obj.secretKey + " " + obj.publicKey); });
                    console.log("Done");
                });

                function createAccount1(callback) {
                    stellarApi.createTestAccount("").then
                    (function(data){
                        var Acc = [];
                        Acc.push({"secretKey":data.secretKey, "publicKey":data.publicKey});                    
                        console.log("Acc 1 creaded");
                        callback(null, Acc);
                    },
                    function(err){
                        callback( err );
                    });
                }

                function createAccount2(accounts, callback) {
                    stellarApi.createTestAccount("").then(function(data){
                        accounts.push({"secretKey":data.secretKey, "publicKey":data.publicKey});
                        console.log("Accounts Created " + accounts.length);
                        callback(null, accounts);
                    },
                    function(err){
                        callback( err );
                    });
                }

                function restrictAccounts(accounts, callback){
                    var accs = [accounts[0]];

                    async.each(accs, function(acc, callback2) {
                        stellarApi.restrictAssetTrustLines(acc.secretKey).then(function(data){
                                  console.log(acc.publicKey + " has been restricted");
                                  callback2(null)
                              },
                              function(err){
                                  console.log(err);
                              }
                         );                    
                    }, function(err) {
                        callback(null, accounts);
                    });

                }

                function createTrustLines(accounts, callback) {
                    var accs = [accounts[1], accounts[2], accounts[3]];

                    async.each(accs, function(acc, callback2) {
                         stellarApi.createTrustLine(SecurityTokenID, accounts[0].publicKey, acc.secretKey).then
                         (function(data){
                             console.log(acc.publicKey + " trust line created");
                             callback2(null)
                         },
                         function(err){
                             console.log( err );
                         });                    

                    }, function(err) {
                        callback(null, accounts);
                    });
                }

                function AuthorizeTrustLine1(accounts, callback) {
                    stellarApi.AuthrorizeTrustLine(accounts[0].secretKey, accounts[1].publicKey, SecurityTokenID).then
                    (function(data){
                        console.log(accounts[1].publicKey + " has been authorized");
                        callback(null, accounts);
                    },
                    function(err){
                        console.log( err );
                    });                                 
                }

                function AuthorizeTrustLine2(accounts, callback) {

                              stellarApi.AuthrorizeTrustLine(accounts[0].secretKey, accounts[2].publicKey, SecurityTokenID).then
                              (function(data){
                                      console.log(accounts[2].publicKey + " has been authorized");
                                      callback(null, accounts);
                                 },
                                 function(err){
                                    console.log( err );
                                 }
                              );                                 

                }

                function AuthorizeTrustLine3(accounts, callback) {

                              stellarApi.AuthrorizeTrustLine(accounts[0].secretKey, accounts[3].publicKey, SecurityTokenID).then
                              (function(data){
                                      console.log(accounts[3].publicKey + " has been authorized");
                                      callback(null, accounts);
                                 },
                                 function(err){
                                    console.log( err );
                                 }
                              );                                 

                }

}

if (process.argv[2] == "test") {
    console.log(global.CONFIGFILE_DATA.Key_Eencription)
}

if (process.argv[2] == "AuthrorizeTrustLine") {

        //node StellarUtils AuthrorizeTrustLine
        //issuanceAccountPrivateKey, distributionAccountPublicKey, SecurityTokenID    
        
        stellarApi.AuthrorizeTrustLine("SCGS22Y3THUB7GM7EYIHTAT7CGJL2LCUQ5L45JJ46ZQUKUKBBWFX6XBW", "GB4SYVHM7ZK6IKCP3BBCPIUB2J66AXSP6TELSWVWPRK3G2LYMTOX4NTQ", "DigiShares" , true).then
        (function(data){
            console.log("Distribution Account trust line has been authorized");
        },
        function(err){
            console.log("authorized trust lines")
            console.log(err.message);
        });    
}





