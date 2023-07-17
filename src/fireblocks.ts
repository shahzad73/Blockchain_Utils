import fs, { appendFileSync } from "fs";
import path from "path";
const { FireblocksSDK } = require('fireblocks-sdk');


var args = process.argv.slice(2);


const baseUrl = "https://sandbox-api.fireblocks.io";
const apiSecret = fs.readFileSync(path.resolve("./src/FireBlocks_Secret.key"), "utf8");
const fireblocks = new FireblocksSDK(apiSecret, "b2569cf1-bc7c-408d-80f4-ddb1b30d9294", baseUrl);



if(args[0] == "testConn" )
    testConnection();
if(args[0] == "accountList" )
    getAccountsList()
if(args[0] == "getBalanceByAsset" )
    getBalanceByAsset()
if(args[0] == "getAssetPublicKey" )
    getAssetPublicKey()
if(args[0] == "getDepositAddresses" )
    getDepositAddresses();
if(args[0] == "getVaultAccountById" )
    getVaultAccountById();
    

//   Default Valut Accout ID is   0    always use 0 for default Vault Account ID in following API 
//   0 is the default Valut ID     in fireblocks the top level is Vault and it contains assets with ID
//   0 can also be string in parameter like   "0"

// npx ts-node src/fireblocks.ts testConn
async function testConnection() {

    //const internalWallets = await fireblocks.getInternalWallets();
    //console.log( JSON.stringify( internalWallets ) );

}

// npx ts-node src/fireblocks.ts getVaultAccountById
async function getVaultAccountById() {
    // 0 or "0" is the Valut account id 
    const vaultAccount = await fireblocks.getVaultAccountById("0");
    console.log( JSON.stringify( vaultAccount ) );
}

// npx ts-node src/fireblocks.ts accountList
async function getAccountsList() {
    // As i have only one Valut in my test account and all assets are setup in this Valut
    // the following command will list all current assets in default Valut 
    // Notice as there is only one Vault then this command will return all accounts within it
    // If we have multiple Valuts they will be in the JSON as list  and the default Valut account list is on JSON index 0
    // That is why default Valut ID is 0     so use 0 for default valut id 

    const vaultAccounts = await fireblocks.getVaultAccountsWithPageInfo([]);

    console.log( JSON.stringify( vaultAccounts) );
}

// npx ts-node src/fireblocks.ts getBalanceByAsset
async function getBalanceByAsset() {
    const assetsBalance = await fireblocks.getVaultBalanceByAsset("KK11_POLYGON_TEST_MUMBAI_YFHO");
    console.log( JSON.stringify( assetsBalance) );
}

// npx ts-node src/fireblocks.ts getAssetPublicKey
async function getAssetPublicKey() {

    console.log("........1")
    const vaultAsset = await fireblocks.refreshVaultAssetBalance("0", "KK11_POLYGON_TEST_MUMBAI_YFHO");
    console.log( JSON.stringify(vaultAsset)  )


    console.log("........2")        
    const PublicKeyInfoForVaultAccountArgs = {
        assetId: 'KK11_POLYGON_TEST_MUMBAI_YFHO',
        vaultAccountId: '0',
        change: 0,
        addressIndex: 0
    }
    const pubKey = await fireblocks.getPublicKeyInfoForVaultAccount(PublicKeyInfoForVaultAccountArgs);

    console.log( JSON.stringify(pubKey) );
}

// npx ts-node src/fireblocks.ts getDepositAddresses
async function getDepositAddresses() {
    // 0 is the default Valut ID     in fireblocks the top level is Vault and it contains assets with ID
    // so the parameters are  Valut ID and asset ID in following 

    const depositAddresses = await fireblocks.getDepositAddresses(0, "KK11_POLYGON_TEST_MUMBAI_YFHO");
    console.log( JSON.stringify( depositAddresses ) );

}

