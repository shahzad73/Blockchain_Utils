const async = require('async');
const fs = require('fs');
const axios = require("axios");

//https://npm.io/package/@tangany/waas    documentation for tangany 

/*

*/




if (process.argv[2] == "test") {
		//node tangany test
	
		axios.post("https://api.tangany.com/v1/eth/erc20/0x4dF75AEE40F7C68D6b5D75E33e011ddAbF1fFCCf/Wallet1", {
			"headers": {
				"tangany-client-id": "464ac44d-9d4d-4146-8882-398e8f1d3281",
				"tangany-client-secret": "UBnL.TfwXY1EN7llf3acm6dQ-0-l8-3Q55",
				"tangany-vault-url": "https://cw-keyv-demo-xin-fin.vault.azure.net",
				"tangany-subscription": "74350b79022c42d8b1da7f5f771091cc"
			}, "data": {

			}
		}).then(response => {
				console.log(response.data);
		 }).catch((error) => {
				console.log(error);
		 });	

}

