var sha3 = require('solidity-sha3');

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

        let contractHash = sha3.default(contract.owner, contract.farmer, contract.ipfsAddress, contract.weiPerBlock, contract.proofWindow, contract.maxStartDate, contract.duration);

        let signature = web3.eth.sign(contract.farmer, contractHash);

        registry.NewContract(function(err, event){
            assert.equal(event.args.owner, contract.owner, "owner errato");
            assert.equal(event.args.farmer, contract.farmer, "farmer errato");
            done();
        });

        registry.newContractVerified(contract.owner, contract.farmer, contract.ipfsAddress, contract.weiPerBlock, contract.proofWindow, contract.maxStartDate, contract.duration, signature, {value: 314});
    });
});
