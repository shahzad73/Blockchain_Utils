
const {
    mnemonicGenerate,
    mnemonicToMiniSecret,
    mnemonicValidate,
    naclKeypairFromSeed
  } = require('@polkadot/util-crypto');
  import { ApiPromise, WsProvider } from '@polkadot/api';

  const {
    naclDecrypt,
    naclEncrypt,
    randomAsU8a
  } = require('@polkadot/util-crypto');
  const {
    stringToU8a,
    u8aToString
  } = require('@polkadot/util');


var args = process.argv.slice(2);

if(args[0] == "test" )
    test();


// npx ts-node src/polkadot.ts test
async function test(): Promise<void> {

  // Create mnemonic string for Alice using BIP39
  const mnemonicAlice = mnemonicGenerate();

  console.log(`Generated mnemonic: ${mnemonicAlice}`);

  // Validate the mnemonic string that was generated
  const isValidMnemonic = mnemonicValidate(mnemonicAlice);

  console.log(`isValidMnemonic: ${isValidMnemonic}`);

  // Create valid Substrate-compatible seed from mnemonic
  const seedAlice = mnemonicToMiniSecret(mnemonicAlice);

  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log(api.genesisHash.toHex());

  const bbb = api.rpc.eth.blockNumber();
  console.log(bbb);

  // Retrieve the chain & node information information via rpc calls
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);


  const secret = randomAsU8a();
  const messagePreEncryption = stringToU8a('super secret message');

  // Encrypt the message
  const { encrypted, nonce } = naclEncrypt(messagePreEncryption, secret);

  // Show contents of the encrypted message
  console.log(`Encrypted message: ${JSON.stringify(encrypted, null, 2)}`);

  // Decrypt the message
  const messageDecrypted = naclDecrypt(encrypted, nonce, secret);

  // Convert each Uint8Array to a string for comparison
  const isMatch = u8aToString(messagePreEncryption) === u8aToString(messageDecrypted);

  // Verify that the decrypted message matches the original message
  console.log(`Does the decrypted message match the original message? ${isMatch}`);


  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

}

