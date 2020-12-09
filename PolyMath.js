'use strict'  

const Web3 = require('web3');
const ethereumjs = require('ethereumjs-tx');
var Accounts = require('web3-eth-accounts');
const async = require('async');
const ethereum = require("./modules/ethereum");
const fs = require('fs');

//node PolyMath aaa ~/keystore0forPolyMath.txt

var abi_contract = [{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_uri","type":"string"},{"name":"_documentHash","type":"bytes32"}],"name":"setDocument","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"freezeTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"upgradeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_operator","type":"address"}],"name":"authorizeOperatorByPartition","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"canTransferFrom","outputs":[{"name":"reasonCode","type":"bytes1"},{"name":"appCode","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_module","type":"address"}],"name":"unarchiveModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_tokenHolder","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_operatorData","type":"bytes"}],"name":"operatorRedeemByPartition","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"initialized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_operator","type":"address"}],"name":"revokeOperatorByPartition","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"holderCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"canTransfer","outputs":[{"name":"","type":"bytes1"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_moduleFactory","type":"address"},{"name":"_data","type":"bytes"},{"name":"_maxCost","type":"uint256"},{"name":"_budget","type":"uint256"},{"name":"_label","type":"bytes32"},{"name":"_archived","type":"bool"}],"name":"addModuleWithLabel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_granularity","type":"uint256"}],"name":"changeGranularity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferWithData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenHolder","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_operatorData","type":"bytes"}],"name":"controllerRedeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getterDelegate","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_tokenHolder","type":"address"}],"name":"balanceOfByPartition","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unfreezeTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_module","type":"address"}],"name":"archiveModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isControllable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_module","type":"address"},{"name":"_type","type":"uint8"}],"name":"isModule","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"changeName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"}],"name":"changeTreasuryWallet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"currentCheckpointId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"granularity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_module","type":"address"},{"name":"_change","type":"uint256"},{"name":"_increase","type":"bool"}],"name":"changeModuleBudget","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"redeemByPartition","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dataStore","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_tokenHolder","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"issueByPartition","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"polyToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newTokenDetails","type":"string"}],"name":"updateTokenDetails","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenHolders","type":"address[]"},{"name":"_values","type":"uint256[]"}],"name":"issueMulti","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_signature","type":"bytes"}],"name":"disableController","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"polymathRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controllerDisabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_operatorData","type":"bytes"}],"name":"operatorTransferByPartition","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_controller","type":"address"}],"name":"setController","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dataStore","type":"address"}],"name":"changeDataStore","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"}],"name":"authorizeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenHolder","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"redeemFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_partition","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"canTransferByPartition","outputs":[{"name":"reasonCode","type":"bytes1"},{"name":"appStatusCode","type":"bytes32"},{"name":"toPartition","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_module","type":"address"}],"name":"removeModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_module","type":"address"}],"name":"upgradeModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenContract","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawERC20","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_moduleFactory","type":"address"},{"name":"_data","type":"bytes"},{"name":"_maxCost","type":"uint256"},{"name":"_budget","type":"uint256"},{"name":"_archived","type":"bool"}],"name":"addModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"moduleRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenHolder","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"removeDocument","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_getterDelegate","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"securityTokenRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenDetails","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_signature","type":"bytes"}],"name":"freezeIssuance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transfersFrozen","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenFactory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"redeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferFromWithData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_operatorData","type":"bytes"}],"name":"controllerTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferByPartition","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"updateFromRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"}],"name":"revokeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"createCheckpoint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_types","type":"uint8[]"},{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":true,"name":"_moduleFactory","type":"address"},{"indexed":false,"name":"_module","type":"address"},{"indexed":false,"name":"_moduleCost","type":"uint256"},{"indexed":false,"name":"_budget","type":"uint256"},{"indexed":false,"name":"_label","type":"bytes32"},{"indexed":false,"name":"_archived","type":"bool"}],"name":"ModuleAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_types","type":"uint8[]"},{"indexed":false,"name":"_module","type":"address"}],"name":"ModuleUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_oldDetails","type":"string"},{"indexed":false,"name":"_newDetails","type":"string"}],"name":"UpdateTokenDetails","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_oldName","type":"string"},{"indexed":false,"name":"_newName","type":"string"}],"name":"UpdateTokenName","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_oldGranularity","type":"uint256"},{"indexed":false,"name":"_newGranularity","type":"uint256"}],"name":"GranularityChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"FreezeIssuance","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_status","type":"bool"}],"name":"FreezeTransfers","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_checkpointId","type":"uint256"},{"indexed":false,"name":"_investorLength","type":"uint256"}],"name":"CheckpointCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldController","type":"address"},{"indexed":true,"name":"_newController","type":"address"}],"name":"SetController","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_oldTreasuryWallet","type":"address"},{"indexed":false,"name":"_newTreasuryWallet","type":"address"}],"name":"TreasuryWalletChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"DisableController","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_major","type":"uint8"},{"indexed":false,"name":"_minor","type":"uint8"},{"indexed":false,"name":"_patch","type":"uint8"}],"name":"TokenUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_types","type":"uint8[]"},{"indexed":false,"name":"_module","type":"address"}],"name":"ModuleArchived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_types","type":"uint8[]"},{"indexed":false,"name":"_module","type":"address"}],"name":"ModuleUnarchived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_types","type":"uint8[]"},{"indexed":false,"name":"_module","type":"address"}],"name":"ModuleRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_moduleTypes","type":"uint8[]"},{"indexed":false,"name":"_module","type":"address"},{"indexed":false,"name":"_oldBudget","type":"uint256"},{"indexed":false,"name":"_budget","type":"uint256"}],"name":"ModuleBudgetChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_fromPartition","type":"bytes32"},{"indexed":false,"name":"_operator","type":"address"},{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"},{"indexed":false,"name":"_operatorData","type":"bytes"}],"name":"TransferByPartition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"operator","type":"address"},{"indexed":true,"name":"tokenHolder","type":"address"}],"name":"AuthorizedOperator","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"operator","type":"address"},{"indexed":true,"name":"tokenHolder","type":"address"}],"name":"RevokedOperator","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"partition","type":"bytes32"},{"indexed":true,"name":"operator","type":"address"},{"indexed":true,"name":"tokenHolder","type":"address"}],"name":"AuthorizedOperatorByPartition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"partition","type":"bytes32"},{"indexed":true,"name":"operator","type":"address"},{"indexed":true,"name":"tokenHolder","type":"address"}],"name":"RevokedOperatorByPartition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"partition","type":"bytes32"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"IssuedByPartition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"partition","type":"bytes32"},{"indexed":true,"name":"operator","type":"address"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"},{"indexed":false,"name":"operatorData","type":"bytes"}],"name":"RedeemedByPartition","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_controller","type":"address"},{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"},{"indexed":false,"name":"_operatorData","type":"bytes"}],"name":"ControllerTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_controller","type":"address"},{"indexed":true,"name":"_tokenHolder","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"},{"indexed":false,"name":"_operatorData","type":"bytes"}],"name":"ControllerRedemption","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":false,"name":"_uri","type":"string"},{"indexed":false,"name":"_documentHash","type":"bytes32"}],"name":"DocumentRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":false,"name":"_uri","type":"string"},{"indexed":false,"name":"_documentHash","type":"bytes32"}],"name":"DocumentUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_operator","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"}],"name":"Issued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_operator","type":"address"},{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"}],"name":"Redeemed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];


var abi_service =  [{"constant":true,"inputs":[],"name":"getAllKYCData","outputs":[{"name":"investors","type":"address[]"},{"name":"canSendAfters","type":"uint256[]"},{"name":"canReceiveAfters","type":"uint256[]"},{"name":"expiryTimes","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reclaimETH","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getInitFunction","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_transferTypes","type":"uint8[]"},{"name":"_fromValidKYC","type":"bool[]"},{"name":"_toValidKYC","type":"bool[]"},{"name":"_fromRestricted","type":"bool[]"},{"name":"_toRestricted","type":"bool[]"}],"name":"modifyTransferRequirementsMulti","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"WHITELIST","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_partition","type":"bytes32"},{"name":"_tokenHolder","type":"address"},{"name":"_additionalBalance","type":"uint256"}],"name":"getTokensByPartition","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"},{"name":"_canSendAfter","type":"uint256"},{"name":"_canReceiveAfter","type":"uint256"},{"name":"_expiryTime","type":"uint256"},{"name":"_validFrom","type":"uint256"},{"name":"_validTo","type":"uint256"},{"name":"_nonce","type":"uint256"},{"name":"_signature","type":"bytes"}],"name":"modifyKYCDataSigned","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ADMIN","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"executeTransfer","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"INVESTORFLAGS","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"UNLOCKED","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"polyToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAddressBytes32","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_investor","type":"address"},{"name":"_flag","type":"uint8"}],"name":"getInvestorFlag","outputs":[{"name":"value","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_transferType","type":"uint8"},{"name":"_fromValidKYC","type":"bool"},{"name":"_toValidKYC","type":"bool"},{"name":"_fromRestricted","type":"bool"},{"name":"_toRestricted","type":"bool"}],"name":"modifyTransferRequirements","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenContract","type":"address"}],"name":"reclaimERC20","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_fromIndex","type":"uint256"},{"name":"_toIndex","type":"uint256"}],"name":"getInvestors","outputs":[{"name":"investors","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address[]"},{"name":"_canSendAfter","type":"uint256[]"},{"name":"_canReceiveAfter","type":"uint256[]"},{"name":"_expiryTime","type":"uint256[]"},{"name":"_validFrom","type":"uint256"},{"name":"_validTo","type":"uint256"},{"name":"_nonce","type":"uint256"},{"name":"_signature","type":"bytes"}],"name":"modifyKYCDataSignedMulti","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"OPERATOR","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"nonceMap","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"LOCKED","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"issuanceAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"},{"name":"_flag","type":"uint8"},{"name":"_value","type":"bool"}],"name":"modifyInvestorFlag","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"securityToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_investor","type":"address"}],"name":"getInvestorFlags","outputs":[{"name":"flags","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"INVESTORSKEY","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPermissions","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint8"}],"name":"transferRequirements","outputs":[{"name":"fromValidKYC","type":"bool"},{"name":"toValidKYC","type":"bool"},{"name":"fromRestricted","type":"bool"},{"name":"toRestricted","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"},{"name":"_canSendAfter","type":"uint64"},{"name":"_canReceiveAfter","type":"uint64"},{"name":"_expiryTime","type":"uint64"}],"name":"modifyKYCData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllInvestors","outputs":[{"name":"investors","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investors","type":"address[]"},{"name":"_canSendAfter","type":"uint64[]"},{"name":"_canReceiveAfter","type":"uint64[]"},{"name":"_expiryTime","type":"uint64[]"}],"name":"modifyKYCDataMulti","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_issuanceAddress","type":"address"}],"name":"changeIssuanceAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_investors","type":"address[]"}],"name":"getKYCData","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"defaults","outputs":[{"name":"canSendAfter","type":"uint64"},{"name":"canReceiveAfter","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_defaultCanSendAfter","type":"uint64"},{"name":"_defaultCanReceiveAfter","type":"uint64"}],"name":"changeDefaults","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"bytes"}],"name":"verifyTransfer","outputs":[{"name":"","type":"uint8"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllInvestorFlags","outputs":[{"name":"investors","type":"address[]"},{"name":"flags","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investors","type":"address[]"},{"name":"_flag","type":"uint8[]"},{"name":"_value","type":"bool[]"}],"name":"modifyInvestorFlagMulti","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getDataStore","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_securityToken","type":"address"},{"name":"_polyToken","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_issuanceAddress","type":"address"}],"name":"ChangeIssuanceAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_defaultCanSendAfter","type":"uint64"},{"indexed":false,"name":"_defaultCanReceiveAfter","type":"uint64"}],"name":"ChangeDefaults","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_investor","type":"address"},{"indexed":true,"name":"_addedBy","type":"address"},{"indexed":false,"name":"_canSendAfter","type":"uint64"},{"indexed":false,"name":"_canReceiveAfter","type":"uint64"},{"indexed":false,"name":"_expiryTime","type":"uint64"}],"name":"ModifyKYCData","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_investor","type":"address"},{"indexed":true,"name":"_flag","type":"uint8"},{"indexed":false,"name":"_value","type":"bool"}],"name":"ModifyInvestorFlag","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_transferType","type":"uint8"},{"indexed":false,"name":"_fromValidKYC","type":"bool"},{"indexed":false,"name":"_toValidKYC","type":"bool"},{"indexed":false,"name":"_fromRestricted","type":"bool"},{"indexed":false,"name":"_toRestricted","type":"bool"}],"name":"ModifyTransferRequirements","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"}],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"}],"name":"Unpause","type":"event"}];

//infura link
//https://ropsten.infura.io/v3/fe41724da6f24b76a782f376b2698ee8

var contract_address = "0xd8272d26a012c319c8eaa9683e857b205ea4d500";
var service_address= "0x65d5b5811a64872b799d72edfb225eabfc924c09";
var linkToBlockchainServer = "https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";

//let data2 = decryptKeyFromFile(process.argv[3], process.argv[2]);

if (process.argv[2] == "etherBalance") {

	// node PolyMath etherBalance 0xea1466402fc4b0a0b4959e4cd040e79a7309b3c9
	ethereum.getAccountEtherBalance( process.argv[3], abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "stoTokenBalance") {
	// node PolyMath stoTokenBalance 0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9

	ethereum.getAccountStoBalance( process.argv[3], abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "TotalSupply") {
    //// node PolyMath TotalSupply
	ethereum.getTotalSupplyOfTokens( abi_contract, contract_address, linkToBlockchainServer).then(function(data){
		console.log(data);
        process.exit(0);
	})

}

if (process.argv[2] == "issue") {
	// node PolyMath issue aaa ~/WorkingDocuments/Ethereum_polymathkey.txt 50000000000000000000000000

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    console.log(data2.address)
	ethereum.tokenCreateBurn(1, 2, data2.address, process.argv[5], data2.privateKey.substring(2), contract_address, linkToBlockchainServer, abi_contract).then(function(data){
		console.log("done");
        process.exit(0);
	}).catch((error) => { 
         console.log(error);
    });

}

if (process.argv[2] == "burn") {
	// node PolyMath burn aaa ~/WorkingDocuments/Ethereum_polymathkey.txt 1000000000000000000

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);

	ethereum.tokenCreateBurn(2, 2, data2.address,  process.argv[5], data2.privateKey.substring(2), contract_address, linkToBlockchainServer, abi_contract).then(function(data){
		console.log("done");
        process.exit(0);
	}).catch((error) => { 
         console.log(error);
    });    


}

if (process.argv[2] == "whiteListInvestor") {
    //node PolyMath whiteListInvestor aaa ~/WorkingDocuments/Ethereum_polymathkey.txt 0x5b31fC93a7a120D467651BF2aD15b0940E0Fcbd5 true

    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);

    ethereum.whitelisAddress(2, data2.address, process.argv[5], process.argv[6], data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, abi_service).then(function(data){
        console.log(data);
        process.exit(0);
    }).catch((err) => {
        console.log("ddddd");
        process.exit(0);
    });

}

if (process.argv[2] == "sendTokens") {
    // node PolyMath sendTokens aaa ~/WorkingDocuments/Ethereum_polymathkey.txt 0x5b31fC93a7a120D467651BF2aD15b0940E0Fcbd5 90
    
    let data2 = decryptKeyFromFile(process.argv[4], process.argv[3]);
    console.log(data2.address + " " + process.argv[5])
    
    ethereum.sendTokens(data2.address, process.argv[5],  process.argv[6],  data2.privateKey.substring(2), contract_address, service_address, linkToBlockchainServer, abi_contract).then(function(data){
		console.log(data);
        process.exit(0);
	}).catch((error) => { 
         console.log(error);
    });  

}



function decryptKeyFromFile(file, password) {
	let data = fs.readFileSync(file, 'utf8')
    return ethereum.decryptKey(data, password, linkToBlockchainServer);
    
    //return    {"privateKey": "", "address": ""}
}