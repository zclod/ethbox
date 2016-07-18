'use strict';

const Promise = require('bluebird');
const async = require('async');

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
var indexList = [];
var currentBlock;

var asyncTasks = [];

var getAccounts = Promise.promisify(web3.eth.getAccounts);

// getAccounts(
// ).then(function(accs){
//     account = accs[0];
// }).then(function(){
//     return reg.getContracts.call(account);
// }).then(function(indexes){
//     return Promise.map(indexes, function(i){
//         return reg.contracts.call(i);
//     });
// }).then(function(contracts){
//     contractList = contracts;
// }).then(function(){
//     console.log(contractList);
// });
//-------------------------------------------------------------------------------------------------

//setup account
function setupAccount(callback){
    getAccounts().then(function(accounts){
        debugger;
        account = accounts[1];
        callback();
    });
}

//get past contracts
function setupPreviousContracts(callback){
    // debugger;
    // reg.getContracts.call(account).then(
    //     (indexes) => {
    //         debugger;
    //         indexList = indexes;
    //         return Promise.map(indexes, (i) => {
    //             debugger;
    //             return reg.contracts.call(i);
    //         });
    //     }).then((contracts) => {
    //         debugger;
    //         contractList = contracts;
    //         callback();
    //     });
    var pastEvents = reg.NewContract({farmer: account}, {fromBlock:0});
    debugger;
    var result = pastEvents.get(function(err, logs){
        debugger;
        contractList = logs;
        callback();
    });
}

function app(){
    console.log(account);
    console.log(contractList);
    var myEvent = reg.NewContract({farmer: account});
    myEvent.watch(function(err, res){
        console.log(res);
    });
}

// var myEvent = reg.NewContract({farmer: account});
// myEvent.watch(function(err, res){
//     console.log(res);
// });


async.series([setupAccount, setupPreviousContracts],
             app);

// getAccounts(
// ).then(function(accs){
//     account = accs[0];
//     currentBlock = web3.eth.blockNumber;
// }).then(function(){
//     // return pastEvents();
// }).then(function(){
//     // console.log(logs);
//     var history = reg.NewContract({farmer: account}).get(function(err,logs){
//         // var pastEvents = Promise.promisify(history.get);
//         debugger;
//         console.log(logs);
//     });
// });

//-------------------------------------------------------------------------------------------------
//listen for the latest block (main loop)

// var latestBlockFilter = web3.eth.filter('latest');

// latestBlockFilter.watch(function(err, blockhash){
//     if(err)
//         console.log(err);

//     console.log(blockhash);
// });

