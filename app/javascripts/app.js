var accounts;
var account;
var balance;
var ipfs;
var peer;

function setStatus(message) {
    var list = document.getElementById("contractlist");
    list.innerHTML += "<li> " + message + " </li>";
};


function createContract() {
    var reg = ContractRegistry.deployed();
    reg.NewContract(function(err, event){
        console.log(event);
    });

    var farmer = document.getElementById("farmer").value;
    var duration = parseInt(document.getElementById("duration").value);
    var ipfsAddress = document.getElementById("ipfs").value;

    peer = new Peer(farmer, {host: 'localhost', port: 9000});
    peer.on('connection', function(conn) {
        conn.on('data', function(data){
            let request = data;
            console.log(data);

            request.maxStartDate = web3.eth.blockNumber + 100;
            let signature = ethboxutil.signContract(request);
            let finalContract = {
                contract: request,
                signature: signature
            };
            conn.send(finalContract);
        });
    });
    // reg.newContract(accounts[0], farmer, duration, ipfsAddress, 42, {value:1000000, gas:1000000, from: accounts[0]}).then(function(){

    // });
};

function send(){
    var farmer = document.getElementById("farmer").value;
    var ipfsAddress = document.getElementById("ipfs").value;

    let contractOffer = {
        owner: accounts[0],
        farmer: farmer,
        ipfsAddress: ipfsAddress,
        weiPerBlock:100,
        proofWindow : 42,
        duration: 100
    };

    var conn = peer.connect(farmer);
    conn.on('open', function(){
        conn.send(contractOffer);
    });

    conn.on('data', function(data){
        let signedContract = data;
        let isSignatureValid = ethboxutil.signatureVerify(ethboxutil.hashContract(signedContract.contract), signedContract.signature, signedContract.contract.farmer);
        if(isSignatureValid){
            let reg = ContractRegistry.deployed();

            reg.newContractVerified(signedContract.contract.owner,
                                    signedContract.contract.farmer,
                                    signedContract.contract.ipfsAddress,
                                    signedContract.contract.weiPerBlock,
                                    signedContract.contract.proofWindow,
                                    signedContract.contract.maxStartDate,
                                    signedContract.contract.duration,
                                    signedContract.signature, {from: signedContract.contract.owner, value: 314}).then((txHash)=>{console.log(txHash);});
        }
    });
}

window.onload = function() {
    web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        accounts = accs;
        account = accounts[0];

        // ipfs = IpfsApi('/ip4/127.0.0.1/tcp/5001');

    });

}
