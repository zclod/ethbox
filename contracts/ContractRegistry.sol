import "ECVerify.sol";

contract ContractRegistry{


    struct StorageContract {
        //---------------------------------------------------------
        // in the signature


        address owner;
        address farmer;
        string ipfsAddress;

        //quanto pagare ogni blocco(unita di tempo) sulla blockchain
        uint weiPerBlock;
        // max block number between proof
        uint proofWindow;

        // uint maxStartDate
        // uint duration

        // end of signature
        //---------------------------------------------------------

        //block number when the contract end
        uint expireDate;
        //ultimo blocco in cui e stata fatta una proof of storage
        uint lastBlockProof;
        // founds locked in the contract to pay the farmer
        uint founds;
    }


    event NewContract(
        uint contractID,
        address indexed owner,
        address indexed farmer
    );


    uint numContracts;
    mapping(uint => StorageContract) public contracts;


    // function newContract(address owner, address farmer, uint duration, string ipfsAddress, uint costPerBlock) {
    //     uint contractID = numContracts++;
    //     contracts[contractID] = StorageContract(owner, farmer, ipfsAddress, block.number + duration, msg.value, costPerBlock, 0, 10);

    //     NewContract(contractID, owner, farmer);
    // }


    function newContractVerified(address owner, address farmer, string ipfsAddress, uint weiPerBlock, uint proofWindow, uint maxStartDate, uint duration, bytes signature) {
        // if (block.number > maxStartDate)
        //     throw;

        // if (msg.value < duration * weiPerBlock)
        //     throw;

        //signature verify
        var contractHash = sha3(owner, farmer, ipfsAddress, weiPerBlock, proofWindow, maxStartDate, duration);
        bool isSignatureCorrect = ECVerify.ecverify(contractHash, signature, farmer);

        if(isSignatureCorrect){
            uint contractID = numContracts++;
            contracts[contractID] = StorageContract(owner, farmer, ipfsAddress, weiPerBlock, proofWindow, block.number + duration, block.number, msg.value);
            NewContract(contractID, owner, farmer);
        }
        else throw;

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
