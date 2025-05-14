
const fs = require('fs');
const path = require('path');
const { Wallet } = require("ethers");


const password = 'myStrongPassword123!';
const privateKeyHex = '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce036f5b5d3362a65f7b6e3'; // Use your private key (64 hex chars)


var args = process.argv.slice(2);

// npx ts-node src/keystore.ts CreateKeyStoreFile
if(args[0] == "CreateKeyStoreFile" ) {


    (async () => {
        try {

            const wallet = new Wallet(privateKeyHex);

            const keystoreJson = await wallet.encrypt(password);
            const filepath = path.join("/home/shahzad", "TESTKEYSTORE.json");            
            console.log(  keystoreJson  )
            fs.writeFileSync(filepath, keystoreJson);
            
            console.log("Keystore file created.");


        } catch (err) {
          console.error(err);
        }
    })();

}

// npx ts-node src/keystore.ts OpenKeyStoreFile
if(args[0] == "OpenKeyStoreFile" ) {

    (async () => {
        try {


                const keystore = fs.readFileSync("/home/shahzad/TESTKEYSTORE.json", "utf8");

                try {
                    const wallet = await Wallet.fromEncryptedJson(keystore, password);
                    console.log("Address:", wallet.address);
                    console.log("Private Key:", wallet.privateKey); // <-- This is what you want
                  } catch (err: any) {
                    console.error("Failed to decrypt keystore:", err.message);
                }
                

    } catch (err) {
        console.error(err);
        }
    })();                

}

// npx ts-node src/keystore.ts CreatePrivateKey
if(args[0] == "CreatePrivateKey" ) {

    const wallet = Wallet.createRandom();

    console.log("Address:     ", wallet.address);
    console.log("Private Key: ", wallet.privateKey);
    console.log("Mnemonic:    ", wallet.mnemonic.phrase); // optional    

}

