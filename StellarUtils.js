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


/*
DigiShares
SCXVXOL47KUGUTWLM3QGGUIMSTNGX734AWSLQSDH77XAYP342XGCUKG5 GBVWPPICNVL636MBZH2IQTKCS7TKZUKMCPJYZBDYRFWEK3M62PWSX5PY  
SDWCKSMTCGWK2GEM55S2PFBOQW2OKGVENSX6JWAY457O5EDCASUDS54M GB4SYVHM7ZK6IKCP3BBCPIUB2J66AXSP6TELSWVWPRK3G2LYMTOX4NTQ 


SBED3WEAV4G5DEBJQIUK5FZ6NPKFWDFP57BFOY65WIME7OPHNVF3M5ZW GAWDBZQXT3RVWXTH3PQND2QENHIFEW6XDYOOEZS5W74XH6LWD24L7L6P


SANUGIDL3GJ2MVO4BCZBT7ZZW53NPYJLHI7IJ763WXKXQYZEKA2VFRWY GBMXKWQBZ5GCESECQAESK5JMCMNPJDWB4VAHZVGQOF53JIY3BOH67CJM 
SCMDRAMLNW7SI7JHNLXWP4FVOPPGTPDS3ICN7V7ZWZWFBW555C2TF3WB GDNQGB66RW4PJBVFWYGDXD7OS3P5ZTT4MZABWG3VIN7LM444GLHCJGI4
SCQCQNSQT6C4T7I2KOFUQ652NOAASV7G74ZS6MUWXD52WZDKDNHD7H7D GCVXPK6J3RK2WRIVEMQLXITEAN36QKYESB55MEJQJ76YEI6CNDDX2ALZ


*/



if (process.argv[2] == "InitializeDB" ) { }

if (process.argv[2] == "SetupIssuerDistributionAccount" ) {
    
    // node StellarUtils SetupIssuerDistributionAccount SCXVXOL47KUGUTWLM3QGGUIMSTNGX734AWSLQSDH77XAYP342XGCUKG5 GBVWPPICNVL636MBZH2IQTKCS7TKZUKMCPJYZBDYRFWEK3M62PWSX5PY SDWCKSMTCGWK2GEM55S2PFBOQW2OKGVENSX6JWAY457O5EDCASUDS54M GB4SYVHM7ZK6IKCP3BBCPIUB2J66AXSP6TELSWVWPRK3G2LYMTOX4NTQ DigiShares 100000

    var issuanceAccountPrivateKey = process.argv[3];
    var issuanceAccountPublicKey = process.argv[4];
    var distributionAccountPrivateKey = process.argv[5];
    var distributionAccountPublicKey = process.argv[6];
    var SecurityTokenID = process.argv[7];
    var InitialTokenSupply = process.argv[8];

          async.waterfall([
              restrictIssuanceAccount,
              createTrustLine,
              authorizeTrustLine,
              SendSecurityTokensToDistributionAccount,
              deleteDatabaseTableRecords,
              setAppParameters
          ], function (err) {
              console.log("Done ..");
          });      
          function restrictIssuanceAccount(callback){
                    
                stellarApi.restrictAssetTrustLines(issuanceAccountPrivateKey).then
                (function(data){
                    console.log("Issuance account has been restricted");
                    callback(null)
                },
                function(err){
                    console.log(err);
                    callback(err);
                });
                    
          }
          function createTrustLine(callback) {

                stellarApi.createTrustLine(SecurityTokenID, issuanceAccountPublicKey, distributionAccountPrivateKey).then
                (function(data){
                    console.log("Trust line created");
                    callback(null)
                },
                function(err){
                    console.log( err );
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
                    console.log(err);
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
                  console.log( err );
              });
          }
          function deleteDatabaseTableRecords(callback) {
                     async.each(["delete from investor", 
                                 "delete from app_parameters",
                                 "delete from investordocuments",
                                 "delete from logs",
                                ], 
                     function(stml, callback2) {
                          mysql.executeSQLStatement(stml, [])
                          .then(function(result) {
                                console.log("Database tables records deleted");
                                callback2(null);
                          })
                          .catch(function(error) {
                              callback(error);
                          });
                     }, function(err) {
                        callback(null);
                    });
          }
          function setAppParameters (callback) { 

                  var sqls = ["INSERT INTO app_parameters(Param, ValueString, ValueInt) VALUES('Total Token', '', " + InitialTokenSupply + ")", 
                              "INSERT INTO app_parameters(Param,ValueString,ValueInt) VALUES('Issuance', '" + issuanceAccountPublicKey + "', 0)",
                              "INSERT INTO app_parameters(Param,ValueString,ValueInt) VALUES('Distribution','" + distributionAccountPublicKey + "', " + InitialTokenSupply + ")",
                              "INSERT INTO app_parameters(Param,ValueString,ValueInt) VALUES('Token', '" + SecurityTokenID + "', 0)"
                              ];

                  async.each(sqls, function(stml, callback2) {
                      mysql.executeSQLStatement(stml, [])
                      .then(function(result) {
                            console.log("Parameter set");
                            callback2(null);
                      })
                      .catch(function(error) {
                            callback(error);
                      });
                  }, function(err) {
                        callback(null);
                  });
            }
          
}


if (process.argv[2] == "SetupIssuanceAccountThreshold" ) { }
if (process.argv[2] == "SetupIssuanceAccountOperationalAccount" ) { }

if (process.argv[2] == "SetupDistributionAccountThreshold" ) { }
if (process.argv[2] == "SetupDistributionAccountOperationalAccount" ) { }

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
    
    stellarApi.AuthrorizeTrustLine("SCXVXOL47KUGUTWLM3QGGUIMSTNGX734AWSLQSDH77XAYP342XGCUKG5", 
                                   "GB4SYVHM7ZK6IKCP3BBCPIUB2J66AXSP6TELSWVWPRK3G2LYMTOX4NTQ", 
                                   "DigiShares", "true")
    .then (function(data) {
        console.log("Authorized");
    },
    function(err){                        
        console.error( err.data.type );
    });

}

if (process.argv[2] == "SendToken" ) {
    
    // Command     node StellarUtils SendToken
    
    
    //distributionSourcePrivateKey, assetIssuerPublicKey, destinationPublicKey, assetCode, amountToSend
                    stellarApi.sendPayments("SCXVXOL47KUGUTWLM3QGGUIMSTNGX734AWSLQSDH77XAYP342XGCUKG5", 
                                            "GBVWPPICNVL636MBZH2IQTKCS7TKZUKMCPJYZBDYRFWEK3M62PWSX5PY", 
                                            "GB4SYVHM7ZK6IKCP3BBCPIUB2J66AXSP6TELSWVWPRK3G2LYMTOX4NTQ", 
                                            "DigiShares", 
                                            "100000").then
                    (function(data) {
                        console.log("Tokens transferred");
                    },
                    function(err){                        
                        console.log( err );
                    });

}


if (process.argv[2] == "CheckTrustLine" ) {
                    stellarApi.CheckTrustLine ( "GBQ5MGS62F3YWUM22UGNYU4GOOLNC3SISXBJFUPGBJG6NO563AP5E6SB", 
                                                "GAOKARROQ2DQC7BQ5G52JKHJPAX5H6QJON6Y6OBYWAMK742DTSVQKBKT", 
                                                "Eolian").then
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
                    stellarApi.createTestAccount("").then
                    (function(data){
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
                        stellarApi.restrictAssetTrustLines(acc.secretKey).then
                              (function(data){
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



/*



*/
