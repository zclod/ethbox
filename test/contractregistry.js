var sha3 = require('solidity-sha3').default;
var util = require('ethereumjs-util');
var ethboxutil = require('../app/javascripts/ethboxutil.js');

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

contract('ContractRegistry', function(accounts) {
    it("should create a contract", function(done){
        let verify = ECVerify.deployed();
        let registry = ContractRegistry.deployed();

        let contract = { owner: accounts[1],
                         farmer: accounts[0],
                         ipfsAddress: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
                         weiPerBlock: 42,
                         proofWindow: 100,
                         maxStartDate: 50,
                         duration: 1000
                       };

        let signature = ethboxutil.signContract(contract);

        // signature validation in javascript
        assert.equal(ethboxutil.signatureVerify(ethboxutil.hashContract(contract), signature, contract.farmer), true, "signature errata");

        registry.NewContract(function(err, event){
            assert.equal(event.args.owner, contract.owner, "owner errato");
            assert.equal(event.args.farmer, contract.farmer, "farmer errato");
            done();
        });

        registry.newContractVerified(contract.owner, contract.farmer, contract.ipfsAddress, contract.weiPerBlock, contract.proofWindow, contract.maxStartDate, contract.duration, signature, {value: 314});
    });
});
