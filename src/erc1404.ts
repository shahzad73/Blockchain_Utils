import fs from "fs";
import web3 from "web3"

var args = process.argv.slice(2);

//local
//var contract_address = "0x3F4B2e1B4Ca4B32EF29e3bf90362d30Cc45B30a5";
//var service_address = "0x3F4B2e1B4Ca4B32EF29e3bf90362d30Cc45B30a5";

//kovan
var contract_address = "0x783b55DDf115d713c4CAf0944f42fC4eDd45387b";
var service_address = "0x783b55DDf115d713c4CAf0944f42fC4eDd45387b";

//var linkToBlockchainServer = "HTTP://127.0.0.1:7545";
// var linkToBlockchainServer = "https://mainnet.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";
//var linkToBlockchainServer = "https://matic-mumbai--jsonrpc.datahub.figment.io/apikey/9737e952f56cd7bdca83d6bb4fdf1576"      //Polygone test
var linkToBlockchainServer = "https://matic-mainnet--jsonrpc.datahub.figment.io/apikey/9737e952f56cd7bdca83d6bb4fdf1576"      //Polygone mainnet
//var linkToBlockchainServer = "https://data-seed-prebsc-1-s1.binance.org:8545"      //Binanace chain testnet    not yet tested
//var linkToBlockchainServer = "https://bsc-dataseed1.binance.org"    // Binance chain mainnet     

//var dolloarValue = 2000;    // Ethereum
var dolloarValue = 2.35;       // Polygon    MATIC, the native tokens of Polygon
//var dolloarValue = 380;       //BNB for bianace chain
 



//npx ts-node src/erc1404.ts test
if(args[0] == "test" )
    console.log("Heisenberg");
if(args[0] == "deployERC1404" )
    deployERC1404()



const ERC1404Token = JSON.parse(fs.readFileSync("./data/ERC1404.json", "utf8")); 



//npx ts-node src/erc1404.ts deployERC1404
async function deployERC1404() {

    //var web3i = new web3.providers.HttpProvider(linkToBlockchainServer);

    const encodedParameters = web3.eth.abi.encodeParameters(
      ['uint256', 'string', 'string', 'uint256', 'uint256', 'string', 'string', 'string'],
      ['100000000000000000000000', 'ERC04', 'ERC04', 5, 18, "Site website link", "Website link document", " website document links"]
    ).slice(2);


      // prepare the transaction:
      var rawTx = {
            from: "0x1a8929fbE9abEc00CDfCda8907408848cBeb5300",
            data:  ERC1404Token.bytecode  + encodedParameters,
            gas: 6721975
      }

      
      var gasPrice = await web3.eth.getGasPrice();
                  
      let estimateGasPromise = web3.eth.estimateGas({
          data: ERC1404Token.bytecode  + encodedParameters
      });						
      const allPromises = Promise.all([estimateGasPromise]);
      var gas = await allPromises;
  
      var block = await web3.eth.getBlock("latest");
      //var gasLimit = block.gasLimit/block.transactions.length;

              
      const etherValue = web3.utils.fromWei(gasPrice, 'ether');
      console.log("gasLimit: " + block.gasLimit);
      
      //this is the constant used in multisto  i have increased the size in that estimation as well
      console.log( "Gas Estimate : " + gas )				

      console.log(gas);

      /*var vv1 = gas * etherValue;
      console.log( "Gas : " + gasPrice )		
      console.log( "ETH :" +  );		
      console.log( "$" + gas * etherValue *  dolloarValue);*/

}


