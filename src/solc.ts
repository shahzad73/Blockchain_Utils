import path from "path";
import async from 'async';

const solc = require('solc');
const fs = require('fs');

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


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
  
// Read OpenZeppelin contract files and add them to the sources
const openZeppelinContractsPath = __dirname + '/../node_modules/@openzeppelin/contracts/token/';
const openZeppelinContractFiles = fs.readdirSync(openZeppelinContractsPath);

openZeppelinContractFiles.forEach((file: string) => {
  const filePath = path.join(openZeppelinContractsPath, file);
  if (fs.statSync(filePath).isFile()) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    input.sources[file] = { content: fileContent };
  }
});


  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  if (output.errors) {
      console.error(output.errors);
  } else {
      const contractBytecode = output.contracts['contract.sol']['MyToken'].evm.bytecode.object;
      const contractAbi = output.contracts['contract.sol']['MyToken'].abi;
  
      console.log('Bytecode:', contractBytecode);
      console.log('ABI:', JSON.stringify(contractAbi, null, 2));
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
