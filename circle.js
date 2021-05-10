const Web3 = require('web3');
const ethereumjs = require('ethereumjs-tx');
var Accounts = require('web3-eth-accounts');
const async = require('async');
const fs = require('fs');
const ethereum = require("./modules/ethereum");
const fetch = require('node-fetch');
const atob = require('atob');
const btoa = require('btoa');
const openpgp = require('openpgp');

const key = "QVBJX0tFWTpkZmM1YmJhOTI3ZmY0MzA5M2Q3MTJkZTUwMmRhZGE3NzpiNTY1MThkYjA0NTNkYjhkNGJiYTQyOGYwOTAwNDU3Yw==";


//Balances
if (process.argv[2] == "getCongigurations") {
    // node circle getCongigurations

        const url = 'https://api-sandbox.circle.com/v1/configuration';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getAccountBalances") {
    // node circle getAccountBalances

        const url = 'https://api-sandbox.circle.com/v1/balances';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}


//Create the Bank Account You Will Accept a Payment From
if (process.argv[2] == "createBankAccount") {
        // node circle createBankAccount
        const url = 'https://api-sandbox.circle.com/v1/banks/wires';

        const params = getOptions("POST");
        params.body = JSON.stringify( {
            "idempotencyKey":"2ee62bf2-bd71-49ce-b599-165ffcc33689",
            "beneficiaryName":"Waqar Ahmad", 
            "accountNumber":"9934567892", 
            "routingNumber":"021000021", 
            "billingDetails":{"name":"Waqar Ahmad", "city":"NewYark", "country":"US", "line1":"1 Main Street", "district":"MA", "postalCode":"03201"}, 
            "bankAddress":{"country":"US"}
        } );
    
        fetch(url, params)
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getBankAccountByID") {
        // node circle getBankAccountByID 1c369bc5-0ee5-4088-825e-f724182724bf
        // node circle getBankAccountByID cab8fc14-6134-47a1-9005-bc7843dc15ed    
        // node circle getBankAccountByID e1ad4b0b-e9bb-47e7-9fb8-f6262621d9a6
        // node circle getBankAccountByID 26ebdb35-5254-4868-8ee2-1fdf7b0a75a0

        const url = 'https://api-sandbox.circle.com/v1/banks/wires/' + process.argv[3];

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getBankAccountInstructionsByID") {
    // node circle getBankAccountInstructionsByID e1ad4b0b-e9bb-47e7-9fb8-f6262621d9a6

        var url = 'https://api-sandbox.circle.com/v1/banks/wires/' + process.argv[3] + '/instructions';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "setBankTransferMockInfo") {
        // node circle setBankTransferMockInfo CIR2PMXKTZ
        // node circle setBankTransferMockInfo CIR2DGNB85
        var url = 'https://api-sandbox.circle.com/v1/mocks/payments/wire';
        
        const params = getOptions("POST");
        params.body = JSON.stringify( {
            "trackingRef":  process.argv[3], 
            "amount": { "amount": "2600.00", "currency": "USD"}
        } );


        fetch(url, params)
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getPaymentByID") {
    // node circle getPaymentByID 986c37c3-566f-4d52-af57-0756ea72347c

        const url = 'https://api-sandbox.circle.com/v1/payments/' + process.argv[3];

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}


//Payments    payments are inbound
if (process.argv[2] == "getPayments") {
        // node circle getPayments

        const url = 'https://api-sandbox.circle.com/v1/payments';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}


//settlements 
if (process.argv[2] == "getSettlements") {
    // node circle getSettlements 

        var url = 'https://api-sandbox.circle.com/v1/settlements';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getSettlementInfo") {
        // node circle getSettlementInfo d258a112-11b1-4cd1-974d-e26a09767439 

        var url = 'https://api-sandbox.circle.com/v1/settlements/' +process.argv[3];

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}


//Wallets
if (process.argv[2] == "createNewWallet") {
        // node circle createNewWallet
        const url = 'https://api-sandbox.circle.com/v1/wallets';

        const params = getOptions("POST");
        params.body = JSON.stringify( {
            "idempotencyKey":"899890f6-a910-11eb-bcbc-0242ac130002",
            "description": "This is my first wallet"
        } );
    
        fetch(url, params)
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getAllWallet") {
        // node circle getAllWallet

        const url = 'https://api-sandbox.circle.com/v1/wallets';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getAWallet") {
        // node circle getAWallet 1000083142

        const url = 'https://api-sandbox.circle.com/v1/wallets/' + process.argv[3] ;

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "createNewWalletBlockchainAddress") {
        // node circle createNewWalletBlockchainAddress 1000083142
        const url = 'https://api-sandbox.circle.com/v1/wallets/' + process.argv[3]  + '/addresses' ;

        const params = getOptions("POST");
        params.body = JSON.stringify( {
            "idempotencyKey":"199810f6-a910-11ab-bcbc-0242ac130002",
            "currency": "USD",
            "chain": "ETH"
        } );
    
        fetch(url, params)
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getAllWalletAddress") {
        // node circle getAllWalletAddress 1000083142

        const url = 'https://api-sandbox.circle.com/v1/wallets/' + process.argv[3]  + '/addresses' ;

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}


//Transfer wallet to external source
if (process.argv[2] == "createTransferBlockchain") {
        // node circle createTransferBlockchain
        
        const url = 'https://api-sandbox.circle.com/v1/transfers';

        const params = getOptions("POST");
        params.body = JSON.stringify( {
            "idempotencyKey":"899890f6-a910-11eb-bcbc-0242ac130002",
            "source": {"type":"wallet", "id": "1000083142"},
            "destination": {type: 'blockchain', address: '0xDB0d238BAeF0bDE591841a66eC886f3dC7A8De48', chain: 'ETH'},
            "amount": {currency: 'USD', amount: '404'}            
        } );

        fetch(url, params)
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getAllTransfers") {
        // node circle getAllTransfers

        const url = 'https://api-sandbox.circle.com/v1/transfers';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getTransferInfo") {
        // node circle getTransferInfo 2985bd4a-e683-4d16-ac3d-a14971562b78
        const url = 'https://api-sandbox.circle.com/v1/transfers/' + process.argv[3];

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}


if (process.argv[2] == "getEncryptionInfo") {
    // node circle getEncryptionInfo

        const url = 'https://api-sandbox.circle.com/v1/encryption/public';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json =>{ 


                        const decodedPublicKey = atob( json.data.publicKey )
                        asyncEncryptData(decodedPublicKey).then(function(data) {

                                console.log(data);

                        })

            
            
            } ).catch(err => console.error('error:' + err));
                

                

}






//Business Bank Accounts
if (process.argv[2] == "getBankAccountsListBusinessAccount") {
    // node circle getBankAccountsListBusinessAccount

        const url = 'https://api-sandbox.circle.com/v1/businessAccount/banks/wires';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "createBankAccountBusinessAccount") {
        // node circle createBankAccountBusinessAccount
        const url = 'https://api-sandbox.circle.com/v1/businessAccount/banks/wires';

        const params = getOptions("POST");
        params.body = JSON.stringify( {
            "idempotencyKey":"6ae62bf2-bd71-49ce-b599-165ffcc33681",
            "beneficiaryName":"John Smith 3", 
            "accountNumber":"34434567892", 
            "routingNumber":"125000105", 
            "billingDetails":{"name":"John Smith2", "city":"Boston", "country":"US", "line1":"1 Main Street", "district":"MA", "postalCode":"02202"}, 
            "bankAddress":{"country":"US"}
        } );
    
        fetch(url, params)
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getBankAccountLstBusinessAccounts") {
    // node circle getBankAccountLstBusinessAccounts 

        const url = 'https://api-sandbox.circle.com/v1/businessAccount/banks/wires';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getBusinessAccountBalances") {
    // node circle getBusinessAccountBalances

        const url = 'https://api-sandbox.circle.com/v1/businessAccount/balances';

        fetch(url, getOptions("GET"))
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}


//Addresses 
if (process.argv[2] == "getAddressesDeposit") {
    // node circle getAddressesDeposit
    
    const url = 'https://api-sandbox.circle.com/v1/businessAccount/wallets/addresses/deposit';
    
    fetch(url, getOptions("GET") )
      .then(res => res.json())
      .then(  json => console.log(json)  )
      .catch(err => console.error('error:' + err));        
}
if (process.argv[2] == "setNewAddressesDeposit") {
        // node circle setNewAddressesDeposit
        const url = 'https://api-sandbox.circle.com/v1/businessAccount/wallets/addresses/deposit' ;

        const params = getOptions("POST");
        params.body =  JSON.stringify({
                currency: 'USD',
                chain: 'ETH',
                idempotencyKey: 'b8ff04f2-abd0-11eb-8529-0242ac130003'
        })
    
        fetch(url, params)
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}
if (process.argv[2] == "getAddressesRecipients") {
    // node circle getAddressesRecipients
    
    const url = 'https://api-sandbox.circle.com/v1/businessAccount/wallets/addresses/recipient';
    
    fetch(url, getOptions("GET") )
      .then(res => res.json())
      .then(  json => console.log(json)  )
      .catch(err => console.error('error:' + err));        
}
if (process.argv[2] == "addNewAddressesDeposit") {
        // node circle addNewAddressesDeposit
        const url = 'https://api-sandbox.circle.com/v1/businessAccount/wallets/addresses/recipient' ;

        const params = getOptions("POST");
        params.body =  JSON.stringify({
                currency: 'USD',
                description: 'THis is some desc',            
                address: '0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9',                        
                chain: 'ETH',
                idempotencyKey: 'ba943ff1-ca16-49b2-ba55-1057e70ca5c6'
        })

        fetch(url, params)
          .then(res => res.json())
          .then(json => console.log( JSON.stringify(json) ) )
          .catch(err => console.error('error:' + err));

}



function getOptions(method) {
    
        return {
            method: method, 
            headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',                
                 'Authorization': ' Bearer ' + key
            }
        };    
    
}






