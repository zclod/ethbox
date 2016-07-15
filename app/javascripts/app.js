var accounts;
var account;
var balance;
var ipfs;

function setStatus(message) {
    var list = document.getElementById("contractlist");
    list.innerHTML += "<li> " + message + " </li>";
};


function createContract() {
    var reg = ContractRegistry.deployed();

    var farmer = document.getElementById("farmer").value;
    var duration = parseInt(document.getElementById("duration").value);
    var ipfsAddress = document.getElementById("ipfs").value;

    reg.newContract(accounts[0], farmer, duration, ipfsAddress, 42, {value:1000000, from: accounts[0]}).then(function(){

    });
};

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

        ipfs = IpfsApi('/ip4/127.0.0.1/tcp/5001');
    });

}
