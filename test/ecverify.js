var sha3 = require('solidity-sha3');


contract('ECVerify', function(accounts){
    it("should check the signature correct", function(done){
        let verify = ECVerify.deployed();

        let data = "hello world!";
        // let dataHash = "0x" + web3.sha3(data);
        let dataHash = sha3.default(data);
        let signer = accounts[0];

        let signature = web3.eth.sign(signer, dataHash);

        verify.ecverify.call(dataHash, signature, signer).then(function(isCorrect){
            assert.equal(isCorrect, true, "the signature should match");
        }).then(done).catch(done);

    });
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
