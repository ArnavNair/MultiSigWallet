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
    uint256 balance = 0;
    address[] public owners;
    uint256 public threshold;
    uint256 consensus = 0;

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

    //Function to add an owner to the Wallet
    function addOwner(address sender) public{
        //Add the owner
        owners.push(sender);

        //Update the threshold
        if(owners.length % 2 != 0){
            threshold += 1;
        }
    }

    //Function to remove an owner from the Wallet
    /*Note: Solidity 0.4 has no in-built pop function. 
    Thus, the popping had to be done manually by shfiting and deleting.*/
    function removeOwner(address owner) public{
        //Remove the owner
        for(uint i = 0; i < owners.length - 1; i++) {
            if(owners[i] == owner){
                for(uint j = i; j < owners.length - 1; j++) {
                    owners[j] = owners[j + 1];
                }
            break;
            }
        }
        delete owners[owners.length - 1];
        owners.length--;

        //Update the threshold
        if(owners.length % 2 == 0){
            threshold -= 1;
        }
    }

    //Function to display the current set of owners
    function displayOwners() public view returns(address[]){
            return owners;
    }

    //Function to display the balance funds in the Wallet
    function getBalance() public view returns(uint256){
        return balance;
    }

    //Function to deposit funds in the Wallet
    function deposit(uint8 fund) public{
        balance += fund;
    }

    //Function to withdraw funds from the Wallet
    function withdraw(uint8 fund, address sender) public{
        //Check if the sender is an owner of the contract
        bool flag = false;
        for(uint j = 0; j < owners.length; j++){
            if(sender == owners[j]){
                flag = true;
                break;
            }
        }   

        if(flag){
            consensus += 1;
        }

        if(consensus >= threshold){
            balance -= fund;
            consensus = 0;
        }
    }
}
