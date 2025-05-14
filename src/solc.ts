import path from "path";
import async from 'async';

const solc = require('solc');
const fs = require('fs');


var args = process.argv.slice(2);

// npx ts-node src/solc.ts compile
if(args[0] == "compile" ) {


  const solidityContractString = `
  import "node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
  contract MyToken is ERC20 {
      // Your implementation
  }
`;

const preprocessedContract = readAndResolveFile(solidityContractString);
console.log( preprocessedContract   )

const input = {
  language: 'Solidity',
  sources: {
      'MyContract.sol': {
          content: preprocessedContract,
      },
  },
  settings: {
      outputSelection: {
          '*': {
              '*': ['*'],
          },
      },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contractInfo = output.contracts['MyContract.sol']['MyContract'];

const compiledContract = {
  abi: contractInfo.abi,
  bytecode: contractInfo.evm.bytecode.object,
};

console.log('Compiled Contract:', compiledContract);


}

// npx ts-node src/solc.ts compile2
if(args[0] == "compile2") {

  const contractPath = path.resolve(__dirname, '../contract.sol');
  const contractSource = fs.readFileSync(contractPath, 'utf8');

  interface SolidityInput {
    language: string;
    sources: {
      [filename: string]: {
        content: string;
      };
    };
    settings: {
      outputSelection: {
        '*': {
          '*': string[];
        };
      };
    };
  }

  const input: SolidityInput = {
    language: 'Solidity',
    sources: {
      'contract.sol': {
        content: contractSource,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };


  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
      console.error(output.errors);
  } else {

      console.log("...................ABI......................")
      console.log( output.contracts['contract.sol']['ERC20Token'].abi )
      console.log("............................................")
      console.log( output.contracts['contract.sol']['ERC20Token'].evm.bytecode.object )
            
  }



}


function readAndResolveFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dirname = path.dirname(filePath);
  return content.replace(/import\s["']([^"']+)["']/g, (match: any, p1: string) => {
      const importPath = path.join(dirname, p1);
      return readAndResolveFile(importPath);
  });
}
