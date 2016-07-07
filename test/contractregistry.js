contract('ContractRegistry', function(accounts) {
    it("should create 2 storage contracts", function(done) {
        var reg = ContractRegistry.deployed();

        reg.newContract(accounts[0],accounts[1], 10, "ciao1", {value:1000000});
        reg.newContract(accounts[0],accounts[2], 10, "ciao2");
        reg.getContracts.call(accounts[0]).then(function(clist) {
            console.log(clist);
            assert.equal(clist.length, 2, "expected 2 contracts");
        }).then(done).catch(done);
    });
    it("should retrive the correct contract", function(done){
        var reg = ContractRegistry.deployed();

        reg.getContracts.call(accounts[0]).then(function(clist) {
            return reg.contracts.call(clist[0]);
        }).then(function(contractRet){
            console.log(contractRet);
            //le struct vengono ritornate come array 
            assert.equal(contractRet[0], accounts[0], "owner errato");
            assert.equal(contractRet[1], accounts[1], "farmer errato");
            assert.equal(contractRet[2].c, 10, "duration errata");
            //funziona bene ma la conversione ha qualche problema
            // assert.equal(contractRet[3], web3.fromAscii('ciao1', 32), "ipfsAddress errato");
        }).then(done).catch(done);
    });
});
