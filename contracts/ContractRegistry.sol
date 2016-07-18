contract ContractRegistry{


    struct StorageContract {
        address owner;
        address farmer;
        bytes32 ipfsAddress;

        //block number when the contract end
        uint expireDate;
        // possibile bloccare i fondi di pagamento
        // direttamente nel contratto?
        uint founds;
        //quanto pagare ogni blocco(unita di tempo) sulla blockchain
        uint weiPerBlock;
        //the contract is running
        // bool isActive;
        //ultimo blocco in cui e stata fatta una proof of storage
        uint lastBlockProof;
    }


    event NewContract(
        uint contractID,
        address indexed onwer,
        address indexed farmer,
        uint terminationBlock
    );


    uint numContracts;
    mapping(uint => StorageContract) public contracts;


    function newContract(address owner, address farmer, uint duration, bytes32 ipfsAddress, uint costPerBlock) {
        uint contractID = numContracts++;
        uint terminationBlock = block.number + duration;
        contracts[contractID] = StorageContract(owner, farmer, ipfsAddress, terminationBlock, msg.value, costPerBlock, 0);

        NewContract(contractID, owner, farmer, terminationBlock);
    }


    function deposit(uint contractID){
        StorageContract c = contracts[contractID];
        c.founds += msg.value;
    }


    function proof(uint contractID, bytes proof){
        StorageContract c = contracts[contractID];
        if(msg.sender != c.farmer)
            throw;

        //TODO
        //test of the proof

        var timePassed = block.number - c.lastBlockProof;
        c.lastBlockProof = block.number;
        var payAmount = c.weiPerBlock * timePassed;
        c.founds -= payAmount;
        c.farmer.send(payAmount);
    }


    // function activateContract(uint contractID){}


    // function withdraw(uint contractID, uint amount){
    //     c = contracts[contractID];
    //     if (!isActive && msg.sender == c.owner && amount <= c.founds){
    //         c.owner.send(amount);
    //     }
    // }
}
