const Web3 = require('web3');
const ethereumjs = require('ethereumjs-tx');
var Accounts = require('web3-eth-accounts');
const async = require('async');
const fs = require('fs');
const ethereum = require("./modules/ethereum");


const contractabi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"originator","type":"address"},{"indexed":false,"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"Closed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"originator","type":"address"},{"indexed":false,"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"Expired","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"originator","type":"address"},{"indexed":false,"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"Opened","type":"event"},{"inputs":[{"internalType":"address","name":"originator","type":"address"},{"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"close","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"originator","type":"address"},{"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"expire","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"originator","type":"address"},{"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"getSwapData","outputs":[{"components":[{"internalType":"address","name":"executor","type":"address"},{"internalType":"address","name":"openingToken","type":"address"},{"internalType":"uint256","name":"tokensToOpen","type":"uint256"},{"internalType":"address","name":"closingToken","type":"address"},{"internalType":"uint256","name":"tokensToClose","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"}],"internalType":"struct ERC20TokenSwapper.Swap","name":"","type":"tuple"},{"internalType":"uint256","name":"swapState","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"swapNumber","type":"uint256"},{"internalType":"address","name":"_executor","type":"address"},{"internalType":"address","name":"_openingToken","type":"address"},{"internalType":"uint256","name":"_tokensToOpen","type":"uint256"},{"internalType":"address","name":"_closingToken","type":"address"},{"internalType":"uint256","name":"_tokensToClose","type":"uint256"},{"internalType":"uint256","name":"_expiry","type":"uint256"}],"name":"open","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];


var contract_address = "0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9";
var web3Address = "https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";


if (process.argv[2] == "open") {
    
        //node swap open a ~/WorkingDocuments/Ethereum_localkey.txt uint256 swapNumber, address _executor, address _openingToken, uint256 _tokensToOpen, address _closingToken, uint256 _tokensToClose, uint256 _expiry) external returns(bool     

        //node swap open a ~/WorkingDocuments/Ethereum_localkey.txt 5665 0xcD063145Fcd75aca7C2c3CaD2675B4328dbd8f83 0x7Cf01fbAd42d2FEa2b0D697aa7Ee022801cD2154 50 0xF2A6143Bf60885d2044a744943d09ca1C05EF66F 250 1644733968
    
        // function open(uint256 swapNumber, address _executor, address _openingToken, uint256 _tokensToOpen, address _closingToken, uint256 _tokensToClose, uint256 _expiry) external returns(bool) {

        // 5   uint256 swapNumber 
        // 6   address _executor
        // 7   address _openingToken
        // 8   uint256 _tokensToOpen
        // 9   address _closingToken
        // 10 uint256 _tokensToClose
        // 11 uint256 _expiry    
    
    
            let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);

			try {
				    const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
                
				    web3.eth.net.isListening().then(() => {

					const contract = new web3.eth.Contract(contractabi, contract_address);
					const privateKey = Buffer.from( data2.privateKey.substring(2)  , 'hex');                    

                    const _swapNumber = web3.utils.toHex(process.argv[5]);
                    const _executor = process.argv[6];
                    const _openingToken = process.argv[7];
                    const _tokensToOpen = web3.utils.toHex(process.argv[8]);                    
                    const _closingToken = process.argv[9];
                    const _tokensToClose = web3.utils.toHex(process.argv[10]);
                    const _expiry = web3.utils.toHex(process.argv[11]);
                                        
					web3.eth.defaultAccount = data2.address;

					let estimateGasPromise = '';
                    

                    estimateGasPromise = web3.eth.estimateGas({
                        to: contract_address,
                        data: contract.methods.open( _swapNumber, _executor,  _openingToken,  _tokensToOpen,  _closingToken,  _tokensToClose,  _expiry ).encodeABI(),
                    });

					const nouncePromise = web3.eth.getTransactionCount(data2.address, 'pending');

					const allPromises = Promise.all([nouncePromise, estimateGasPromise]);
                    
					allPromises.then((results) => {

						// creating raw tranaction
						const rawTransaction = {
							from: data2.address,
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: 93399 + 1000000,
							to: contract_address,
							value: 0x0,
                            data: contract.methods.open( _swapNumber, _executor,  _openingToken,  _tokensToOpen,  _closingToken,  _tokensToClose,  _expiry ).encodeABI(),
							nonce: web3.utils.toHex(results[0]),
						};

                        // creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);

						// signing transaction with private key
						transaction.sign(privateKey);

						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log( `Sending transaction`);

						web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {

							if (err) {
								reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in whitelisAddress` });
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`sendTokens - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
											return;
										}
										console.log(`sendTokens transaction completed with txId-${txId}`);
									},
								);
							}
						});

					}).catch((err) => {
                        console.log( err.toString() );
					});                    
                    
                    
				})
				.catch((err) => {
                    console.log(   `${err.message}.  Ethereum network connection error in swap open`   )
				});
			} catch (err) {
                    console.log(   `${err.message}.  Ethereum network connection error in swap open`   )
			}


}

if (process.argv[2] == "expire") {
    
            //function expire(address originator, uint256 swapNumber) external returns(bool)
    
            //node swap expire a ~/WorkingDocuments/Ethereum_localkey.txt 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9  1234  
    
    
            let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);

			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
                
				web3.eth.net.isListening().then(() => {

					const contract = new web3.eth.Contract(contractabi, contract_address);
					const privateKey = Buffer.from( data2.privateKey.substring(2)  , 'hex');                    

                    const _executor = process.argv[5];
                    const _swapNumber = web3.utils.toHex(process.argv[6]);                    
                                        
					web3.eth.defaultAccount = data2.address;

					let estimateGasPromise = '';
                    

                    estimateGasPromise = web3.eth.estimateGas({
                        to: contract_address,
                        data: contract.methods.expire(_executor, _swapNumber ).encodeABI(),
                    });

					const nouncePromise = web3.eth.getTransactionCount(data2.address, 'pending');

					const allPromises = Promise.all([nouncePromise, estimateGasPromise]);
                    
					allPromises.then((results) => {

						// creating raw tranaction
						const rawTransaction = {
							from: data2.address,
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: 93399 + 1000000,
							to: contract_address,
							value: 0x0,
                            data: contract.methods.expire(_executor, _swapNumber ).encodeABI(),
							nonce: web3.utils.toHex(results[0]),
						};


						// creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);

						// signing transaction with private key
						transaction.sign(privateKey);

						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log( `Sending transaction`);

						web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {

							if (err) {
								reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in whitelisAddress` });
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`sendTokens - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
											return;
										}
										console.log(`sendTokens transaction completed with txId-${txId}`);
									},
								);
							}
						});

					}).catch((err) => {
                        console.log( err.toString() );
					});                    
                    
                    
				})
				.catch((err) => {
                    console.log(   `${err.message}.  Ethereum network connection error in swap open`   )
				});
			} catch (err) {
                    console.log(   `${err.message}.  Ethereum network connection error in swap open`   )
			}


    
}

if (process.argv[2] == "close") {
    
            //close(address originator, uint256 swapNumber) external returns(bool) {
    
            //node swap close a ~/WorkingDocuments/Ethereum_localkey2.txt 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9 5665

            let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    
			try {
				const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));
                
				web3.eth.net.isListening().then(() => {

					const contract = new web3.eth.Contract(contractabi, contract_address);
					const privateKey = Buffer.from( data2.privateKey.substring(2)  , 'hex');                    

                    const _executor = process.argv[5];
                    const _swapNumber = web3.utils.toHex(process.argv[6]);                    
                                        
					web3.eth.defaultAccount = data2.address;

					let estimateGasPromise = '';
                    

                    estimateGasPromise = web3.eth.estimateGas({
                        to: contract_address,
                        data: contract.methods.close(_executor, _swapNumber ).encodeABI(),
                    });

					const nouncePromise = web3.eth.getTransactionCount(data2.address, 'pending');

					const allPromises = Promise.all([nouncePromise, estimateGasPromise]);
                    
					allPromises.then((results) => {

						// creating raw tranaction
						const rawTransaction = {
							from: data2.address,
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: 93399 + 1000000,
							to: contract_address,
							value: 0x0,
                            data: contract.methods.close(_executor, _swapNumber ).encodeABI(),
							nonce: web3.utils.toHex(results[0]),
						};


						// creating tranaction via ethereumjs-tx
						const transaction = new ethereumjs(rawTransaction);

						// signing transaction with private key
						transaction.sign(privateKey);

						// sending transacton via web3 module
						const serializedTx = transaction.serialize();

						console.log( `Sending transaction`);

						web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, txId) => {

							if (err) {
								reject({ code: '0', message: `${err.message}. Error calling sendSignedTransaction in whitelisAddress` });
							} else {
								async.retry(
									{ times: 5, interval: 1000 },
									(callbackRetry) => {
										web3.eth.getTransactionReceipt(txId).then((data) => {
											if (data == null) {
												callbackRetry('error', 0);
											} else {
												callbackRetry(null, 1);
											}
										});
									}, (err2, result) => {
										if (err2 != null) {
											console.log(`sendTokens - Some error occured and execution cannot be confirmed ${err2.toString()} ${result}`);
											return;
										}
										console.log(`sendTokens transaction completed with txId-${txId}`);
									},
								);
							}
						});

					}).catch((err) => {
                        console.log( err.toString() );
					});                    
                    

				})
				.catch((err) => {
                    console.log(   `${err.message}.  Ethereum network connection error in swap open`   )
				});
			} catch (err) {
                    console.log(   `${err.message}.  Ethereum network connection error in swap open`   )
			}


    
}



function decryptKeyFromFile(file, password) {
	let data = fs.readFileSync(file, 'utf8')
    return ethereum.decryptKey(data, password, web3Address);
    
    //return    {"privateKey": "", "address": ""}
}



















/*


/**
 *Submitted for verification at Etherscan.io on 2021-02-02
*/ /*

// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.7.5;
pragma abicoder v2;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */ /*
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     */ /*
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        uint256 c = a + b;
        if (c < a) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     */ /*
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b > a) return (false, 0);
        return (true, a - b);
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     */ /*
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) return (true, 0);
        uint256 c = a * b;
        if (c / a != b) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     */ /*
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a / b);
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     */ /*
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a % b);
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */ /*
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */ /*
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */ /*
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */ /*
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */ /*
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */ /*
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        return a - b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryDiv}.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */ /*
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */ /*
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a % b;
    }
}

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */ /*
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */ /*
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */ /*
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */ /*
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */ /*
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */ /*
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */ /*
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */ /*
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */ /*
    event Approval(address indexed owner, address indexed spender, uint256 value);
}




/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */ /*
abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

/**
 * @dev Collection of functions related to the address type
 */ /*
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */ /*
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     *//*
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain`call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     *//*
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
      return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     *//*
    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     *//*
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     *//*
    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: value }(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     *//*
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     *//*
    function functionStaticCall(address target, bytes memory data, string memory errorMessage) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.staticcall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.3._
     *//*
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.3._
     *//*
    function functionDelegateCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function _verifyCallResult(bool success, bytes memory returndata, string memory errorMessage) private pure returns(bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 *//*
library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     *//*
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        // solhint-disable-next-line max-line-length
        require((value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(value, "SafeERC20: decreased allowance below zero");
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *//*
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) { // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}




contract ERC20TokenSwapper {
    struct Swap {
        address executor;
        address openingToken;
        uint256 tokensToOpen;
        address closingToken;
        uint256 tokensToClose;
        uint256 expiry;
    }

    enum States {
        INVALID,
        OPEN,
        CLOSED,
        EXPIRED
    }

    //swaps stored as allSwaps[swapOriginator][swapNumber]
    mapping(address => mapping(uint256 => Swap)) allSwaps;
    //separately tracks corresponding swap states
    mapping(address => mapping(uint256 => States)) swapStates;

    event Opened(address originator, uint256 swapNumber);
    event Closed(address originator, uint256 swapNumber);
    event Expired(address originator, uint256 swapNumber);

    function open(uint256 swapNumber, address _executor, address _openingToken, uint256 _tokensToOpen, address _closingToken, uint256 _tokensToClose, uint256 _expiry) external returns(bool) {
        //fetch details of swap
        Swap memory swap = allSwaps[msg.sender][swapNumber];
        //check if swap number already used
        require(swapStates[msg.sender][swapNumber] == States.INVALID, "TokenSwapper: swapNumber already used");
        //fill in new swap details
        swap = Swap({
            executor: _executor,
            openingToken: _openingToken,
            tokensToOpen: _tokensToOpen,
            closingToken: _closingToken,
            tokensToClose: _tokensToClose,
            expiry: _expiry
        });

        //transfer tokensToOpen from swap creator
        IERC20 token = IERC20(_openingToken);
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), _tokensToOpen);

        //set swap to open
        swapStates[msg.sender][swapNumber] = States.OPEN;

        //store swap details in storage
        allSwaps[msg.sender][swapNumber] = swap;

        //emit event
        emit Opened(msg.sender, swapNumber);

        return true;
    }

    function close(address originator, uint256 swapNumber) external returns(bool) {
        //fetch swap data
        Swap memory swap = allSwaps[originator][swapNumber];

        require(swapStates[originator][swapNumber] == States.OPEN, "TokenSwapper: swap not open");
        require(msg.sender == swap.executor, "TokenSwapper: incorrect swap executor");
        require(block.timestamp <= swap.expiry, "TokenSwapper: swap expiration passed");

        //transfer tokensToClose from msg.sender to originator
        IERC20 tokenB = IERC20(swap.closingToken);
        SafeERC20.safeTransferFrom(tokenB, msg.sender, originator, swap.tokensToClose);

        //set swap to closed
        swapStates[originator][swapNumber] = States.CLOSED;

        //transfer tokensToOpen from originator to msg.sender
        IERC20 tokenA = IERC20(swap.openingToken);
        SafeERC20.safeTransfer(tokenA, msg.sender, swap.tokensToOpen);

        //emit event
        emit Closed(originator, swapNumber);

        return true;
    }

    function expire(address originator, uint256 swapNumber) external returns(bool) {
        //fetch swap data
        Swap memory swap = allSwaps[originator][swapNumber];

        require(swapStates[originator][swapNumber] == States.OPEN, "TokenSwapper: swap not open");
        require(block.timestamp > swap.expiry, "TokenSwapper: swap not yet expired");

        //set swap to expired
        swapStates[originator][swapNumber] = States.EXPIRED;

        //transfer tokensToOpen back to originator
        IERC20 token = IERC20(swap.openingToken);
        SafeERC20.safeTransfer(token, originator, swap.tokensToOpen);

        //emit event
        emit Expired(originator, swapNumber);

        return true;
    }

    function getSwapData(address originator, uint256 swapNumber) external view
    returns(Swap memory, uint256 swapState){
        Swap memory swap = allSwaps[originator][swapNumber];
        return(swap, uint256(swapStates[originator][swapNumber]));
    }
}


*/