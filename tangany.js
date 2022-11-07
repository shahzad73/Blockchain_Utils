const async = require('async');
const fs = require('fs');
const axios = require("axios");
const http = require("https");


//https://npm.io/package/@tangany/waas    documentation for tangany 

const headers = {
	"tangany-ethereum-network": "coinbase",
	"tangany-client-id": "fe4ec570-aeb1-4dd0-aa4e-8206369f4699",
	"tangany-client-secret": "GKh8Q~CIJp9ykStAebcnprPJ3HSKVfgjk2wXUbQQ",
	"tangany-vault-url": "https://cw-keyv-demo-digishare.vault.azure.net",
	"tangany-subscription": "f8e548fba2624a0ab69096a0b37eff55",
	"tangany-ethereum-network": "goerli"
}


if (process.argv[2] == "send") {
		//node tangany send
	
	const headers = {
		"tangany-ethereum-network": "ropsten",
		"tangany-client-id": "464ac44d-9d4d-4146-8882-398e8f1d3281",
		"tangany-client-secret": "UBnL.TfwXY1EN7llf3acm6dQ-0-l8-3Q55",
		"tangany-vault-url": "https://cw-keyv-demo-xin-fin.vault.azure.net",
		"tangany-subscription": "74350b79022c42d8b1da7f5f771091cc"
	}
	
	const data =  {
		"function": "transfer(address,uint256)",
		"inputs": [
			"0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9",
			"10000000000000000000"
		]
	}
		

	axios.post("https://api.tangany.com/v1/eth/contract/0x4dF75AEE40F7C68D6b5D75E33e011ddAbF1fFCCf/Wallet1/send-async", data,{
		headers: headers
	}).then(response => {
			console.log(response.data.statusUri);
	 }).catch((error) => {
			console.log(error);
	 });	

}



if (process.argv[2] == "createWallet") {
	//node tangany createWallet
	var options = {
	  method: 'POST',
	  url: 'https://api.tangany.com/v1/wallets',
	  headers: headers,
	  data: {
		wallet: 'Wallet1',
		useHsm: false,
		tags: [
		  {description: 'example user'},
		  {epoch: 1631096008},
		  {isTest: true},
		  {flag_1: null}
		]
	  }
	};
	
	axios.request(options).then(function (response) {
	  console.log(response.data);
	}).catch(function (error) {
	  console.error(error);
	});



	/*
		This wallet is created
			{
			wallet: 'Wallet1',
			version: '1fc234bc30fc4e468d6b0d9470cc2eae',
			created: '2022-11-04T11:58:24.000Z',
			updated: '2022-11-04T11:58:24.000Z',
			security: 'software',
			public: {
				secp256k1: '04ad2dfc95238e0f8b8643a143b6c267680b932494d51c01d080d0313f081bd2c0cafed55b719488fc016e19573d40c4059772627b2f16e4542fb5d0ec256f92e9'
			},
			tags: [
				{ description: 'example user' },
				{ epoch: 1631096008 },
				{ isTest: true },
				{ flag_1: null }
			]
			}
	*/	

}

if (process.argv[2] == "getWallet") {
	//node tangany getWallet
 
	var options = {
		method: 'GET',
		url: 'https://api.tangany.com/v1/wallet/Wallet1',
		headers: headers
	};
	
	axios.request(options).then(function (response) {
		console.log(response.data);
	}).catch(function (error) {
		console.error(error);
	});
}



if (process.argv[2] == "getWalletETH") {
	//node tangany getWalletETH

	var options = {
		method: 'GET',
		url: 'https://api.tangany.com/v1/eth/wallet/Wallet1',
		headers: headers
	};
	
	axios.request(options).then(function (response) {
		console.log(response.data);
	}).catch(function (error) {
		console.error(error);
	});
}



if (process.argv[2] == "status") {
		//node tangany status
	
	

	const data =  {}
		

	axios.get("https://api.tangany.com/v1/wallets", {
		headers: headers
	}).then(response => {
			console.log(response.data.process);
	 }).catch((error) => {
			console.log(error);
	 });	

}


//{ statusUri: '/request/c4e4390a9d0e4edfb9334f21bd14d1cf' }



