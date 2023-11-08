import fs, { appendFileSync } from "fs";
import path from "path";
const { FireblocksSDK } = require('fireblocks-sdk');

import { BigNumber, Polymesh } from "@polymeshassociation/polymesh-sdk";
import { Asset } from "@polymeshassociation/polymesh-sdk/api/entities/Asset";
import { FireblocksSigningManager } from "@polymeshassociation/fireblocks-signing-manager";
import { LocalSigningManager } from "@polymeshassociation/local-signing-manager";
import { PeerType, TransactionArguments } from "fireblocks-sdk";
import { ClaimType, ConditionTarget, ConditionType, KnownAssetType, ScopeType, Venue, VenueType } from "@polymeshassociation/polymesh-sdk/types";
import { TEZOS_NETWORK } from "@tangany/waas";

import { Compliance } from "@polymeshassociation/polymesh-sdk/api/entities/Asset/Compliance";
import { Requirements } from "@polymeshassociation/polymesh-sdk/api/entities/Asset/Compliance/Requirements";

import { Identities } from "@polymeshassociation/polymesh-sdk/api/client/Identities";
import { AssetHolders } from "@polymeshassociation/polymesh-sdk/api/entities/Asset/AssetHolders"
import { Entity } from "@polymeshassociation/polymesh-sdk/api/entities/Entity";

import { FireblocksWeb3Provider, ChainId } from "@fireblocks/fireblocks-web3-provider";
import Web3 from "web3";


const ERC20ABI = require("./erc20ABI.json");


var args = process.argv.slice(2);

const baseUrl = "https://sandbox-api.fireblocks.io";
const apiSecret2 = fs.readFileSync(path.resolve("./src/FireBlocks_Secret.key"), "utf8");
console.log(apiSecret2);
const fireblocks = new FireblocksSDK(apiSecret2, "b2569cf1-bc7c-408d-80f4-ddb1b30d9294", baseUrl);



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
if(args[0] == "refreshVaultAssetBalance" )
    refreshVaultAssetBalance();
if(args[0] == "createVaultAccount" )    
    createVaultAccount();
if(args[0] == "link_A_ERC20Token_With_A_Valut" )    
    link_A_ERC20Token_With_A_Valut();
if(args[0] == "getSupportedAssets" )    
    getSupportedAssets()
if(args[0] == "generateNewAddress" )    
    generateNewAddress()
if(args[0] == "createContractWallet" )    
	createContractWallet()
if(args[0] == "createContractWalletAsset" )    
	createContractWalletAsset()
if(args[0] == "createContractWalletAsset" )    
	getContractWallet()
if(args[0] == "sendTransactions2" )    
	sendTransactions2()
if(args[0] == "validate_address" )    
	validate_address()
if(args[0] == "executeERC20TransactionWithFireBlocksProvider" )    
	executeERC20TransactionWithFireBlocksProvider()



// Polymesh
if(args[0] == "getPolymeshAccountAddress" )    
	getPolymeshAccountAddress()
if(args[0] == "registerPolyMeshTicker" )    
	registerPolyMeshTicker()
if(args[0] == "getAccountPolyXBalance" )    
	getAccountPolyXBalance()
if(args[0] == "deployPolyMeshAsset" )    
	deployPolyMeshAsset()
if(args[0] == "getPolyMeshAccountBalance" )    
	getPolyMeshAccountBalance()
if(args[0] == "getPolymeshTokenDetails" )    
	getPolymeshTokenDetails()
if(args[0] == "isPolymeshAddressWhitelisted" )    
	isPolymeshAddressWhitelisted()
if(args[0] == "setTokenRestrictions" )    
	setTokenRestrictions()
if(args[0] == "setAtestationProvider" )    
	setAtestationProvider()
if(args[0] == "isPolymeshIdentityValid" )    
	isPolymeshIdentityValid()
if(args[0] == "getCurrentAssetHoldersPolymesh" )    
	getCurrentAssetHoldersPolymesh()
if(args[0] == "getPolymeshAccountDIDDetails" )    
	getPolymeshAccountDIDDetails()
if(args[0] == "transferPolymeshShares" )    
	transferPolymeshShares()  
if(args[0] == "whitelistPolymeshAddress" )    	
	whitelistPolymeshAddress()	


//   Default Valut Accout ID is   0    always use 0 for default Vault Account ID in following API 
//   0 is the default Valut ID     in fireblocks the top level is Vault and it contains assets with ID
//   0 can also be string in parameter like   "0"

// if you add a ERC20 asset then it is added in all Valuts i guess    now each Valut has it's own 
// public address called deposit address for that asset    to retrive that deposit address call 
// getDepositAddresses with Valut account id


// npx ts-node src/fireblocks.ts testConn
async function testConnection() {

    //const internalWallets = await fireblocks.getInternalWallets();
    //console.log( JSON.stringify( internalWallets ) );

}

// npx ts-node src/fireblocks.ts getVaultAccountById
async function getVaultAccountById() {
    // 0 or "0" is the default Valut account id 
    const vaultAccount = await fireblocks.getVaultAccountById("0");
    console.log( JSON.stringify( vaultAccount ) );

    /*

{
	"id": "0",
	"name": "Default",
	"hiddenOnUI": false,
	"autoFuel": false,
	"assets": [{
		"id": "BTC_TEST",
		"total": "0",
		"balance": "0",
		"lockedAmount": "0",
		"available": "0",
		"pending": "0",
		"frozen": "0",
		"staked": "0",
		"blockHeight": "-1"
	}, {
		"id": "ETH_TEST3",
		"total": "0.1",
		"balance": "0.1",
		"lockedAmount": "0",
		"available": "0.1",
		"pending": "0",
		"frozen": "0",
		"staked": "0",
		"blockHeight": "9291333",
		"blockHash": "0x161ab6de81c7eacd0072a95b03f168e3780d48d1b2fd1d111a513135fc348231"
	}, {
		"id": "KK11_POLYGON_TEST_MUMBAI_YFHO",
		"total": "0",
		"balance": "0",
		"lockedAmount": "0",
		"available": "0",
		"pending": "0",
		"frozen": "0",
		"staked": "0",
		"blockHeight": "37954595"
	}, {
		"id": "MATIC_POLYGON_MUMBAI",
		"total": "0",
		"balance": "0",
		"lockedAmount": "0",
		"available": "0",
		"pending": "0",
		"frozen": "0",
		"staked": "0",
		"blockHeight": "37923137"
	}]
}    

    */
}

// npx ts-node src/fireblocks.ts createVaultAccount
async function createVaultAccount() {
    const vaultAccount = await fireblocks.createVaultAccount("TestAccount3", false, "", false);
    console.log( JSON.stringify(vaultAccount));

    //  {"id":"2","name":"TestAccount2","hiddenOnUI":false,"assets":[],"autoFuel":false,"customerRefId":""}
}

// npx ts-node src/fireblocks.ts accountList
async function getAccountsList() {
    // As i have only one Valut in my test account and all assets are setup in this Valut
    // the following command will list all current assets in default Valut 
    // Notice as there is only one Vault then this command will return all accounts within it
    // If we have multiple Valuts they will be in the JSON as list  and the default Valut account list is on JSON index 0
    // That is why default Valut ID is 0     so use 0 for default valut id 

    const vaultAccounts = await fireblocks.getVaultAccountsWithPageInfo([]);

    //console.log( JSON.stringify( vaultAccounts) );

	vaultAccounts.accounts.forEach((obj: any) => {
		console.log(obj.id);
		console.log(obj.name);		
	})

    /*
    {
	"accounts": [{
		"id": "0",
		"name": "Default",
		"hiddenOnUI": false,
		"autoFuel": false,
		"assets": [{
			"id": "BTC_TEST",
			"total": "0",
			"balance": "0",
			"lockedAmount": "0",
			"available": "0",
			"pending": "0",
			"frozen": "0",
			"staked": "0",
			"blockHeight": "-1"
		}, {
			"id": "ETH_TEST3",
			"total": "0.1",
			"balance": "0.1",
			"lockedAmount": "0",
			"available": "0.1",
			"pending": "0",
			"frozen": "0",
			"staked": "0",
			"blockHeight": "9291333",
			"blockHash": "0x161ab6de81c7eacd0072a95b03f168e3780d48d1b2fd1d111a513135fc348231"
		}, {
			"id": "KK11_POLYGON_TEST_MUMBAI_YFHO",
			"total": "0",
			"balance": "0",
			"lockedAmount": "0",
			"available": "0",
			"pending": "0",
			"frozen": "0",
			"staked": "0",
			"blockHeight": "37954595"
		}, {
			"id": "MATIC_POLYGON_MUMBAI",
			"total": "0",
			"balance": "0",
			"lockedAmount": "0",
			"available": "0",
			"pending": "0",
			"frozen": "0",
			"staked": "0",
			"blockHeight": "37923137"
		}]
	}],
	"paging": {}
    }




    Now this list has 2 accounts (Vaults)       notice id is numeric or string and 
    default account has 0 while new accounts are numbered accordingly 1, 2, 3

    {
	"accounts": [{
		"id": "1",
		"name": "TestAccount",
		"hiddenOnUI": false,
		"autoFuel": false,
		"assets": []
	}, {
		"id": "0",
		"name": "Default",
		"hiddenOnUI": false,
		"autoFuel": false,
		"assets": [{
			"id": "BTC_TEST",
			"total": "0",
			"balance": "0",
			"lockedAmount": "0",
			"available": "0",
			"pending": "0",
			"frozen": "0",
			"staked": "0",
			"blockHeight": "-1"
		}, {
			"id": "ETH_TEST3",
			"total": "0.1",
			"balance": "0.1",
			"lockedAmount": "0",
			"available": "0.1",
			"pending": "0",
			"frozen": "0",
			"staked": "0",
			"blockHeight": "9291333",
			"blockHash": "0x161ab6de81c7eacd0072a95b03f168e3780d48d1b2fd1d111a513135fc348231"
		}, {
			"id": "KK11_POLYGON_TEST_MUMBAI_YFHO",
			"total": "0",
			"balance": "0",
			"lockedAmount": "0",
			"available": "0",
			"pending": "0",
			"frozen": "0",
			"staked": "0",
			"blockHeight": "38028563"
		}, {
			"id": "MATIC_POLYGON_MUMBAI",
			"total": "0",
			"balance": "0",
			"lockedAmount": "0",
			"available": "0",
			"pending": "0",
			"frozen": "0",
			"staked": "0",
			"blockHeight": "37923137"
		}]
	}],
	"paging": {}
}

    */
}

// npx ts-node src/fireblocks.ts getBalanceByAsset
async function getBalanceByAsset() {
    const assetsBalance = await fireblocks.getVaultBalanceByAsset("KK11_POLYGON_TEST_MUMBAI_YFHO");
    console.log( JSON.stringify( assetsBalance) );

/*
{
	"id": "KK11_POLYGON_TEST_MUMBAI_YFHO",
	"total": 0,
	"pending": 0,
	"lockedAmount": 0,
	"available": "0",
	"frozen": 0,
	"totalStakedCPU": null,
	"totalStakedNetwork": null,
	"selfStakedCPU": null,
	"selfStakedNetwork": null,
	"pendingRefundCPU": null,
	"pendingRefundNetwork": null,
	"blockHeight": "37954595",
	"blockHash": null
}
*/
}

// npx ts-node src/fireblocks.ts getAssetPublicKey
async function getAssetPublicKey() {

    const PublicKeyInfoForVaultAccountArgs = {
        assetId: 'KK11_POLYGON_TEST_MUMBAI_YFHO',
        vaultAccountId: '3',
        change: 0,
        addressIndex: 0
    }
    const pubKey = await fireblocks.getPublicKeyInfoForVaultAccount(PublicKeyInfoForVaultAccountArgs);

    console.log( JSON.stringify(pubKey) );

/*
{
	"status": 0,
	"algorithm": "MPC_ECDSA_SECP256K1",
	"derivationPath": [44, 1, 0, 0, 0],
	"publicKey": "047045dbf0b44f57b0b7902fa26d85950671179585937d5948efa3d0cb33cb69bfab07352ba2c2b034258e4a853174f659a42a06ef03cb9874035608238b7ca67d"
}
*/
}

// npx ts-node src/fireblocks.ts refreshVaultAssetBalance
async function refreshVaultAssetBalance() {
    const vaultAsset = await fireblocks.refreshVaultAssetBalance("1", "TT11_POLYGON_TEST_MUMBAI_JOWK");
    console.log( JSON.stringify(vaultAsset)  )

    /*
        {
            "id": "KK11_POLYGON_TEST_MUMBAI_YFHO",
            "total": "0",
            "pending": "0",
            "frozen": "0",
            "lockedAmount": "0",
            "blockHeight": "38028563",
            "available": "0"
        }
    */
}

// npx ts-node src/fireblocks.ts getDepositAddresses    
async function getDepositAddresses() {
    // 0 is the default Valut ID     in fireblocks the top level is Vault and it contains assets with ID
    // so the parameters are  Valut ID and asset ID in following 

    const depositAddresses = await fireblocks.getDepositAddresses(3, "TT11_POLYGON_TEST_MUMBAI_JOWK");
    console.log( JSON.stringify( depositAddresses ) );

    /*
        [{
            "assetId": "KK11_POLYGON_TEST_MUMBAI_YFHO",
            "address": "0xaDFeDe6D4D62023E904234B5dBAB60f648abFA6a",
            "tag": "",
            "description": "",
            "type": "Permanent",
            "legacyAddress": "",
            "enterpriseAddress": "",
            "bip44AddressIndex": 0,
            "userDefined": false
        }]

    */
}

// npx ts-node src/fireblocks.ts link_A_ERC20Token_With_A_Valut
async function link_A_ERC20Token_With_A_Valut() {
    
        // Define the asset details
        const assetName = "TT11";
        const assetSymbol = "TT11";
        const contractAddress = "0xbB48BFE6F2A8EED1D889488e9B683757487A8Eb6"; 

        // Create the ERC20 asset
        const erc20Asset = {
            assetType: "ERC20",
            name: assetName,
            symbol: assetSymbol,
            contractAddress: contractAddress,
        };

        console.log("0.  Asset Creating ...")
        // Create the asset in Fireblocks
        FireblocksSDK.createAsset(erc20Asset).then((createdAsset: { assetId: any; }) => {
            // Retrieve the vault details
            console.log("1.  Asset Created")
            const vaultId = "1"; // Replace with the actual vault ID
            return FireblocksSDK.getVault(vaultId).then((vault: { linkAsset: (arg0: any) => void; }) => {
                // Link the asset to the vault
                vault.linkAsset(createdAsset.assetId);

                // Update the vault
                return FireblocksSDK.updateVault(vault);
            });
        })
        .then(() => {
            console.log("Asset created and linked to the vault successfully!");
        })
        .catch((error: any) => {
            console.error("An error occurred:", error);
        });    


}

// npx ts-node src/fireblocks.ts getSupportedAssets
async function getSupportedAssets() {
    const supportedAssets = await fireblocks.getSupportedAssets();
    console.log( JSON.stringify(supportedAssets) )


}

// npx ts-node src/fireblocks.ts generateNewAddress     not working
async function generateNewAddress() {
    try {
        const address = await fireblocks.generateNewAddress("2", "TT11_POLYGON_TEST_MUMBAI_JOWK");

        console.log( JSON.stringify( address ) );

    } catch (e:any) {
        console.log(e.toString())
    }

}


// npx ts-node src/fireblocks.ts createContractWallet
async function createContractWallet() {
	const contracts = await fireblocks.createContractWallet("TestContractWallet");

	console.log( JSON.stringify(contracts) );

	//{"id":"43148acd-57f7-48d5-82cd-2695d491c6db","name":"TestContractWallet","assets":[]}
}


// npx ts-node src/fireblocks.ts createContractWalletAsset
async function createContractWalletAsset() {

	const contracts = await fireblocks.createContractWalletAsset("1", "43148acd-57f7-48d5-82cd-2695d491c6db", "0xbB48BFE6F2A8EED1D889488e9B683757487A8Eb6");

	console.log( JSON.stringify(contracts) );

}


// npx ts-node src/fireblocks.ts getContractWallet
async function getContractWallet() {
	const result = await fireblocks.getContractWallet("43148acd-57f7-48d5-82cd-2695d491c6db");

	console.log( JSON.stringify(result) );
}


// npx ts-node src/fireblocks.ts sendTransactions2     send ERC20 token to external wallet 
async function sendTransactions2() {

	try {
		const payload: TransactionArguments = {
			assetId: "TT11_POLYGON_TEST_MUMBAI_JOWK",
			source: {
				type: PeerType.VAULT_ACCOUNT,
				id: "1"
			},
			destination: {
				type: PeerType.ONE_TIME_ADDRESS,
				oneTimeAddress: {
					address: "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300"
				}				
			},
			amount: "25",
			note: "Created by fireblocks SDK"
		};
		

		const result = await fireblocks.createTransaction(payload);

		console.log( JSON.stringify(result) );
	} catch (e: any) {
		console.log( ".." + e.toString() )
	}

}

// npx ts-node src/fireblocks.ts validate_address
async function validate_address() {
	const result = await fireblocks.validateAddress("TT11_POLYGON_TEST_MUMBAI_JOWK", "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300");
	//const result = await fireblocks.getFeeForAsset("TT11_POLYGON_TEST_MUMBAI_JOWK");
	console.log( JSON.stringify(result) );
}

// npx ts-node src/fireblocks.ts executeERC20TransactionWithFireBlocksProvider
async function executeERC20TransactionWithFireBlocksProvider() {

	const eip1193Provider = new FireblocksWeb3Provider({
		apiBaseUrl: baseUrl, // If using a sandbox workspace
		privateKey: apiSecret2,
		apiKey: "b2569cf1-bc7c-408d-80f4-ddb1b30d9294",
		vaultAccountIds: 1,
		chainId: ChainId.SEPOLIA
	})

	console.log( ChainId.SEPOLIA );

	const web3 = new Web3(eip1193Provider);

	const CONTRACT_ADDRESS = "0x52FBFB2849C422ef06F7E9557d13b7cb1493e9Fa"

	const myAddr = await web3.eth.getAccounts()

	console.log( myAddr[0] );

	const contract = new web3.eth.Contract(ERC20ABI, CONTRACT_ADDRESS);

    console.log(
        await contract.methods.symbol().call()
    )

	/*  Executing a transaction
        await contract.methods.approve(spenderAddr, amount).send({
            from: myAddr[0]
        })
	*/
}




async function getPolyMeshConnectionObject() {

    /*const signingManager = await LocalSigningManager.create({
		accounts: [{ mnemonic: "riot arm extra another way tumble clump between city pottery chronic lumber" }],
	});*/


	const signingManager = await FireblocksSigningManager.create({
		apiKey: 'b2569cf1-bc7c-408d-80f4-ddb1b30d9294',	
		url: 'https://sandbox-api.fireblocks.io',
		//secretPath: './src/FireBlocks_Secret.key',
		secret: apiSecret2,
		// third parameter is  the Fireblocks vault    0=Default and so on
		derivationPaths: [[44, 595, 1, 0, 0]]
	});


	const api = await Polymesh.connect({
        nodeUrl: "wss://testnet-rpc.polymesh.live",
        middlewareV2: {
          link: "testnet-graphql.polymesh.live",
          key: "nBdcFXMFXLawqrh4STJG69IlVCp1Psve4qq0wfpe",
        },
        signingManager: signingManager,
    });


	return { 
		api,
		signingManager
	}

}

// npx ts-node src/fireblocks.ts getPolymeshAccountAddress
async function getPolymeshAccountAddress() {

	const conectionObj = await getPolyMeshConnectionObject();

	const keyInfo = await conectionObj.signingManager.deriveAccount([44, 595, 1, 0, 0]) // derive another key to sign with

	console.log( keyInfo )

	console.log("connected")

	/*
		Valut 0 
		{
			status: 0,
			algorithm: 'MPC_EDDSA_ED25519',
			derivationPath: [ 44, 595, 0, 0, 0 ],
			publicKey: '9d9aa6dcb1de1f03b8fa041eb245206257074eb8fa9f14b6d68ca3b4d0995b17',
			address: '5FdMKJ67Ctwxn3ccTKLWZgLzjPPfpSCD4219Ys9Him8A298p'
		}

		Vault 1
		did of this account is     0x8ed7eda50071c9c4a3bc89571ded344f4a5d81d06453d134e846130426ea9720
		{
			status: 0,
			algorithm: 'MPC_EDDSA_ED25519',
			derivationPath: [ 44, 595, 1, 0, 0 ],
			publicKey: 'dc96f093897a380fdf90871c06d5713786f18d91041c3d4fd1936b16edb4d771',
			address: '5H3wEJsZg17ezuaipH5BAoyjEwHVnkxVSeUKELQhgcbo7F5A'
		}

	*/

}

async function executePolymeshOperation() {

	const conectionObj = await getPolyMeshConnectionObject();

	const fireblocksKeyInfo = { address: '5FdMKJ67Ctwxn3ccTKLWZgLzjPPfpSCD4219Ys9Him8A298p', };

	const fireblocksAccount = await conectionObj.api.accountManagement.getAccount({ address: fireblocksKeyInfo.address,});

	const authorization = await fireblocksAccount.authorizations.getOne({
		id: new BigNumber(12345), // If authorization ID is known replace it here otherwise use `.getReceived()`
	});

	const acceptTx = await authorization.accept({ signingAccount: fireblocksKeyInfo.address, });

	acceptTx.run();

}

// npx ts-node src/fireblocks.ts registerPolyMeshTicker
//const ticker: string = "TKTEST00002"
const ticker: string = "TSTTOC03";
async function registerPolyMeshTicker() {

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	console.log( `Creating - ${ticker}` )

	const reservationQ = await api.assets.reserveTicker({
	  ticker: ticker,
	});
	const reservation = await reservationQ.run();


	console.log("done");


	// TKTEST00001
}

// npx ts-node src/fireblocks.ts deployPolyMeshAsset
async function deployPolyMeshAsset() {
	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const reservationQ = await api.assets.getTickerReservation ({
		ticker: ticker,
	  });

	const creationQ = await reservationQ.createAsset({
		name: ticker.toUpperCase(),
		isDivisible: true,
		assetType: KnownAssetType.Derivative,
		initialSupply: new BigNumber("100000"),
	});

	await creationQ.run();
	const identity = (await api.getSigningIdentity())!;
	const addTemp = identity.did;

	const venueQ = await api.settlements.createVenue({
		description: `${ticker.toUpperCase()}DistributionVenue`,
		type: VenueType.Distribution,
	});
	const venue = await venueQ.run();

	console.log( { did: addTemp, venueID: venue.id.toNumber() }  );

	/*{
		did: '0x8ed7eda50071c9c4a3bc89571ded344f4a5d81d06453d134e846130426ea9720',
		venueID: 1554
	}*/
	  
}

// npx ts-node src/fireblocks.ts getPolyMeshAccountBalance
async function getPolyMeshAccountBalance() {
	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const idds = await api.identities.getIdentity({ did: "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272" });

	const balance = await idds.getAssetBalance({
	  ticker: ticker.toUpperCase(),
	});
    
	console.log( balance.toNumber() );	
}

// npx ts-node src/fireblocks.ts getPolymeshTokenDetails
async function getPolymeshTokenDetails() {
	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;


	const asset: Asset = await api.assets.getAsset({
		ticker: ticker.toUpperCase(),
	});
	
	const det = await asset.details();

	console.log( det );

	console.log( det.totalSupply.toString() )


/*
{
  assetType: 'Derivative',
  isDivisible: true,
  name: 'TKTEST00002',
  owner: <ref *1> Identity {
    uuid: 'SWRlbnRpdHk6eyJkaWQiOiIweDhlZDdlZGE1MDA3MWM5YzRhM2JjODk1NzFkZWQzNDRmNGE1ZDgxZDA2NDUzZDEzNGU4NDYxMzA0MjZlYTk3MjAifQ==',
    context: Context {
      isDisconnected: false,
      isArchiveNode: true,
      _middlewareApi: null,
      _middlewareApiV2: [ApolloClient],
      _polymeshApi: [ApiPromise],
      polymeshApi: [ApiPromise],
      ss58Format: [BigNumber],
      _signingManager: [FireblocksSigningManager],
      signingAddress: '5H3wEJsZg17ezuaipH5BAoyjEwHVnkxVSeUKELQhgcbo7F5A'
    },
    did: '0x8ed7eda50071c9c4a3bc89571ded344f4a5d81d06453d134e846130426ea9720',
    authorizations: IdentityAuthorizations {
      parent: [Circular *1],
      context: [Context]
    },
    portfolios: Portfolios {
      parent: [Circular *1],
      context: [Context],
      delete: [Function]
    },
    assetPermissions: AssetPermissions {
      parent: [Circular *1],
      context: [Context],
      waive: [Function],
      setGroup: [Function]
    }
  },
  totalSupply: BigNumber { s: 1, e: 5, c: [ 100000 ] },
  fullAgents: [
    Identity {
      uuid: 'SWRlbnRpdHk6eyJkaWQiOiIweDhlZDdlZGE1MDA3MWM5YzRhM2JjODk1NzFkZWQzNDRmNGE1ZDgxZDA2NDUzZDEzNGU4NDYxMzA0MjZlYTk3MjAifQ==',
      context: [Context],
      did: '0x8ed7eda50071c9c4a3bc89571ded344f4a5d81d06453d134e846130426ea9720',
      authorizations: [IdentityAuthorizations],
      portfolios: [Portfolios],
      assetPermissions: [AssetPermissions]
    }
  ],
  requiresInvestorUniqueness: false
}

*/

}

// npx ts-node src/fireblocks.ts getAccountPolyXBalance
async function getAccountPolyXBalance() {

	const conectionObj = await getPolyMeshConnectionObject();

	const keyInfo = await conectionObj.signingManager.deriveAccount([44, 595, 1, 0, 0]) // derive another key to sign with

	const data = await conectionObj.api.accountManagement.getAccountBalance({account: keyInfo.address});
	//const data = await conectionObj.api.accountManagement.getAccountBalance({account: "5H3wEJsZg17ezuaipH5BAoyjEwHVnkxVSeUKELQhgcbo7F5A"});

	console.log( data.total.toString() );

}

// npx ts-node src/fireblocks.ts isPolymeshAddressWhitelisted
async function isPolymeshAddressWhitelisted() {

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const asset: Asset = await api.assets.getAsset({
	  ticker: ticker.toUpperCase(),
	});


	const data = await asset.settlements.canTransfer({
	  to: "0xdc96f093897a380fdf90871c06d5713786f18d91041c3d4fd1936b16edb4d771",
	  amount: new BigNumber("1".toString()),
	});
  
	console.log( data.result );

}

// npx ts-node src/fireblocks.ts setTokenRestrictions
async function setTokenRestrictions() {

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const restrictions = [];
  
	const token: Asset = await api.assets.getAsset({ ticker: ticker });

	const userIdentity = (await api.getSigningIdentity())!;
	const compliance: Compliance = token.compliance;
	const requirements: Requirements = compliance.requirements;	

    restrictions.push({
		target: ConditionTarget.Receiver,
		type: ConditionType.IsPresent,
		claim: {
		  type: ClaimType.Accredited,
		  scope: {
			type: ScopeType.Ticker,
			value: token.ticker,
		  },
		},
		trustedClaimIssuers: [
		  {
			identity: userIdentity.did,
			trustedFor: [ClaimType.Accredited],
		  },
		],
	  });

	restrictions.push({
		target: ConditionTarget.Receiver,
		type: ConditionType.IsPresent,
		claim: {
		  type: ClaimType.KnowYourCustomer,
		  scope: {
			type: ScopeType.Ticker,
			value: token.ticker,
		  },
		},
		trustedClaimIssuers: [
		  {
			identity: userIdentity.did,
			trustedFor: [ClaimType.KnowYourCustomer],
		  },
		],
	  });	  



	  const cc = JSON.parse(`[${JSON.stringify(restrictions)}]`);
	  try {
		const que = await requirements.set({
		  requirements: cc,
		});
		await que.run();
	  } catch (e: any) {
		// console.log( e.message );
	  }


	  console.log(" Restrictions Set ")

}

// npx ts-node src/fireblocks.ts setAtestationProvider
async function setAtestationProvider() {

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const asset: Asset = await api.assets.getAsset({ ticker: ticker });

	const restrictions = [];
	console.log("test 1")
	restrictions.push(ClaimType.Accredited);
	restrictions.push(ClaimType.KnowYourCustomer);

	  const t1 = {
		claimIssuers: [
		  {
			identity: "0x8ed7eda50071c9c4a3bc89571ded344f4a5d81d06453d134e846130426ea9720",
			trustedFor: restrictions,
		  },
		],
	  };

	  const addClaimIssuerQueue = await asset.compliance.trustedClaimIssuers.add(
		t1
	  );

	  try {
	  	await addClaimIssuerQueue.run();	
	  } catch (e:any) {
		 console.log(e.toString())
	  }

	  console.log("Attestation Added");
}

// npx ts-node src/fireblocks.ts isPolymeshIdentityValid 
async function isPolymeshIdentityValid() {

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const val = await api.identities.isIdentityValid({identity: "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"});

	console.log(val);

}

// npx ts-node src/fireblocks.ts getCurrentAssetHoldersPolymesh 
async function getCurrentAssetHoldersPolymesh() {
	//api/entities/Asset/AssetHolders.AssetHolders

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const asset: Asset = await api.assets.getAsset({
		ticker: ticker.toUpperCase(),
	});

	const val = await asset.assetHolders.get();

	val.data.forEach(obj => {
		console.log( obj.balance.toString(), "  ", obj.identity.did );
	})

}

// npx ts-node src/fireblocks.ts getPolymeshAccountDIDDetails 
async function getPolymeshAccountDIDDetails() {

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const val = await api.accountManagement.getAccount({address: "5H3wEJsZg17ezuaipH5BAoyjEwHVnkxVSeUKELQhgcbo7F5A"});

	const val2 = await val.getIdentity()

	console.log( val2!.did );



	// i guess you can also get identity of current account as 
	const identity = (await api.getSigningIdentity())!;
	const addTemp = identity.did;
	console.log(addTemp);

}

// npx ts-node src/fireblocks.ts whitelistPolymeshAddress 
async function whitelistPolymeshAddress() {

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const nextYear = new Date();
	nextYear.setFullYear(nextYear.getFullYear() + 200);


	var claimsJSON: any = {"claims": [

		{
			"claim": {
				"type": ClaimType.KnowYourCustomer,
				"scope": {
					"type": "Ticker",
					"value": ticker
				}
			},
			"expiry": nextYear,
			"target": "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"
		}, 

		{
			"claim": {
				"type": ClaimType.Accredited,
				"scope": {
					"type": "Ticker",
					"value": ticker
				}
			},
			"expiry": nextYear,
			"target": "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"
		}

	]};


	const claimQueue = await api.claims.addClaims(claimsJSON);
	await claimQueue.run();

	console.log("whitelisted - claim added")
}

// npx ts-node src/fireblocks.ts transferPolymeshShares 
async function transferPolymeshShares() {

	const conectionObj = await getPolyMeshConnectionObject();

	const api: Polymesh = conectionObj.api;

	const identity = (await api.getSigningIdentity())!;
  
	const venue: Venue = await api.settlements.getVenue({
	  	id: new BigNumber("1554"),
	});
  
	const dateAddedTemp = new Date();
	dateAddedTemp.setFullYear(dateAddedTemp.getFullYear() + 1);
  
	const instructionQ = await venue.addInstruction({
	  legs: [
		{
		  from: identity.did, // passing the Identity (or did) means the default portfolio will be used
		  to: "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272", // or you can pass a Portfolio
		  amount: new BigNumber("1000"),
		  asset: ticker,
		},
	  ],
	  // endBlock: new BigNumber(10000000),
	  tradeDate: new Date(
		`${
		  dateAddedTemp.getMonth() + 1
		}/${dateAddedTemp.getDate()}/${dateAddedTemp.getFullYear()}`
	  ),
	});
  
	await instructionQ.run();
  	
	console.log("Trnasferred . . . . . ")
}



/*

DB settings 
params table settigs 

platform admin  
FireBlocks settings page with settings to manage Vaults there 

in case of polymesh on token studio the dropdown from the list should show 



*/