const Polymesh =  require("@polymathnetwork/polymesh-sdk"); 


const async = require('async');

if (process.argv[2] == "test") {
    //node PolyMesh test

    performOperation1();

}





async function performOperation1() {

    const apiAlice = await Polymesh.Polymesh.connect({
        "nodeUrl": "wss://testnet-rpc.polymesh.live", // For instance, or the proper network
        "accountMnemonic": "riot arm extra another way tumble clump between city pottery chronic lumber"
    });

    console.log("going to create test");

    const reservationQueue = await apiAlice.assets.reserveTicker({
        "ticker": "DIGITest1"
    });

    console.log("created ticket . . . .")

}
