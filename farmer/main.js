'use strict';

const Promise = require('bluebird');
const async = require('async');

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
Promise.promisifyAll(ipfs);

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

var getAccounts = Promise.promisify(web3.eth.getAccounts);


//setup account
function setupAccount(callback){
    getAccounts().then(function(accounts){
        account = accounts[1];
        callback();
    });
}

//get past contracts
function setupPreviousContracts(callback){
    let pastEvents = reg.NewContract({farmer: account}, {fromBlock:0});
    let result = pastEvents.get(function(err, logs){
        Promise.map(logs, (l) => {
            return l.args.contractID;
        }).then((contractIDs) => {
            contractList = contractIDs;
            callback();
        });
    });
}

function app(){
    let myEvent = reg.NewContract({farmer: account});
    myEvent.watch(function(err, res){
        contractList.push(res.args.contractID);
    });


    let latestBlockFilter = web3.eth.filter('latest');
    latestBlockFilter.watch(function(err, blockhash){
        if(err)
            console.log(err);

        let lastBlockNumber = web3.eth.blockNumber;

        Promise.map(contractList, (id) => {
            let currentContract = reg.contracts.call(id);
            return Promise.join(id, currentContract, (contractID, contract)=>{
                let formattedContract = formatContract(contract);
                formattedContract.id = contractID;
                return formattedContract;
            });
        }).then((contracts) =>{
            let contractToProve = contracts
                .filter((c) => {return c.expireDate > lastBlockNumber;})
                .filter((c) => {return lastBlockNumber - c.lastBlockProof > 0.7 * c.proofWindow;});

            Promise.map(contractToProve, (c) => {
                reg.proof(c.id, 21, {from: account}).then(()=>{
                    ipfs.lsAsync(c.ipfsAddress)
                        .then((res)=>{console.log(res);});
                });
            });
        });
    });
}

function formatContract(unformattedContract){
    return {
        owner          : unformattedContract[0],
        farmer         : unformattedContract[1],
        ipfsAddress    : unformattedContract[2],
        expireDate     : unformattedContract[3],
        founds         : unformattedContract[4],
        weiPerBlock    : unformattedContract[5],
        lastBlockProof : unformattedContract[6],
        proofWindow    : unformattedContract[7]
    };
}

async.series([setupAccount, setupPreviousContracts],
             app);
