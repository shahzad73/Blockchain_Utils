// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

    contract HelloWorld {
    
       string public message;
    
       constructor(string memory initMessage) public {
            message = initMessage;
        }
    
       function update(string memory newMessage) public {
          message = newMessage;
          }
    }