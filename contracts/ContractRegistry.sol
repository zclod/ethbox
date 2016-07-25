import "ECVerify.sol";

contract ContractRegistry{


    struct StorageContract {
        address owner;
        address farmer;
        string ipfsAddress;

        //block number when the contract end
        uint expireDate;
        // possibile bloccare i fondi di pagamento
        // direttamente nel contratto?
        uint founds;
        //quanto pagare ogni blocco(unita di tempo) sulla blockchain
        uint weiPerBlock;
        //ultimo blocco in cui e stata fatta una proof of storage
        uint lastBlockProof;
        // max block number between proof
        uint proofWindow;
    }


    event NewContract(
        uint contractID,
        address indexed onwer,
        address indexed farmer
    );


    uint numContracts;
    mapping(uint => StorageContract) public contracts;


    function newContract(address owner, address farmer, uint duration, string ipfsAddress, uint costPerBlock) {
        uint contractID = numContracts++;
        contracts[contractID] = StorageContract(owner, farmer, ipfsAddress, block.number + duration, msg.value, costPerBlock, 0, 10);

        NewContract(contractID, owner, farmer);
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
        if(c.lastBlockProof == 0){
            c.lastBlockProof = block.number;
        }
        else{
          var timePassed = block.number - c.lastBlockProof;
          c.lastBlockProof = block.number;
          var payAmount = c.weiPerBlock * timePassed;
          c.founds -= payAmount;
          c.farmer.send(payAmount);
        }
    }


    // function activateContract(uint contractID){}


    // function withdraw(uint contractID, uint amount){
    //     c = contracts[contractID];
    //     if (!isActive && msg.sender == c.owner && amount <= c.founds){
    //         c.owner.send(amount);
    //     }
    // }
}
