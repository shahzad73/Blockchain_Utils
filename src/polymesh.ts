import { BigNumber, Polymesh } from '@polymathnetwork/polymesh-sdk';
import { LocalSigningManager } from '@polymathnetwork/local-signing-manager';
import { Asset } from '@polymathnetwork/polymesh-sdk/api/entities/Asset';
import { Account, TickerReservation } from '@polymathnetwork/polymesh-sdk/internal';

import { AuthorizationRequest, ClaimType, ConditionTarget, ConditionType, CountryCode, Identity, KnownAssetType, ModuleName, PermissionType, ScopeType, TransactionQueue } from '@polymathnetwork/polymesh-sdk/types';
import { Compliance } from '@polymathnetwork/polymesh-sdk/api/entities/Asset/Compliance';
import { Requirements } from '@polymathnetwork/polymesh-sdk/api/entities/Asset/Compliance/Requirements';
import { SecurityToken } from '@polymathnetwork/polymesh-sdk/polkadot';
import { Identify } from 'libp2p/src/identify/message';


const mnemonicString = "riot arm extra another way tumble clump between city pottery chronic lumber";

// did    Identity ID of the Asset (used for Claims)

var args = process.argv.slice(2);

if(args[0] == "test" )
    test("Heisenberg");
else if(args[0] == "ticker" )
    registerTicker()
else if(args[0] == "getTickerInfo" )
    getTickerInfo()
else if(args[0] == "getAccountBalance" )
    getAccountBalance()
else if(args[0] == "getAssetData" )
    getAssetData()
else if(args[0] == "transferAssetOwnership" )
    transferAssetOwnership()    
else if(args[0] == "setAssetRestrictions" )
    setAssetRestrictions()    
else if(args[0] == "getAccountInfo" )
    getAccountInfo()    
else if(args[0] == "transferSharesToAnohterAccountRequest" )
    transferSharesToAnohterAccountRequest()    
else if(args[0] == "getAccountInviteToAcceptToken" )    
    getAccountInviteToAcceptToken();
else if(args[0] == "addAttestationProvider" )    
    addAttestationProvider();
else if(args[0] == "issueTokensToDistributor" )    
    issueTokensToDistributor();




// npx ts-node src/polymesh.ts test
  function test(name: string): void {

    console.log(args)

    if (name === "Heisenberg") {
      console.log("You're right 👍");
    } else {
      console.log("You're wrong 👎");
    }
  }

  // npx ts-node src/polymesh.ts getAccountInfo
  async function getAccountInfo() {
    let api: Polymesh = await getConnection(mnemonicString);

    const identity = (await api.getSigningIdentity())!;

    // Polymesh uID: "Who are you?"
    console.log(  "Polymesh uID: Who are you? Account UUID : " +  identity.uuid )

    console.log("");

    // Polymesh account: "What is/are your username(s)?"
    // Attestations are attached with this account
    console.log(" Polymesh account: What is/are your username(s)? Polymesh 'decentralised ID' (DID) - ")
    console.log( identity.did );
    console.log("JSON - " + identity.toJson())     //same as above

    console.log("");

    // get primary account address 
    const pacc = await identity.getPrimaryAccount();
    console.log(  "Primary Account : " +  pacc.account.address   )

    console.log("DIGI balance of this account - " + await identity.getAssetBalance({"ticker": "DIGI"}));

    // get all secondary accounts 
    var accounts = await identity.getSecondaryAccounts();
    accounts.forEach(obj=> {
      console.log( obj.account.address );
    })


    // This is how you can decided if a public key has any account associated with it or not
    // An account means that account has gone through CDD.  This is my account Shahzad that has already gone through CDD
    const bobKeyInfo: Account = api.accountManagement.getAccount({
      "address": "5H9J6wqHfJr1G4BULZZYvZo5NCq9MpzHKRmawztrUBc1XHis"
    });
    const shahzad = await bobKeyInfo.getIdentity();
    if(shahzad === null) {
       console.log(" No Account Exists ");
    } else {
      console.log(" Account Exists with DID" +  shahzad.did  );       
    }

    await api.disconnect();
  }

  // npx ts-node src/polymesh.ts transferSharesToAnohterAccountRequest
  async function transferSharesToAnohterAccountRequest() {
      let api: Polymesh = await getConnection(mnemonicString);

      let asset: Asset = await api.assets.getAsset({"ticker": "DIGI"});

      const transferQueue = await asset.transferOwnership({
        "target": "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"
      });

      await transferQueue.run();

      await api.disconnect();      
  }

  // npx ts-node src/polymesh.ts getAccountInviteToAcceptToken  
  async function getAccountInviteToAcceptToken() {
    let api: Polymesh = await getConnection(mnemonicString);

    const identity = (await api.getSigningIdentity())!;

    const pendingAuthorizations: AuthorizationRequest[] = await identity.authorizations.getReceived();
    
    pendingAuthorizations.forEach(obj=> {
        console.log( obj.data.type.toString()  );
    })
    
    console.log(   pendingAuthorizations.length   )
    
    await api.disconnect(); 
  }


  // npx ts-node src/polymesh.ts addAttestationProvider
  async function addAttestationProvider() {
      let api: Polymesh = await getConnection(mnemonicString);

      let asset: Asset = await api.assets.getAsset({"ticker": "DIGI"});
      console.log("Asset TICKER - " + asset.ticker)
    
      console.log("........................");
      const addClaimIssuerQueue = await asset.compliance.trustedClaimIssuers.add(
        {
            claimIssuers: [{
              identity: `0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5`,
              /**
               * a null value means that the issuer is trusted for all claim types
               * Otherwise, you could specify a list of claim types 
              */ 
              trustedFor: null
            }]
        }
      );
      console.log("Sending cpmplianace add transaction to system");
      const updatedAsset = await addClaimIssuerQueue.run();    

      await api.disconnect();       
  }


  // npx ts-node src/polymesh.ts issueTokensToDistributor
  async function issueTokensToDistributor() {
      let api: Polymesh = await getConnection(mnemonicString);

      let asset: Asset = await api.assets.getAsset({"ticker": "DIGI"});
      console.log("Asset TICKER - " + asset.ticker)

      const record = await asset.issuance.issue({amount: new BigNumber(2000)}); 
      await record.run();
      console.log("Issued . . . . ")
      console.log("Status " + record.status);     //  should be success 
      console.log("Error " + record.error);

      await api.disconnect();       
  }



  // Ticker 
  // npx ts-node src/polymesh.ts ticker
  async function registerTicker() {
      let api: Polymesh = await getConnection(mnemonicString);

      const ticker = "DIGISHARE3";
      const reservationQ = await api.assets.reserveTicker({
        ticker
      });

      console.log('Reserving ticker...');
      const reservation = await reservationQ.run();
      const { expiryDate, owner } = await reservation.details();
      console.log('Ticker reserved!');
      console.log(`Details:\n- Owner: ${owner?.did}\n- Expiry Date: ${expiryDate}\n`);

      const creationQ = await reservation.createAsset({
        name: 'DIGISHARE3',
        isDivisible: true,
        assetType: KnownAssetType.EquityCommon,
        initialSupply: new BigNumber(3000),
        requireInvestorUniqueness: false,
      });
    
      console.log('Creating Asset...\n');
      const asset = await creationQ.run();
            
      console.log("Token has been reserved . . . . .");

      await api.disconnect();
  }
    // npx ts-node src/polymesh.ts getTickerInfo
  async function  getTickerInfo() {
    let api: Polymesh = await getConnection(mnemonicString);

    const asset = await api.assets.getTickerReservation({"ticker": "DIGISHARE2"});
    const { expiryDate, owner } = await asset.details();
    console.log('Ticker reserved!');
    console.log(`Details:\n- Owner: ${owner?.did}\n- Expiry Date: ${expiryDate}\n`);

    const owner2: Account = api.accountManagement.getAccount({"address": "5H9J6wqHfJr1G4BULZZYvZo5NCq9MpzHKRmawztrUBc1XHis"})
    //console.log(owner2.);

    await api.disconnect();
  }
    // npx ts-node src/polymesh.ts getAccountBalance
  async function getAccountBalance() {
    let api: Polymesh = await getConnection(mnemonicString);

    const newAcc = api.accountManagement.getAccount({"address": "5H9J6wqHfJr1G4BULZZYvZo5NCq9MpzHKRmawztrUBc1XHis"});
    // console.log( newAcc );

    let balance = await api.accountManagement.getAccountBalance({"account": "5H9J6wqHfJr1G4BULZZYvZo5NCq9MpzHKRmawztrUBc1XHis"});
    console.log(balance.total);

    let accounts = await api.accountManagement.getSigningAccounts();
    console.log(  "Signing Accout - " + accounts[0].toJson()   );

    console.log("IsFrozen ---")
    console.log(    await accounts[0].isFrozen()   );    
    
    await api.disconnect();
  }




  // Assets
  // npx ts-node src/polymesh.ts getAssetData  
  async function getAssetData() {

    let api: Polymesh = await getConnection(mnemonicString);

    const identity = (await api.getSigningIdentity())!;
    console.log("signing identity of API - " + identity.did)

    let asset: Asset = await api.assets.getAsset({"ticker": "DIGI"});
    console.log("Asset TICKER - " + asset.ticker)


    let temp1 = await asset.exists();
    console.log( "Asset Exists : " + temp1 );

    let temp61 = await asset.details();
    console.log( "Asset Owner - " + temp61.owner.did );
    console.log( "Asset Total Supply  - "  + temp61.totalSupply )
    console.log( "Asset Name - "  + temp61.name )    


    let temp44 = await asset.investorCount();
    console.log(  "Investor count - " + temp44  );
    
    console.log( "Asset DID - " +  asset.did  );
    //console.log(  asset.documents  );
    //console.log(  asset.permissions );
    //console.log(  asset.compliance  );
    


    const corporateActionAgents = await asset.corporateActions.getAgents();

    if (corporateActionAgents.length) {
      console.log('Corporate Action Agents:');
      corporateActionAgents.forEach(({ did }) => {
        console.log(`- DID: ${did}`);
      });
    } else 
      console.log(" NO AGENTS found ")






    
    
    
    
    console.log(  ".... TICKET......"  ); 
    let temp2: TickerReservation = await api.assets.getTickerReservation({"ticker": "DIGISHARE2"}) ;
    let temp12 = await temp2.details();
    console.log("TICKER OWNER - " + temp12.owner?.did  );
    console.log("TICKET STATUS - " + temp12.status );
    console.log("Ticker Expiry date - " + temp12.expiryDate)








    //const assHolds = asset.assetHolders;
    //console.log(assHolds);

    //let temp3: boolean = await api.assets.isTickerAvailable({"ticker": "DIGISHARE2"}) ;
    //console.log( temp3 );




/*    
    const target = await api.identities.getIdentity({
      did: "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272",     
    });
  
    console.log("11111111111111111111111")
    const setCorporateActionsAgent = await asset.permissions.inviteAgent({
      target,
      permissions: {
        transactions: {
          values: [
            ModuleName.CapitalDistribution,
            ModuleName.CorporateAction,
            ModuleName.CorporateBallot,
          ],
          type: PermissionType.Include,
        },
      },
    });
    console.log("1111111111111111111111122222222222")


    console.log('Assigning a new corporate actions agent for the Asset...');
    await setCorporateActionsAgent.run();
*/  



    await api.disconnect();

  }

  // npx ts-node src/polymesh.ts setAssetRestrictions
  async function setAssetRestrictions() {
    let api: Polymesh = await getConnection(mnemonicString);

    let token: Asset = await api.assets.getAsset({"ticker": "DIGI"});

    const acmeCompliance: Compliance = token.compliance;
    const acmeRequirements: Requirements = acmeCompliance.requirements;
    const acme = (await api.getSigningIdentity())!;


    const que = await acmeRequirements.set({
      "requirements": [
          [
              {
                  "target": ConditionTarget.Receiver,
                  "type": ConditionType.IsPresent,
                  "claim": {
                      "type": ClaimType.KnowYourCustomer,
                      "scope": {
                          "type": ScopeType.Ticker,
                          "value": token.ticker
                      }
                  },
                  "trustedClaimIssuers": [{
                      "identity": acme.did,
                      "trustedFor": [ClaimType.KnowYourCustomer]
                  }]
              },
              {
                  "target": ConditionTarget.Receiver,
                  "type": ConditionType.IsAbsent,
                  "claim": {
                      "type": ClaimType.Jurisdiction,
                      "code": CountryCode.Li,
                      "scope": {
                          "type": ScopeType.Ticker,
                          "value": token.ticker
                      }
                  },
                  "trustedClaimIssuers": [{
                      "identity": acme.did,
                      "trustedFor": [ClaimType.Jurisdiction]
                  }]
              }
          ]
      ]
    })
    const updatedToken: Asset = await que.run();


    await api.disconnect();
  }

  // npx ts-node src/polymesh.ts transferAssetOwnership  
  async function transferAssetOwnership() {

    let api: Polymesh = await getConnection(mnemonicString);


    const identity = (await api.getSigningIdentity())!;
    console.log("signing identity of API - " + identity.did)

    // 
    // await identity.authorizations.getReceived()


    let asset: Asset = await api.assets.getAsset({"ticker": "DIGI"});
    console.log("Asset TICKER - " + asset.ticker)

    // Teansferring Asset ownership
    console.log("sending ownership request");


    const data1 = await asset.transferOwnership({"target": "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"})
    data1.run();
    console.log(data1.status)


    await api.disconnect();

}






  async function getConnection(mnemonic?: string): Promise<Polymesh> {

    const localSigningManager = await LocalSigningManager.create({
      accounts: [{ mnemonic: mnemonic || '//Alice' }],
    });

    let api: Polymesh = await Polymesh.connect({
      nodeUrl: "wss://testnet-rpc.polymesh.live",
      middleware: {
        link: "testnet-graphql.polymesh.live",
        key: "nBdcFXMFXLawqrh4STJG69IlVCp1Psve4qq0wfpe"
      },
      signingManager: localSigningManager,
    });

    console.log("connected");

    return api;
  }