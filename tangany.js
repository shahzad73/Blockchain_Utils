const async = require('async');
const fs = require('fs');
const axios = require("axios");

//https://npm.io/package/@tangany/waas    documentation for tangany 



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





if (process.argv[2] == "status") {
		//node tangany status
	
	const headers = {
		"tangany-ethereum-network": "ropsten",
		"tangany-client-id": "464ac44d-9d4d-4146-8882-398e8f1d3281",
		"tangany-client-secret": "UBnL.TfwXY1EN7llf3acm6dQ-0-l8-3Q55",
		"tangany-vault-url": "https://cw-keyv-demo-xin-fin.vault.azure.net",
		"tangany-subscription": "74350b79022c42d8b1da7f5f771091cc"
	}
	
	const data =  {}
		

	axios.get("https://api.tangany.com/v1/request/6d80fdde1de547e3b85ea0d13ad50056", {
		headers: headers
	}).then(response => {
			console.log(response.data.process);
	 }).catch((error) => {
			console.log(error);
	 });	

}


//{ statusUri: '/request/c4e4390a9d0e4edfb9334f21bd14d1cf' }



