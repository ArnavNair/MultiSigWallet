//Create the compiler
compiler = require('solc');

//Obtain the Source Code of the Smart Contract
sc = fs.readFileSync('Wallet.sol').toString();

//Compile the Smart Contract
cc = compiler.compile(sc);

//Obtain the interface and compiled byte code of the Smart Contract
abi = JSON.parse(cc.contracts[":Wallet"].interface);
bc = cc.contracts[":Wallet"].byteCode;

//Obtain a web3 object
ethJS = require('web3');
web3 = new ethJS('http://localhost:8545');

//Obtain the accounts on the BlockChain
web3.eth.getAccounts().then(function(result){accounts = result;})

//Create an instance of the Smart Contract
inst_contract = new web3.eth.Contract(abi);

//Deploy the Smart Contract onto the BlockChain
inst_contract.deploy({data: bc}).send({from: accounts[0]}).then(function(result){myContract = result;})