import { BigNumber, Polymesh } from '@polymeshassociation/polymesh-sdk';
import { LocalSigningManager } from '@polymeshassociation/local-signing-manager';

//import { Identify } from 'libp2p/src/identify/message';
import { Account, AuthorizationRequest, Checkpoint, ClaimData, CountryCode, DistributionWithDetails, DividendDistribution, Instruction, InstructionStatus, TargetTreatment } from '@polymeshassociation/polymesh-sdk/types';
import { prepareReclaimDividendDistributionFunds } from '@polymeshassociation/polymesh-sdk/api/procedures/reclaimDividendDistributionFunds';
import { createCreateVenueResolver } from '@polymeshassociation/polymesh-sdk/api/procedures/createVenue';


import { Asset } from "@polymeshassociation/polymesh-sdk/api/entities/Asset";
import {
  KnownAssetType,
  ClaimType,
  ConditionTarget,
  ConditionType,
  ScopeType,
  Venue,
  VenueType,
  PortfolioBalance,
  NumberedPortfolio,
  InstructionAffirmation,
} from "@polymeshassociation/polymesh-sdk/types";
import { Compliance } from "@polymeshassociation/polymesh-sdk/api/entities/Asset/Base/Compliance";
import { Requirements } from "@polymeshassociation/polymesh-sdk/api/entities/Asset/Base/Compliance/Requirements";

//import { TargetTreatment } from '@polymathnetwork/polymesh-sdk/types';



const mnemonicString = "riot arm extra another way tumble clump between city pottery chronic lumber";   //mega
const mnemonicString2 = "run swarm rotate impact knife ice steel hip enough envelope pigeon recycle";    //shahzad
const mnemonicString3 = "monkey orchard pear salon walnut genre obscure fuel van slim night flock";    //hassan sadiqi
const mnemonicString4 = "dash beauty fetch excess admit embrace trouble save join topple slush fiscal";   //crypto wallet


// 0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272  waqas
// 0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5  shahzad
// 0x7f4252259c0baf9b0af41f2b4040768ed6160f1a1f61b8f2202f60c120e390d1  exchange

// did    Identity ID of the Asset (used for Claims)
/*
  use this to get identities
  const target = await api.identities.getIdentity({
    did: '0x1906c0a0f58364d3f71c4e94e1361af9810666445564840c96f9f1a965cf6045',
  });
*/


/*
    Venue for the investor     this is of other venur type
    TestingOtherVenueForInvestor     503

    Venfor for the admin        this is distribution type venue
    468
*/


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
    transferOwnershipToAnohterAccountRequest()    
else if(args[0] == "getAccountInviteToAcceptToken" )    
    getAccountInviteToAcceptToken();
else if(args[0] == "addAttestationProvider" )    
    addAttestationProvider();
else if(args[0] == "issueTokensToDistributor" )    
    issueTokensToDistributor();
else if(args[0] == "setUserKYCandOtherClaims" )
    setUserKYCandOtherClaims();
else if(args[0] == "getClaimsData" )    
    getClaimsData();
else if(args[0] == "redeemTokensToDistributor" )    
    redeemTokensToDistributor();
else if(args[0] == "getAssetComplianceRules" )    
    getAssetComplianceRules();
else if(args[0] == "getIdentitiesWithClaims" )    
    getIdentitiesWithClaims();
else if(args[0] == "cantransferassetbetweenidentities" )    
    cantransferassetbetweenidentities();
else if(args[0] == "checkAttestationProviderStatus" )    
    checkAttestationProviderStatus();
else if(args[0] == "removeAttestationProviderStatus" )    
    removeAttestationProviderStatus();
else if(args[0] == "removeAssetRestrictions" )    
    removeAssetRestrictions();
else if(args[0] == "createVenue" )    
    createVenue();
else if(args[0] == "transferShares" )    
    transferShares();
else if(args[0] == "getPendingDistriction" )    
    getPendingDistriction();
else if(args[0] == "createPortfolio" )    
    createPortfolio();
else if(args[0] == "getPortfolio" )    
    getPortfolio();
else if(args[0] == "transferBalanceToPortfolio" )    
    transferBalanceToPortfolio();
else if(args[0] == "getTokenBalancesOfAccount" )    
    getTokenBalancesOfAccount();
else if(args[0] == "transferSharesTwoLegSwap" )    
    transferSharesTwoLegSwap();
else if(args[0] == "affirmInstruction" )    
    affirmInstruction();
else if(args[0] == "rescheduleInstruction" )    
    rescheduleInstruction();
else if(args[0] == "rejectInstruction" )    
    rejectInstruction();

// Dividend Related
if(args[0] == "setupDividends" )    
    setupDividends();
else if(args[0] == "getDividends" )    
    getDividends()
else if(args[0] == "deleteSingleDividends" )    
    deleteSingleDividends()
else if(args[0] == "getSingleDividends" )    
    getSingleDividends()
else if(args[0] == "getReceiverDividendDistribution" )    
    getReceiverDividendDistribution()  
else if(args[0] == "claimDividendDistribution" )    
    claimDividendDistribution()  
else if(args[0] == "payDividendDistribution" )    
    payDividendDistribution()  

else if(args[0] == "removeStablecoinReceiptRestriction" )    
    removeStablecoinReceiptRestriction()  
    

      


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
    console.log("JSON - " + identity.did)     //same as above

    console.log("");

    // get primary account address 
    const pacc = await identity.getPrimaryAccount();
    console.log(  "Primary Account : " +  pacc.account.address   )

    console.log("POLYMESH21 balance of this account - " + await identity.getAssetBalance({"ticker": "POLYMESH21"}));

    // get all secondary accounts 
    var accounts = await identity.getSecondaryAccounts();
    /*accounts.forEach(obj=> {
      console.log( obj.account.address );
    })*/


    // This is how you can decided if a public key has any account associated with it or not
    // An account means that account has gone through CDD.  This is my account Shahzad that has already gone through CDD
    const bobKeyInfo = api.accountManagement.getAccount({
      "address": "5H9J6wqHfJr1G4BULZZYvZo5NCq9MpzHKRmawztrUBc1XHis"
    });
    /*const shahzad = await bobKeyInfo.getIdentity();
    if(shahzad === null) {
       console.log(" No Account Exists ");
    } else {
      console.log(" Account Exists with DID" +  shahzad.did  );       
    }*/

    //await api.disconnect();
  }

  // ---------------------------------------------------------
  // chekc total and portfolio balances
  // npx ts-node src/polymesh.ts getTokenBalancesOfAccount
  async function getTokenBalancesOfAccount() {
    let api: Polymesh = await getConnection(mnemonicString);

    const idds = (await api.getSigningIdentity())!;

    console.log("POLYMESH21 balance of this account - " + await idds.getAssetBalance({"ticker": "POLYMESH21"}));

    const defaultPortfolio = await idds?.portfolios.getPortfolio();

    const bb = await defaultPortfolio?.getAssetBalances({"assets": ["POLYMESH21"]});
    console.log("Default Portfolio Data")
    bb?.forEach((obj: PortfolioBalance)=> {
      console.log( obj.asset.ticker + " " + obj.total );
    })

    console.log("")    
    console.log("Cold Portfolio Data")    
    const coldStore = await  idds?.portfolios.getPortfolio({
      "portfolioId": new BigNumber(new BigNumber(2))
    });

    var balance = await coldStore?.getAssetBalances();
    balance?.forEach((obj: PortfolioBalance)=> {
      console.log( obj.asset.ticker + " " + obj.total );
    })


    
  }



  // npx ts-node src/polymesh.ts createVenue
  async function createVenue() {
      console.log('Connecting to the node...\n\n');
      let api: Polymesh = await getConnection(mnemonicString2);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const identity = (await api.getSigningIdentity())!;
      console.log(`Connected! Signing Identity ID: ${identity.did}`);

      const venueQ = await api.settlements.createVenue({
        description: 'TestingOtherVenueForInvestor',
        type: VenueType.Distribution
      });

      console.log('Creating venue...');
      const venue = await venueQ.run();
      console.log("ID of the venue is : " + venue.id);
      const { type, owner, description } = await venue.details();
      console.log('Venue created!');
      console.log(`Details:\n- Owner: ${owner?.did}\n- Type: ${type}\n- Description. ${description}`);

      await api.disconnect();
  }



  // npx ts-node src/polymesh.ts transferShares
  async function transferShares() {

    console.log('Connecting to the node...\n\n');
    let api: Polymesh = await getConnection(mnemonicString3);
  
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const identity = (await api.getSigningIdentity())!;


    const vens = await identity.getVenues();
    vens.forEach(async (obj) => {        
        const dets = await obj.details();
        console.log( obj.id + " " + dets.description )
    })


    const venue: Venue = await api.settlements.getVenue({ id: new BigNumber(1694) });    

    // admin venue 468
    // investor's venur  503
    // hassan sadiqi venue  1694

              console.log("Now going to send transaction");
        
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const bob = await api.identities.getIdentity({ did: "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272" });
        
              //const destinationPortfolio = await bob.portfolios.getPortfolio({ portfolioId: new BigNumber(1) });
        
              const instructionQ = await venue.addInstruction({
                legs: [
                  {
                    from: "0x7cc1b91e216b3ea3192fa9b5f6a49f7fd51f5873e16c607100ad5e40db643765", // passing the Identity (or did) means the default portfolio will be used
                    to: "0x683d05728cfdece940be2a194b5b4099ac2f37fe4d1b161ebba9b84701a0d9c7", // or you can pass a Portfolio
                    amount: new BigNumber(50),
                    asset: 'STABLECOIN01',
                  },
                ],
                //endBlock: new BigNumber(10000000),
                tradeDate: new Date('12/25/2024'),
              });

              console.log('Creating Instruction...\n');
              const instruction = await instructionQ.run()
              console.log("instruction send");
              /* Pending Instructions can be fetched */
              // const pendingInstructions = await venue.getPendingInstructions();

              /*const details = await instruction.details();
              console.log(`Instruction Created! Creation Date: ${details.createdAt}  Status:${details.status}   instruction ID: ${instruction.id}  `);

              const affirmations = await instruction.getAffirmations();

              console.log("");
              console.log("Afirmations .......");
              affirmations.data.forEach((obj: InstructionAffirmation) => {
                  console.log(  obj.identity.did + " " + obj.status  );
              });

              console.log("");
              console.log("Legs Data .........");
              const legs = await instruction.getLegs();
              legs.data.forEach((obj2) => {
                  console.log("asset:" + obj2.asset.ticker  + " from:" + obj2.from.owner.did + " to:" + obj2.to.owner.did );
              });

              console.log("statuses.......");
              const isPenidng = await instruction.isPending();
              const isExe = await instruction.isExecuted();
              const status = await instruction.getStatus();
              console.log("Pending:" + isPenidng + "  isExeucted:" + isExe + " Status:" + status.status);
        
              /*const authorizeQ = await instruction.affirm();
        
              await authorizeQ.run();*/
        
              /* Instructions can be unauthorized (will be withdrawn) or rejected */
              /* 
                const unauthorizeQ = await instruction.unauthorize();
                await unauthorizeQ.run();
                
                const rejectQ = await instruction.reject();
                await rejectQ.run();
              */


        //await api.disconnect();
  }
  // 1. npx ts-node src/polymesh.ts transferSharesTwoLegSwap
  async function transferSharesTwoLegSwap() {

    console.log('Connecting to the node...\n\n');
    let api: Polymesh = await getConnection(mnemonicString);
  
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const identity = await api.getSigningIdentity();

    const venue: Venue = await api.settlements.getVenue({ id: new BigNumber(468) });  
    console.log("venue ID is " + venue.id);

              console.log("Now going to send transaction");
        
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const bob = await api.identities.getIdentity({ did: "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272" });
        
              //const destinationPortfolio = await bob.portfolios.getPortfolio({ portfolioId: new BigNumber(1) });

              const instructionQ = await venue.addInstruction({
                legs: [
                  {
                    from: "0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5", // passing the Identity (or did) means the default portfolio will be used
                    to: "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272", // or you can pass a Portfolio
                    amount: new BigNumber(500),
                    asset: 'POLYMESH57',
                  },
                  {
                    to: "0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5", // passing the Identity (or did) means the default portfolio will be used
                    from: "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272", // or you can pass a Portfolio
                    amount: new BigNumber(100),
                    asset: 'USDC',
                  },                  
                ],
                //endBlock: new BigNumber(10000000),
                tradeDate: new Date('12/25/2023'),
              });

              console.log('Creating Instruction...\n');
              const instruction = await instructionQ.run();
        
              /* Pending Instructions can be fetched */
              // const pendingInstructions = await venue.getPendingInstructions();

              const details = await instruction.details();
              console.log(`Instruction Created! Creation Date: ${details.createdAt}  Status:${details.status}   instruction ID: ${instruction.id}  `);

              const affirmations = await instruction.getAffirmations();

              console.log("");
              console.log("Afirmations .......");
              affirmations.data.forEach((obj: InstructionAffirmation) => {
                  console.log(  obj.identity.did + " " + obj.status  );
              });

              console.log("");
              console.log("Legs Data .........");
              const legs = await instruction.getLegs();
              legs.data.forEach((obj2) => {
                  console.log("asset:" + obj2.asset.ticker +  " from:" + obj2.from.owner.did + " to:" + obj2.to.owner.did );
              });

              console.log("statuses.......");
              const isPenidng = await instruction.isPending();
              const isExe = await instruction.isExecuted();
              const status = await instruction.getStatus();
              console.log("Pending:" + isPenidng + "  isExeucted:" + isExe + " Status:" + status.status);
        
              /*const authorizeQ = await instruction.affirm();
        
              await authorizeQ.run();*/
        
              /* Instructions can be unauthorized (will be withdrawn) or rejected */
              /* 
                const unauthorizeQ = await instruction.unauthorize();
                await unauthorizeQ.run();
                
                const rejectQ = await instruction.reject();
                await rejectQ.run();
              */


    await api.disconnect();
  }
  // npx ts-node src/polymesh.ts getPendingDistriction
  async function getPendingDistriction() {
    console.log('Connecting to the node...\n\n');
    let api: Polymesh = await getConnection(mnemonicString);

    const venue: Venue = await api.settlements.getVenue({ id: new BigNumber(1368) });    
    console.log(venue.id);

    const instructions = await venue.getInstructions();
    const pendingInstructions: Instruction[] = instructions.pending;    

    const targetInstruction = pendingInstructions.find((instruction: Instruction) => {
        return instruction.id.isEqualTo(new BigNumber(4675));
    });

    if(targetInstruction == undefined) {
       console.log("could not found instruction   so it will get NANs")
    } else {
      console.log('HURRAY found it')
    }


    const det = await targetInstruction?.details()

    console.log("instruction venue id is " + det?.venue.id)

    const affirmations =  await targetInstruction?.getAffirmations();
    console.log("");
    console.log("Afirmations .......");
    affirmations?.data.forEach((obj: InstructionAffirmation) => {
        console.log( obj.identity.did + " " + obj.status + " "  );
    });


    const stat = await targetInstruction?.isExecuted()
    console.log("is Executed : " + stat);

    const stat2 = await targetInstruction?.isPending()
    console.log("is Pending : " + stat2);
    


    const legs = await targetInstruction?.getLegs();
    console.log("Leg Count - " + legs?.count);
    legs?.data.forEach((obj: any)=> {
        console.log(obj.amount + " " + obj.asset.ticker + " " + obj.from.owner.did + " " + obj.to.owner.did);
    })

    await api.disconnect();    
    
  }
  // 2. npx ts-node src/polymesh.ts affirmInstruction
  async function affirmInstruction() {
    console.log('Connecting to the node...\n\n');
    let api: Polymesh = await getConnection(mnemonicString3);

    const venue: Venue = await api.settlements.getVenue({ id: new BigNumber(1368) });    
    console.log( "venue id is "+ venue.id );

    const instructions = await venue.getInstructions();
    const pendingInstructions: Instruction[] = instructions.pending;    

    const targetInstruction = pendingInstructions.find((instruction: Instruction) => {
      return instruction.id.isEqualTo(new BigNumber(4675));
    });

    console.log("affirming the instruction");
    const acceptQueue = await targetInstruction?.affirm();
    await acceptQueue?.run();
    
    //console.log("Re-scheduling the instruction");
    //await targetInstruction?.reschedule();

    await api.disconnect();   
  }
  // npx ts-node src/polymesh.ts rescheduleInstruction  
  async function rescheduleInstruction() {
    console.log('Connecting to the node...\n\n');
    let api: Polymesh = await getConnection("run swarm rotate impact knife ice steel hip enough envelope pigeon recycle");

    const venue: Venue = await api.settlements.getVenue({ id: new BigNumber(468) });    


    const instructions = await venue.getInstructions();
    const pendingInstructions: Instruction[] = instructions.pending;    

    // 738
    const targetInstruction = pendingInstructions.find((instruction: Instruction) => {
      return instruction.id.isEqualTo(new BigNumber(767));
    });
    
    console.log("Re-scheduling the instruction");
    //await targetInstruction?.reschedule();

    await api.disconnect();   
  }
 // npx ts-node src/polymesh.ts rejectInstruction  
  async function rejectInstruction() {
    console.log('Connecting to the node for rejection...\n\n');
    let api: Polymesh = await getConnection(mnemonicString);

    const venue: Venue = await api.settlements.getVenue({ id: new BigNumber(468) });    

    const instructions = await venue.getInstructions();
    const pendingInstructions: Instruction[] = instructions.pending;    

    const targetInstruction = pendingInstructions.find((instruction: Instruction) => {
      return instruction.id.isEqualTo(new BigNumber(2796));
    });
    console.log( "Instruction ID is " + targetInstruction?.id )
    console.log(  await targetInstruction?.getStatus()  );

    
    console.log("rejecting the instruction");
    const insi = await targetInstruction?.reject();
    await insi?.run();

    await api.disconnect();   
  }




  // --------------- Portfolio -------------------------
  // npx ts-node src/polymesh.ts createPortfolio
  async function createPortfolio() {
    console.log('Connecting to the node...\n\n');
    let api: Polymesh = await getConnection("riot arm extra another way tumble clump between city pottery chronic lumber");

    const coldPortfolio = await api.identities.createPortfolio({
      "name": "Cold Storage"
    });
    const coldFolio: NumberedPortfolio = await coldPortfolio.run();

    console.log( coldFolio.id.toString() );

    await api.disconnect();    
  }
  // npx ts-node src/polymesh.ts getPortfolio  
  async function getPortfolio() {
    console.log('Connecting to the node...\n\n');
    let api: Polymesh = await getConnection(mnemonicString);

    const idds =  await api.getSigningIdentity();
    
    const coldStore = await  idds?.portfolios.getPortfolio({
      "portfolioId": new BigNumber(new BigNumber(2))
    });

    var balance = await coldStore?.getAssetBalances();
    balance?.forEach((obj)=> {
      console.log( obj.asset.ticker + " " + obj.total.toString() + " " )      
    })  

    await api.disconnect();    
  }
  // npx ts-node src/polymesh.ts transferBalanceToPortfolio  
  async function transferBalanceToPortfolio() {
    let api: Polymesh = await getConnection("riot arm extra another way tumble clump between city pottery chronic lumber");

    const idds =  await api.getSigningIdentity();

    console.log(idds?.did);

    const defaultPortfolio = await idds?.portfolios.getPortfolio();

    const bb = await defaultPortfolio?.getAssetBalances({"assets": ["POLYMESH51"]});
    console.log( bb?.length )
    bb?.forEach((obj: PortfolioBalance)=> {
      console.log( "--" + obj.asset.ticker + " " + obj.total );
    })

    const coldStore = await  idds?.portfolios.getPortfolio({
      "portfolioId": new BigNumber(new BigNumber(2))
    });

    /*console.log("Moving funds to cold storage");
    const moveQueue = await defaultPortfolio?.moveFunds({
      "items": [
          {
              "asset": "POLYMESH21",
              "amount": new BigNumber("500")
          }
      ],
      "to": coldStore
    });
    await moveQueue?.run();*/

    var balance = await coldStore?.getAssetBalances();
    balance?.forEach((obj: PortfolioBalance)=> {
      console.log( obj.asset.ticker + " " + obj.total );
    })
    
    await api.disconnect(); 

  }




  // npx ts-node src/polymesh.ts transferOwnershipToAnohterAccountRequest
  async function transferOwnershipToAnohterAccountRequest() {
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

      let asset: Asset = await api.assets.getAsset({"ticker": "POLYMESH21"});
      console.log("Asset TICKER - " + asset.ticker)

      // you can use this method to check if a identiify has required autorizations   
      //asset.compliance.trustedClaimIssuers.add.checkAuthorization

      const addClaimIssuerQueue = await asset.compliance.trustedClaimIssuers.add(
        {
            claimIssuers: [{
              identity: `0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5`,

              /**
               * a null value means that the issuer is trusted for all claim types
               * Otherwise, you could specify a list of claim types 
               or it could be one of these
                Accredited = 'Accredited',
                Affiliate = 'Affiliate',
                BuyLockup = 'BuyLockup',
                SellLockup = 'SellLockup',
                CustomerDueDiligence = 'CustomerDueDiligence',
                KnowYourCustomer = 'KnowYourCustomer',
                Jurisdiction = 'Jurisdiction',
                Exempted = 'Exempted',
                Blocked = 'Blocked',
                InvestorUniqueness = 'InvestorUniqueness',
                NoData = 'NoData',
                InvestorUniquenessV2 = 'InvestorUniquenessV2',                
              */              
              trustedFor: [ClaimType.KnowYourCustomer, ClaimType.Jurisdiction]
            }]
        }
      );
      console.log("Sending cpmplianace add transaction to system");
      const updatedAsset = await addClaimIssuerQueue.run();    

      await api.disconnect();       
  }
  // not working as expected      npx ts-node src/polymesh.ts checkAttestationProviderStatus
  async function checkAttestationProviderStatus() {
    let api: Polymesh = await getConnection(mnemonicString);

    let asset: Asset = await api.assets.getAsset({"ticker": "POLYMESH21"});
    console.log("Asset TICKER - " + asset.ticker)

    const data = await asset.compliance.trustedClaimIssuers.add.checkAuthorization({
      claimIssuers: [{
        identity: `0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa1`,             
        trustedFor: [ClaimType.KnowYourCustomer]
      }]
    });

    console.log( data )

    await api.disconnect();       

  }
  //npx ts-node src/polymesh.ts removeAttestationProviderStatus
  async function removeAttestationProviderStatus() {
    let api: Polymesh = await getConnection(mnemonicString);

    let asset: Asset = await api.assets.getAsset({"ticker": "POLYMESH21"});
    console.log("Asset TICKER - " + asset.ticker)

    const addClaimIssuerQueue = await asset.compliance.trustedClaimIssuers.remove(
      {
          claimIssuers: [
            `0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5`
          ]
      }
    );
    console.log("Sending cpmplianace remove transaction to system");
    const updatedAsset = await addClaimIssuerQueue.run();    

    await api.disconnect(); 
  }



  // npx ts-node src/polymesh.ts issueTokensToDistributor
  async function issueTokensToDistributor() {
      let api: Polymesh = await getConnection(mnemonicString);

      let asset: Asset = await api.assets.getFungibleAsset({"ticker": "POLYMESH21"});
      console.log("Asset TICKER - " + asset.ticker)

      const record = await asset.issuance.issue({amount: new BigNumber(2000)}); 
      await record.run();
      console.log("Issued . . . . ")
      console.log("Status " + record.status);     //  should be success 
      console.log("Error " + record.error);

      await api.disconnect();       
  }

  // npx ts-node src/polymesh.ts redeemTokensToDistributor
  async function redeemTokensToDistributor() {
    let api: Polymesh = await getConnection(mnemonicString);

    let asset: Asset = await api.assets.getFungibleAsset({"ticker": "POLYMESH21"});
    console.log("Asset TICKER - " + asset.ticker)

    const record = await asset.redeem({amount: new BigNumber(2000)}); 
    await record.run();
    console.log("Redeemed . . . . ")
    console.log("Status " + record.status);     //  should be success 
    console.log("Error " + record.error);

    await api.disconnect();       
  }

  // npx ts-node src/polymesh.ts cantransferassetbetweenidentities  
  async function cantransferassetbetweenidentities() {
      // 0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272  waqas
      // 0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5  shahzad
      // 0x7f4252259c0baf9b0af41f2b4040768ed6160f1a1f61b8f2202f60c120e390d1  exchange    

      let api: Polymesh = await getConnection(mnemonicString);
      
      let asset: Asset = await api.assets.getFungibleAsset({"ticker": "POLYMESH21"});

      const data = await asset.settlements.canTransfer({to:"0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272", amount: new BigNumber("1".toString()) })

      console.log(data);
      console.log( data.result )
      data.compliance.requirements.forEach((obj)=>{
          console.log(  obj.id  + " " + obj.complies ) 
          obj.conditions.forEach((obj2)=> {
              console.log(obj2.complies + " " + obj2.condition.target + " " + obj2.condition.type );
          })
      })

      api.disconnect();
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
      });
      
      console.log('Creating Asset...\n');
      const asset = await creationQ.run();

      console.log("Token has been reserved . . . . .");





      await api.disconnect();
  }
    // npx ts-node src/polymesh.ts getTickerInfo
  async function  getTickerInfo() {
    let api: Polymesh = await getConnection(mnemonicString);

    const asset = await api.assets.getTickerReservation({"ticker": "USDC"});
    const { expiryDate, owner } = await asset.details();
    console.log('Ticker reserved!');
    console.log(`Details:\n- Owner: ${owner?.did}\n- Expiry Date: ${expiryDate}\n`);

    const owner2 = api.accountManagement.getAccount({"address": "5H9J6wqHfJr1G4BULZZYvZo5NCq9MpzHKRmawztrUBc1XHis"})
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
    //console.log(  "Signing Accout - " + (await accounts[0].getIdentity().did )   );

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

    let asset: Asset = await api.assets.getAsset({"ticker": "USDC"});
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
    

/*
    const corporateActionAgents = await asset.corporateActions.getAgents();

    if (corporateActionAgents.length) {
      console.log('Corporate Action Agents:');
      corporateActionAgents.forEach(({ did }) => {
        console.log(`- DID: ${did}`);
      });
    } else 
      console.log(" NO AGENTS found ")
*/





    
    
    
    /*
      console.log(  ".... TICKET......"  ); 
      let temp2: TickerReservation = await api.assets.getTickerReservation({"ticker": "DIGISHARE2"}) ;
      let temp12 = await temp2.details();
      console.log("TICKER OWNER - " + temp12.owner?.did  );
      console.log("TICKET STATUS - " + temp12.status );
      console.log("Ticker Expiry date - " + temp12.expiryDate)
    */






/*
    const assHolds = await asset.assetHolders.get()
    console.log("All Asset Holders. . . . ")
    assHolds.data.forEach(element => {
       console.log( element.identity.did + " " + element.balance );
    });
*/

    const comp2 = asset.compliance;
    //console.log("compliance")
    //console.log(comp2);


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

    let token: Asset = await api.assets.getAsset({"ticker": "POLYMESH21"});

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
                  "type": ConditionType.IsPresent,
                  "claim": {
                      "type": ClaimType.Jurisdiction,
                      "code": CountryCode.Pk,
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
    //const updatedToken: Asset = await que.run();

    //await api.disconnect();
  }

  // ----------  for jurisdictions you need to find out what are the country 
  // npx ts-node src/polymesh.ts getAssetComplianceRules    
  async function getAssetComplianceRules() {
    let api: Polymesh = await getConnection(mnemonicString);

    let token: Asset = await api.assets.getAsset({"ticker": "POLYMESH21"});

    const comp = await token.compliance.requirements.get();

    console.log( "Default defaultTrustedClaimIssuers" )
    comp.defaultTrustedClaimIssuers.forEach((obj) => {
        console.log( obj.identity.did );
    }) 

    console.log("");
    console.log( "Requirements" );
    comp.requirements.forEach((requirement)=> {
        /*"requirements": [
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
          ]*/

        console.log(requirement.id);

        requirement.conditions.forEach((condition) => {            
            console.log("---------------------------------------");
            console.log(  condition.target + " " + condition.type   );
            condition.trustedClaimIssuers?.forEach((claimissuer)=> {
                console.log("Trust Issuer for this condition : " + claimissuer.identity.did);
                console.log("Conditions")
                claimissuer.trustedFor?.forEach((trust: ClaimType)=> {
                    console.log(" - " + trust.toString())
                    console.log(trust.valueOf)
                })
            })
        })
    })

    await api.disconnect();
  }





  // npx ts-node src/polymesh.ts removeAssetRestrictions
  async function removeAssetRestrictions() {
    let api: Polymesh = await getConnection(mnemonicString);

    let token: Asset = await api.assets.getAsset({"ticker": "POLYMESH21"});

    const acmeCompliance: Compliance = token.compliance;
    const acmeRequirements: Requirements = acmeCompliance.requirements;
    const acme = (await api.getSigningIdentity())!;


    //const que = await acmeRequirements.remove(BigNumber(1))
    //const updatedToken: Asset = await que.run();

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





  // npx ts-node src/polymesh.ts setUserKYCandOtherClaims
  async function setUserKYCandOtherClaims() {

      let api: Polymesh = await getConnection(mnemonicString);

      const nextYear: Date = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const claimQueue = await api.claims.addClaims({
          "claims": [
              {
                  "claim": {
                      "type": ClaimType.Jurisdiction,
                      "code": CountryCode.Pk,
                      "scope": {
                          "type": ScopeType.Ticker,
                          "value": "POLYMESH21"
                      }
                  },
                  "expiry": nextYear,
                  "target": "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"
              },
              {
                "claim": {
                    "type": ClaimType.KnowYourCustomer,
                    "scope": {
                        "type": ScopeType.Ticker,
                        "value": "POLYMESH21"
                    }
                },
                "expiry": nextYear,
                "target": "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"
            }             
          ]
      }); 

      /*const claimQueue: TransactionQueue<void> = await api.claims.addClaims({
        "claims": [
            {
                "claim": {
                    "type": ClaimType.KnowYourCustomer,
                    "scope": {
                        "type": ScopeType.Ticker,
                        "value": "POLYMESH22"
                    }
                },
                "expiry": nextYear,
                "target": "0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5"
            }
        ]
      });*/

      await claimQueue.run();

      await api.disconnect();
  }





  // npx ts-node src/polymesh.ts getClaimsData
  async function getClaimsData() {
   /* let api: Polymesh = await getConnection(mnemonicString);

    const cddClaims = await api.claims.getCddClaims();

    console.log('List of CDD claims for the signing Identity:\n');
    cddClaims.forEach((claim, i) => {
      renderClaim(claim, i + 1);
    });
  
    const investorUniquenessClaims = await api.claims.getInvestorUniquenessClaims();
  
    console.log('List of InvestorUniqueness claims for the signing Identity:\n');
    investorUniquenessClaims.forEach((claim, i) => {
      renderClaim(claim, i + 1);
    });


    const targetingClaims = await api.claims.getTargetingClaims(
      { "target": "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272",
        "scope": {
          "type": ScopeType.Ticker,
          "value": "POLYMESH22"
        }   
      }
    );
    console.log(`List of claims targeting to ${"0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"}\n`);
    targetingClaims.data.forEach(({ identity, claims }) => {
      console.log(`Identity: ${identity.did}`);
      claims.forEach((claim, i) => renderClaim(claim, i + 1));
    });
  

    const issuedClaims = await api.claims.getIssuedClaims (
    { "target": "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"  
    });
    console.log(`List of issued targeting to ${"0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"}\n`);
    console.log( issuedClaims );


    await api.disconnect(); */
  }

  // npx ts-node src/polymesh.ts getIdentitiesWithClaims
  // to found out claims attached with a speciifc asset
  // not working
  async function getIdentitiesWithClaims() {
    let api: Polymesh = await getConnection(mnemonicString);

    const data = await api.claims.getIdentitiesWithClaims({
      scope: {
        type: ScopeType.Ticker,
        value: 'POLYMESH21'
      }
    });


    data.data.forEach((obj)=> {
        console.log( obj.identity.did );

        obj.claims.forEach((obj2)=> {
            console.log( obj2.claim.type.toString() + "  " + obj2.target )
        })
    })
}



// npx ts-node src/polymesh.ts setupDividends
async function setupDividends() {

  /*
      eric
      0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272    2000
      
      shahzad
      0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5    1000
      
      ASSET01   
      COIN01
  
      Issuer - Hassan Saddiqi                   
      monkey orchard pear salon walnut genre obscure fuel van slim night flock    
  */  
  
      let api: Polymesh = await getConnection(mnemonicString3);
  
      const identity = (await api.getSigningIdentity())!;
      console.log(`Connected! Signing Identity ID: ${identity.did}`);
    
      const ticker = "ASSET01";
  
      const asset = await api.assets.getAsset({ ticker });
      console.log(`Asset found! Current asset name is: ${(await asset.details()).name}`);

  /*
    const checkpointQueue = await asset.checkpoints.create();
    const checkpoint: Checkpoint = await checkpointQueue.run();
    const preDividendCheckpointId: string = checkpoint.id.toString(10);
    console.log( "Checkpoint id : " + preDividendCheckpointId )

    const preDividendCheckpoint: Checkpoint = await asset.checkpoints.getOne({
      id: new BigNumber("5"),
    });    
  
  const distributions: Distributions = asset.corporateActions.distributions;
  const dividendActionQueue = await distributions.configureDividendDistribution({
      "description": "Test distribution",
      "declarationDate": new Date('10/26/2023'), // Here declared now, but can be any date.
      "checkpoint": preDividendCheckpoint, // Good thing we created it. If not, it would create it automatically.
      "paymentDate": new Date(new Date().getTime() + 1000 * 60), // Or whichever point at which ACME holders can claim their dividend.
      //"originPortfolio": acmeCAFolio, // Another well prepared item.
      "currency": "COIN02",
      "maxAmount": new BigNumber("6000"), // This determines what will be locked.
      "perShare": new BigNumber("0.2"), // Unlike with the Token Studio, you have to calculate it here.
      "expiryDate": new Date('12/26/2024'), // Sufficiently far in the future that holders have time to claim.
      "targets": {
          identities: ["0x7cc1b91e216b3ea3192fa9b5f6a49f7fd51f5873e16c607100ad5e40db643765"], // Nobody is excluded, i.e. everyone can claim a dividend.
          treatment: TargetTreatment.Exclude
      },
      "taxWithholdings": [], // Let's keep it simple.
  });
  const dividendAction: DividendDistribution = await dividendActionQueue.run();
  const dividendActionId: string = dividendAction.id.toString(10);    
  
  console.log("Dividend created with ID " + dividendActionId)
  
  
    // fetch distribution details (whether funds have been reclaimed and the amount of remaining funds)
    const { remainingFunds, fundsReclaimed } = await dividendAction.details();
    console.log(`Reclaimed: ${fundsReclaimed}. Remaining funds: ${remainingFunds.toFormat()}`);
  
    console.log("Getting partcipents now ....")
    // get all participants, their owed amount and whether they have been paid or not (this is SLOW)
    const participants = await dividendAction.getParticipants();
    participants.forEach(({ identity: { did }, amount, paid }) => {
      console.log(`DID ${did} is owed ${amount.toFormat()}. Paid: ${paid}`);
    });
  */
  }
  
// npx ts-node src/polymesh.ts getDividends
async function getDividends() {

  let api: Polymesh = await getConnection(mnemonicString3);

  const identity = (await api.getSigningIdentity())!;
  console.log(`Connected! Signing Identity ID: ${identity.did}`);

  const ticker = "ASSET01";

  const asset = await api.assets.getAsset({ ticker });
  console.log(`Asset found! Current asset name is: ${(await asset.details()).name}`);

  //const originPortfolio = await identity.portfolios.getPortfolio({ portfolioId: new BigNumber(0) });



    /*console.log("going to create dividends");
    // this creates a Corporate Action under the hood and then uses it to create the Dividend Distribution
    const objects = await asset.corporateActions.distributions.get()


    objects.forEach(obj => {
        console.log(obj.distribution.id.toString())
    })
*/

}

// npx ts-node src/polymesh.ts getSingleDividends          get single didvidend details from blockchain
async function getSingleDividends() {

  let api: Polymesh = await getConnection(mnemonicString3);

  const identity = (await api.getSigningIdentity())!;
  console.log(`Connected! Signing Identity ID: ${identity.did}`);

  const ticker = "ASSET01";

  const asset = await api.assets.getAsset({ ticker });
  console.log(`Asset found! Current asset name is: ${(await asset.details()).name}`);

  //const originPortfolio = await identity.portfolios.getPortfolio({ portfolioId: new BigNumber(0) });


/*
    console.log("going to create dividends");
    // this creates a Corporate Action under the hood and then uses it to create the Dividend Distribution
    const object = await asset.corporateActions.distributions.getOne({id: new BigNumber(9)});

    console.log(object);

    console.log("Getting partcipents now ....")
    // get all participants, their owed amount and whether they have been paid or not (this is SLOW)
    const participants = await object.distribution.getParticipants();
    participants.forEach(({ identity: { did }, amount, paid }) => {
      console.log(`DID ${did} is owed ${amount.toFormat()}. Paid: ${paid}`);
    });
*/

}

// npx ts-node src/polymesh.ts deleteSingleDividends
async function deleteSingleDividends() {

  let api: Polymesh = await getConnection(mnemonicString3);

  const identity = (await api.getSigningIdentity())!;
  console.log(`Connected! Signing Identity ID: ${identity.did}`);

  const ticker = "ASSET01";

  const asset = await api.assets.getAsset({ ticker });
  console.log(`Asset found! Current asset name is: ${(await asset.details()).name}`);

/*
    console.log("going to delete dividends");
    // this creates a Corporate Action under the hood and then uses it to create the Dividend Distribution
    const object = await asset.corporateActions.distributions.getOne({id: new BigNumber(0)});

    const reclaimQ = await object.distribution.reclaimFunds();
    await reclaimQ.run();     

    console.log("Funds reclaimed");*/
}

// npx ts-node src/polymesh.ts getReceiverDividendDistribution
async function getReceiverDividendDistribution() {

  let api: Polymesh = await getConnection(mnemonicString2);


  const acmeAsset: Asset = await api.assets.getAsset({
    ticker: 'ASSET01',
  });
/*  
  const acmeDividendWithDetails: DistributionWithDetails =
    await acmeAsset.corporateActions.distributions.getOne({
      id: new BigNumber("1"),
    });


  console.log( acmeDividendWithDetails );

  const acmeDividend: DividendDistribution = acmeDividendWithDetails.distribution;
  const claimQueue = await acmeDividend.claim(); // From the context of Alice, which is why we used apiAlice
  await claimQueue.run();  

  console.log("Claim filled");*/
}

// npx ts-node src/polymesh.ts claimDividendDistribution
async function claimDividendDistribution() {
  let api: Polymesh = await getConnection(mnemonicString3);

  const identity = (await api.getSigningIdentity())!;
  console.log(`Connected! Signing Identity ID: ${identity.did}`);

  const ticker = "ASSET01";

  const asset = await api.assets.getAsset({ ticker });
  console.log(`Asset found! Current asset name is: ${(await asset.details()).name}`);

  //const originPortfolio = await identity.portfolios.getPortfolio({ portfolioId: new BigNumber(0) });


/*
    console.log("going to create dividends");
    // this creates a Corporate Action under the hood and then uses it to create the Dividend Distribution
    const object = await asset.corporateActions.distributions.getOne({id: new BigNumber(6)});

    console.log(object.distribution.id.toString());

    const tmp = await object.distribution.claim();
    await tmp.run();

    console.log("Claim is called")*/
}

// npx ts-node src/polymesh.ts payDividendDistribution
async function payDividendDistribution() {
  let api: Polymesh = await getConnection(mnemonicString3);

  const identity = (await api.getSigningIdentity())!;
  console.log(`Connected! Signing Identity ID: ${identity.did}`);

  const ticker = "ASSET01";

  const asset = await api.assets.getAsset({ ticker });
  console.log(`Asset found! Current asset name is: ${(await asset.details()).name}`);

  //const originPortfolio = await identity.portfolios.getPortfolio({ portfolioId: new BigNumber(0) });



    /*console.log("going to get dividends");
    // this creates a Corporate Action under the hood and then uses it to create the Dividend Distribution
    const object = await asset.corporateActions.distributions.getOne({id: new BigNumber(8)});

    console.log(object.distribution.id.toString(10));

    const tmp = await object.distribution.pay({ targets: ["0xfd38c10a0ed8c81212698d02afcb0abfc9c9a80b57619682e9feb6706f71daa5", "0x4d241b9bc81837e1dc6e92562d14cfd86da1fe995a57623d9c69a2e75bca0272"]});
    await tmp.run();
    console.log("Pay is called")*/
}


// npx ts-node src/polymesh.ts removeStablecoinReceiptRestriction
async function removeStablecoinReceiptRestriction() {
  let api: Polymesh = await getConnection(mnemonicString4);

  const identity = (await api.getSigningIdentity())!;
  console.log(`Connected! Signing Identity ID: ${identity.did}`);

    const unSubscribe = await api._polkadotApi.tx.asset
    .preApproveTicker(        
        "STABLECOIN05"
    ).signAndSend("5Fc9E7RLNvK5vxpErkAbstSoAYjYsDz1s3ZpsfvpbqcsXZ6y", (result) => {
        console.log("............")
        console.log( JSON.stringify(result) )
        if( result.isFinalized )
             console.log("fianlized");
        if( result.isCompleted )
            console.log("completed");
        if(result.isError)
            console.log("error");
    });


}




const renderClaim = ({ target, issuer, issuedAt, expiry, claim }: ClaimData, pos: number): void => {
    console.log(`Claim #${pos} ${issuedAt ? `issued at ${issuedAt}` : ``}`);
    console.log(`Target: ${target.did}`);
    console.log(`Issuer: ${issuer.did}`);
    if (expiry) {
      console.log(`Expiry date: ${expiry}`);
    }
    console.log(`Claim: ${claim.type}`);
    console.log('\n');
};



  async function getConnection(mnemonic?: string): Promise<Polymesh> {

    const localSigningManager = await LocalSigningManager.create({
      accounts: [{ mnemonic: mnemonic || '//Alice' }],
    });

    let api: Polymesh = await Polymesh.connect({
      nodeUrl: "wss://testnet-rpc.polymesh.live",
      middlewareV2: {
        link: "https://testnet-graphqlnative.polymath.network",
        key: "nBdcFXMFXLawqrh4STJG69IlVCp1Psve4qq0wfpe"
      },
      signingManager: localSigningManager,
    });



    console.log("connected");

    return api;
  }





/*
Dividend Distribution 

PolymeshDividend
id
title
description
details
declarationDate
checkpointID
paymentDate
currency
maxAmount
perShare
expiryDate


PolymeshDividendCheckpoint
id
polymeshDividendID
investorID
pulicKey
Amount
isPaid


Listing screen
New Dividend 
Dividend Details with partcipents and if they are paid or not 
*/