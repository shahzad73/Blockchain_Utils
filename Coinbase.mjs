'use strict'  

//var Client = require("coinbase").Client;
import fetch from 'node-fetch';


/*
const url = 'https://api.prime.coinbase.com/v1/portfolios';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'X-CB-ACCESS-KEY': 'ZdlFsitVWo4=IS4UU08Gq4TMJOFj5QL6mXiGEF+QpJy03PMANJXDYss=',
    'X-CB-ACCESS-PASSPHRASE': '5Rb5KFBCGLQ=PT5+nIbmlPPwcHcciV/E5A==7',
    'X-CB-ACCESS-SIGNATURE': '',
    'X-CB-ACCESS-TIMESTAMP': '1667585222'
  }
};


fetch(url, options)
  .then(res => res.json())
  .then(json => {
      console.log("............")
      console.log(json)
  })
  .catch(err => {
      console.log("............");
      console.error('error:' + err)
  });
*/



import https from 'https';
import CryptoJS from 'crypto-js';

const SIGNING_KEY = "/NqFL5Fk4qM=wiEixOsVDTjgEnWGjOobKWcDzA80ZyTnjuJK2kIc/t4BwXbFRzMYHuLvYZAKEjS9FyP/jQqnQX+F3jaSzhjSkw==";
const ACCESS_KEY = "ZdlFsitVWo4=enVtGHgP5x2gz3hPtFaIz+4a1rm7OSactqv1m1xrnAs=";
const PASSPHRASE = "5Rb5KFBCGLQ=dWdAesBSp8wiiM7yCwVXmw=="
const REST_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};


// portfolios id  28980275-647f-4770-8ce1-fe2cac97d351
// name  Default Portfolio
// entity_id  c6b97a2d-92f0-4fa4-a198-c007cbd4e249
// organization_id  efb68d67-02f6-4e80-83bf-65aa610146ce


const PROD_URL = 'api.prime.coinbase.com';

//let requestPath = `/v1/portfolios`;  //get all portfolios
//let requestPath = `/v1/portfolios/28980275-647f-4770-8ce1-fe2cac97d351`;   //get single portfolio with id
//let requestPath = `/v1/portfolios/28980275-647f-4770-8ce1-fe2cac97d351/wallets`;  //get wallets in portfolios
//let requestPath = `/v1/entities/c6b97a2d-92f0-4fa4-a198-c007cbd4e249/assets`;   //get assets in a entity

// let requestPath = `/v1/entities/c6b97a2d-92f0-4fa4-a198-c007cbd4e249/users`;   //get users in a entity
// {"users":[{"id":"040133cd-0edb-5d1e-a2ae-57bdf8a5af70","name":"Eric Lord","email":"eric@investorcosmos.com","entity_id":"","role":"ADMIN"}],"pagination":{"next_cursor":"","sort_direction":"DESC","has_next":false}}

//let requestPath = `/v1/portfolios/28980275-647f-4770-8ce1-fe2cac97d351/users`;  //get users in portfolios
//{"users":[{"id":"040133cd-0edb-5d1e-a2ae-57bdf8a5af70","name":"Eric Lord","email":"eric@investorcosmos.com","portfolio_id":"28980275-647f-4770-8ce1-fe2cac97d351","entity_id":"c6b97a2d-92f0-4fa4-a198-c007cbd4e249","role":"ADMIN"}],"pagination":{"next_cursor":"","sort_direction":"DESC","has_next":false}}

let requestPath = `/v1/portfolios/28980275-647f-4770-8ce1-fe2cac97d351/address_book`;  //get address book in portfolios



let method = REST_METHODS.GET;

const currentTimeInSecs = Math.floor(Date.now() / 1000);

const body = '';

function sign(str, secret) {
    const hash = CryptoJS.HmacSHA256(str, secret);
    return hash.toString(CryptoJS.enc.Base64);
}

function buildPayload(ts, method, requestPath, body) {
    return `${ts}${method}${requestPath}${body}`;
}

const strToSign = buildPayload(currentTimeInSecs, method, requestPath, body);

const sig = sign(strToSign, SIGNING_KEY);

const headers = new Map();
headers.set('X-CB-ACCESS-KEY', ACCESS_KEY);
headers.set('X-CB-ACCESS-PASSPHRASE', PASSPHRASE);
headers.set('X-CB-ACCESS-SIGNATURE', sig);
headers.set('X-CB-ACCESS-TIMESTAMP', currentTimeInSecs);
headers.set('Content-Type', 'application/json');
const requestOptions = {
    hostname: PROD_URL,
    path: requestPath,
    method: REST_METHODS.GET,
    headers: Object.fromEntries(headers),
};
https.get(requestOptions, res => {
    let data = [];
    console.log('Status Code:', res.statusCode);
    res.on('data', chunk => {
        data.push(chunk);
    });
    res.on('end', () => {
        console.log('Response ended: ');
        const parsedResponse = Buffer.concat(data).toString();
        console.log(parsedResponse);
    });
}).on('error', err => {
    console.log('Error: ', err.message);
});






/*var client = new Client({   
    'apiKey': 'C4q5uoU0KAmSytBt',                         
    'apiSecret': 'kBEs9olucHpc4RwDy3xugATffWTSy7uE',
    'strictSSL': false
});*/


// https://api.coinbase.com/v2/accounts/:account_id/addresses


/*client.getAccounts({}, function(err, accounts) {
  console.log(accounts);
});*/

/*
cf51c57-dd39-5d96-a196-48f1380a8707    DAI Wallet    wallet    DAI 
9506c4ea-b755-571f-b582-10dc1322b239   OXT Wallet    wallet    OXT 
a3c09ad7-1450-5178-9334-661b7cecf6b9   ZEC Wallet    wallet    ZEC 
79791353-fd46-513f-a729-8af77db36319   DASH Wallet   wallet    DASH 
dca2ef43-9d0d-5072-8e19-c52bdd8e54c3   XLM Wallet    wallet    XLM 
61a93348-5b6d-5e1a-90b0-62db1294e9a7   ATOM Wallet   wallet    ATOM 
c87bf031-f13f-598d-a64f-ea8e88433de1   XTZ Wallet    wallet    XTZ 
e4dbcf0f-e402-55d2-b583-3072a0764cf9   XRP Wallet    wallet    XRP 
acf8a7a2-f4fc-5518-a247-0eeccf162a52   OMG Wallet    wallet    OMG 
251ef4c8-dc06-5c02-a80b-5b27008ab7f3   KNC Wallet    wallet    KNC 
04914a7f-34af-5546-9cce-72d3542aa832   EOS Wallet    wallet    EOS 
8d869a32-e5e9-5c87-ba73-5ee797d94a45   USDC Wallet   wallet    USDC 
447b639f-c576-57e3-9a14-52384aba2bce   MKR Wallet    wallet    MKR 
a079574a-d07f-516b-99fc-8b01cbc132e3   ALGO Wallet   wallet    ALGO 
2a99da1b-7b96-5ab5-9547-78ca12913c8a   LINK Wallet   wallet    LINK 
b8d79fb1-e282-529b-91c2-c79f2cadf80b   BAT Wallet    wallet    BAT 
35572391-0762-5b3e-b0d9-1536ced68c0e   REP Wallet    wallet    REP 
2f878621-47f4-5535-a97f-262d0aa00789   COMP Wallet   wallet    COMP 
9b8575d8-42b0-5527-b7dc-0168b94e48cb   ZRX Wallet    wallet    ZRX 
04867cb4-3676-5041-8c62-9f121f26688a   LTC Wallet    wallet    LTC 
82f7c8e5-d94c-5ce5-a127-5d2f4a9bdb4e   ETC Wallet    wallet    ETC 
ab7ef662-b348-5edf-bac6-a702b6ef8998   ETH Wallet    wallet    ETH 
ddb35f48-12bf-5c45-ad47-8ac8007394dc   BCH Wallet    wallet    BCH 
b8d95608-af81-50e0-8e62-1bac8c356cbc   BTC Wallet    wallet    BTC
*/

/*
      id: 'b8d95608-af81-50e0-8e62-1bac8c356cbc',
      name: 'BTC Wallet',
      primary: true,
      type: 'wallet',
      currency: 'BTC',
      balance: { amount: '0.00000000', currency: 'BTC' },
      created_at: '2018-10-15T17:43:17Z',
      updated_at: '2018-10-15T17:43:19Z',
      resource: 'account',
      resource_path: '/v2/accounts/b8d95608-af81-50e0-8e62-1bac8c356cbc',
      allow_deposits: true,
      allow_withdrawals: true,
      native_balance: { amount: '0.00', currency: 'PKR' } }
*/

// Get all account details
/*client.getAccounts({}, function(err, accounts) {
    if (err != null) {
       console.log(err);
    }
            
    for(var i = 0; i < accounts.length; i++)
    {
        console.log(`${accounts[i].id}   ${accounts[i].name}    ${accounts[i].type}    ${accounts[i].currency} `);
    }    
});*/

// get user details
/*client.getCurrentUser(function(err, user) {
  console.log(user);
});*/

// get account details
/*client.getAccount("453b87a0-2f10-58eb-b08e-9310d9d7c22f", function(err, account) {
  console.log(account);
});*/

//get account addresses 
/*client.getAccount('b8d95608-af81-50e0-8e62-1bac8c356cbc', function(err, account) {
    account.getAddresses(null, function(err, addresses) {
        console.log(addresses);
    });
});*/

/*client.getAccount('82f7c8e5-d94c-5ce5-a127-5d2f4a9bdb4e', function(err, account) {
  account.createAddress(null, function(err, address) {
    console.log(address);
  });
});*/

//Request Money
/*client.getAccount('b8d95608-af81-50e0-8e62-1bac8c356cbc', function(err, account) {

    if (err) 
        console.log(err);
    else {        

          account.requestMoney({
                    'to': 'shahzad73@hotmail.com', 
                    'amount': '1', 
                    'currency': 'BTC',
                    'idem': 'RE-111111'
          }, function(err, tx) {
                if (err) {
                   console.log(err);
                } else                               
                   console.log(tx);
              }
          );

    } 

});*/

/*client.getExchangeRates({'currency': 'BTC'}, function(err, rates) {
  console.log(rates);
});*/

/*client.getCurrencies(function(err, currencies) {
  console.log(currencies);
});*/

/*client.getAccount('453b87a0-2f10-58eb-b08e-9310d9d7c22f', function(err, account) {
      if(err)
          console.log(err)
      else {
            account.getTransactions(function(err, txs) {
                console.log(txs);
            });
      }
});*/


/*client.getPaymentMethods(function(err, pms) {
  console.log(pms);
});*/


/*client.getAccount('ddb35f48-12bf-5c45-ad47-8ac8007394dc', function(err, account) {
    if(err) {
        console.log("Error" + err)
    } else {
        account.getTransactions(null, function(err, txs) {
            console.log(txs);
        });
    }
});*/

//get address details
/*client.getAccount('b8d95608-af81-50e0-8e62-1bac8c356cbc', function(err, account) {
  account.getAddress('f1e211ef-91cc-576b-a1d5-98b4730b87ec', function(err, address) {
      console.log("here..............")
      if(err)
          console.log(err)
      else
          console.log(address);
  });
});*/





