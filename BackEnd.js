//Create the compiler
compiler = require('solc');

//Obtain the Source Code of the Smart Contract
sc = fs.readFileSync('Wallet.sol').toString();

//Compile the Smart Contract
cc = compiler.compile(sc);

//Obtain the interface and compiled byte code of the Smart Contract
abi = JSON.parse(cc.contracts[":Wallet"].interface);
bc = cc.contracts[":Wallet"].bytecode;

//Obtain a web3 object
ethJS = require('web3');
web3 = new ethJS('http://localhost:8545');

//Obtain the accounts on the BlockChain
owners = []
web3.eth.getAccounts().then(function(result){owners.push(result);})

//Create an instance of the Smart Contract
inst_contract = new web3.eth.Contract(abi);

//Deploy the Smart Contract onto the BlockChain
//Note: owners is now a 2-D array, with the addresses stored inside the inner array. That's why the values are passed this way. 
inst_contract.deploy({data: bc, arguments: owners}).send({from: owners[0][0], gas: 1000000}).then(function(result){myContract = result;})

//Deposit money in the Wallet
myContract.methods.deposit(100).send({from: owners[0][1]});

//Check the Wallet's balance
myContract.methods.getBalance().call().then(console.log);

//Add an Owner
acc = web3.eth.accounts.create();
myContract.methods.addOwner(acc.address).send({from: owners[0][0]});

//Display the list of owners
myContract.methods.displayOwners().call().then(console.log);

//Remove an owner
myContract.methods.removeOwner(owners[0][0]).send({from: owners[0][1]}, gas: 1000000);

//Display the list of owners
myContract.methods.displayOwners().call().then(console.log);

//Generate withdraw requests and display the balance at each stage
for(i = 0; i < 5; i = i + 1){
	myContract.methods.withdraw(20, owners[0][0]).send({from: owners[0][0]});
	myContract.methods.getBalance().call().then(console.log);
}
myContract.methods.getBalance().call().then(console.log);