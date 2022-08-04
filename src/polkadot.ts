
const {
    mnemonicGenerate,
    mnemonicToMiniSecret,
    mnemonicValidate,
    naclKeypairFromSeed
  } = require('@polkadot/util-crypto');

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

  // Generate new public/secret keypair for Alice from the supplied seed
  const { publicKey, secretKey } = naclKeypairFromSeed(seedAlice);
}

