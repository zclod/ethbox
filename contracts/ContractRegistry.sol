contract ContractRegistry{


    struct StorageContract {
        address owner;
        address farmer;
        uint expireDate;
        bytes32 ipfsAddress;

        // possibile bloccare i fondi di pagamento
        // direttamente nel contratto?
        uint amount;
    }


    uint numContracts;
    mapping(address => uint[]) contractIndex;

    mapping(uint => StorageContract) public contracts;


    function getContracts(address owner) constant returns (uint[] contractList){
        return contractIndex[owner];
    }

    function newContract(address owner, address farmer, uint expireDate, bytes32 ipfsAddress) returns (uint contractID){
        contractID = numContracts++;
        contracts[contractID] = StorageContract(owner, farmer, expireDate, ipfsAddress, msg.value);

        contractIndex[owner].push(contractID);
        contractIndex[farmer].push(contractID);
    }
}
