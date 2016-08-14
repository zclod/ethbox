var util = require('ethereumjs-util');
var sha3 = require('solidity-sha3').default;
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// function signatureVerify(msgHash, signature, signer){
//     let sigParams = util.fromRpcSig(signature);
//     let pubKey = util.ecrecover(util.toBuffer(msgHash),sigParams.v, sigParams.r, sigParams.s);
//     let signerAddress = '0x' + util.pubToAddress(pubKey).toString('hex');

//     return signer === signerAddress;
// }

// function signContract(contract){
//     let contractHash = hashContract(contract);

//     return web3.eth.sign(contract.farmer, contractHash);
// }

// function hashContract(contract){
//     return sha3(contract.owner, contract.farmer, contract.ipfsAddress, contract.weiPerBlock, contract.proofWindow, contract.maxStartDate, contract.duration);
// }

exports.signatureVerify = function(msgHash, signature, signer){
    let sigParams = util.fromRpcSig(signature);
    let pubKey = util.ecrecover(util.toBuffer(msgHash),sigParams.v, sigParams.r, sigParams.s);
    let signerAddress = '0x' + util.pubToAddress(pubKey).toString('hex');

    return signer === signerAddress;
}

exports.signContract = function (contract){
    let contractHash = exports.hashContract(contract);

    return web3.eth.sign(contract.farmer, contractHash);
}

exports.hashContract = function(contract){
    return sha3(contract.owner, contract.farmer, contract.ipfsAddress, contract.weiPerBlock, contract.proofWindow, contract.maxStartDate, contract.duration);
}
