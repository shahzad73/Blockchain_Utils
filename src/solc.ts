import path from "path";
import async from 'async';

const solc = require('solc');
const fs = require('fs');

var args = process.argv.slice(2);

// npx ts-node src/solc.ts compile
if(args[0] == "compile" ) {

  const source = `
  // SPDX-License-Identifier: MIT

    pragma solidity ^0.8.20;

    import {ERC721} from "~/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

    contract MyCollectible is ERC721 {
        constructor() ERC721("MyCollectible", "MCO") {
        }
    }
  `;

    const input = {
      language: "Solidity",
      sources: {
        "simpleContract": {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output);
    console.log( output.contracts['simpleContract']['MyCollectible'].abi );
    console.log( output.contracts['simpleContract']['MyCollectible'].evm.bytecode.object );

}

