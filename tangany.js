const async = require('async');
const fs = require('fs');
const axios = require("axios");

//https://npm.io/package/@tangany/waas    documentation for tangany 

/*

*/

if (process.argv[2] == "test") {
		//node tangany test
	
		axios.post("https://api.tangany.com/v1/wallets", {
			"headers": {
				"Content-Type": "application/json",
				"tangany-client-id": "464ac44d-9d4d-4146-8882-398e8f1d3281",
				"tangany-client-secret": "UBnL.TfwXY1EN7llf3acm6dQ-0-l8-3Q55",
				"tangany-vault-url": "https://cw-keyv-demo-xin-fin.vault.azure.net",
				"tangany-subscription": "74350b79022c42d8b1da7f5f771091cc"
			}, "data": {
				"wallet": "Wallet1",
				"useHsm": false,
				"tags": [
					{"hasKYC": true}
				]
			}
		}).then(response => {
				console.log(response.data);
		 }).catch((error) => {
				console.log(error);
		 });	

}

