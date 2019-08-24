//Solidity version
pragma solidity ^0.4.25;

//Contract to validate a transaction by checking authenticity of the signature
contract Verifier{
    function verify(address signer_adr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns(bool){
        //Check if the signer's address matches that displayed by the message hash
        return (ecrecover(msgHash, v, r, s) == signer_adr);
        }
}

//Contract to overlook the working of the MultiSig Wallet
contract Wallet{
    //Declare the attributes of the Wallet
    uint8 balance = 0;
    address[] public owners;
    uint256 public threshold;

    //Constructor that accepts the addresses of the owners
    constructor(address[] owners_) public{
        owners = owners_;

        //Set the threshold for consensus
        if(owners.length % 2 == 0){
            threshold = owners.length / 2;
        }
        else{
            threshold = (owners.length / 2) + 1;
        }
    }

    //Function to update the owners of the Wallet
    function update(address owner) public{
        owners.push(owner);

        //Update the threshold
        if(owners.length % 2 != 0){
            threshold += 1;
        }
    }

    //Function to display the balance funds in the Wallet
    function getBalance() public view returns(uint8){
        return balance;
    }

    //Function to deposit funds in the Wallet
    function deposit(uint8 fund) public{
        balance += fund;
    }

    //Function to withdraw funds from the Wallet
    function withdraw(uint8 fund, address[] senders) public{
        //Find number of owners approving the transaction
        uint8 consensus = 0;
        for(uint i = 0; i < senders.length; i++){
            //Obtain the sender's address
            address sender_adr = senders[i];

            //Check if the sender is an owner of the contract
            bool flag = false;
            for(uint j = 0; j < owners.length; j++){
                if(sender_adr == owners[j]){
                    flag = true;
                    break;
                }
            }

            if(flag){
                consensus += 1;
            }
        }

        if(consensus >= threshold){
            balance -= fund;
        }
    }
}
