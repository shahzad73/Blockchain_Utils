'use strict'  

var dotenv =  require('dotenv')
dotenv.load({path: __dirname + '/config.txt'});

const async = require('async');
const mysql = require("./modules/mysql");
const ethereum = require("./modules/ethereum");
const fs = require('fs');


if (process.argv[2] == "EncryptKey") {
    
    // node EthereumUtils EncryptKey 0x6f94fb1eb8bdf8101f7ddf3a5f720f390bf69914fa3b28a4df605f49de762218 Allahis1 f:\fil1.txt

     var data = ethereum.encryptKey(process.argv[3], process.argv[4]); 
     fs.writeFileSync(process.argv[5], JSON.stringify(data));
}




if (process.argv[2] == "DecryptKey") {
    // node EthereumUtils DecryptKey Allahis1 f:\fil1.txt
    
    let data = fs.readFileSync(process.argv[4], 'utf8')
    let data2 = ethereum.decryptKey(data, process.argv[3]);
    console.log(data2.privateKey);
    console.log(data2.address);
}





if (process.argv[2] == "test") {
    
    //node EthereumUtils test
    
    ethereum.sendTransaction();
            
}







function showResults(knexObject) {
    
    knexObject.then(function(data){  
        console.log(data);  
    })
    
}




