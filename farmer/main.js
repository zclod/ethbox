const Promise = require('bluebird');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const Pudding = require('ether-pudding'); // v2.0.9
const ContractRegistry = require('../environments/development/contracts/ContractRegistry.sol.js');
Pudding.setWeb3(web3);
ContractRegistry.load(Pudding);
const reg = ContractRegistry.deployed();

//parse the ethereum address of the farmer
// var argv = require("electron").argv();

// if(!argv.params.address)
var account;
var contractList = [];
var indexes;

var getAccounts = Promise.promisify(web3.eth.getAccounts);

getAccounts(
).then(function(accs){
    account = accs[0];
}).then(function(){
    return reg.getContracts.call(account);
}).then(function(indexes){
    return Promise.map(indexes, function(i){
        return reg.contracts.call(i);
    });
}).then(function(contracts){
    contractList = contracts;
}).then(function(){
    console.log(contractList);
});
//-------------------------------------------------------------------------------------------------




//-------------------------------------------------------------------------------------------------
//listen for the latest block (main loop)

// var latestBlockFilter = web3.eth.filter('latest');

// latestBlockFilter.watch(function(err, blockhash){
//     if(err)
//         console.log(err);

//     console.log(blockhash);
// });

