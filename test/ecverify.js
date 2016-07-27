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
});
