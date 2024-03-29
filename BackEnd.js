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

//Declare a nonce to prevent playback attacks
nonce = 0;

//Deploy the Wallet Contract onto the BlockChain
//Note: owners is now a 2-D array, with the addresses stored inside the inner array. That's why the values are passed this way. 
inst_contract.deploy({data: bc, arguments: owners}).send({from: owners[0][0], gas: 1000000}).then(function(result){myContract = result;})

//Deposit money in the Wallet
myContract.methods.deposit(100, nonce).send({from: owners[0][1], gas: 1000000});
nonce += 1;

//Check the Wallet's balance
myContract.methods.getBalance(nonce).call().then(console.log);

//Add an Owner
acc = web3.eth.accounts.create();
myContract.methods.addOwner(acc.address, nonce).send({from: owners[0][0], gas: 1000000});
nonce += 1;

//Display the list of owners
myContract.methods.displayOwners(nonce).call().then(console.log);

//Remove an owner
myContract.methods.removeOwner(owners[0][0], nonce).send({from: owners[0][1], gas: 1000000});
nonce += 1;

//Display the list of owners
myContract.methods.displayOwners(nonce).call().then(console.log);

//Generate withdraw requests and display the resultant balance
for(i = 0; i < 6; i++){
	myContract.methods.withdraw(20, owners[0][i], nonce).send({from: owners[0][i], gas: 1000000});
	nonce += 1;
}
myContract.methods.getBalance(nonce).call().then(console.log);

//Produce a digital signature for the transaction
sender_adr = owners[0][0];
msg = "Transaction Confirmation Message";
hexMsg = web3.utils.toHex(msg);
web3.eth.sign(hexMsg, sender_adr).then(function(result){signature = result;})

//Extract the components of the signature
signature = signature.substr(2);
r = '0x' + signature.slice(0, 64);
s = '0x' + signature.slice(64, 128);
v = '0x' + signature.slice(128, 130);
v_decimal = web3.utils.toDecimal(v) + 27;

//Verfiy the signature
//NOTE: The Digital Signature verification process has issues that haven't been fixed.
//Thus, it isn't ready for use.
myVerifier.methods.verify(sender_adr, hexMsg, v, r, s);