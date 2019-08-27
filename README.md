# MultiSig Wallet
### General Description
 A wallet whose funds are owned by multiple users, with functionality to add or remove funds. However, funds can only be removed with the consent of atleast 50% of owners. Additional features include options to add or remove owners, and functionality to prevent playback attacks.
 
### Wallet Design
 The Wallet's features are defined within the 'Wallet.sol' file, scripted in Solidity. It consists of a single contract, named Wallet, that houses all the necessary functions.
 It has a constructor that initializes instances of the contract. It also accepts a starting list of the owners, and sets the threshold of consensus for withdrawal of funds(50% in this case).
 Other functions provide the power to display balance funds, display current set of owners and deposit or withdraw funds. When a request is made to withdraw funds, the contract confirms that the request is from an owner, and then increases its current consensus reading. Once the consensus crosses the threshold, the withdrawal is carried out.
 Each transaction requesting the use of the contract must be authenticated before carrying it out. This is achieved by producing a digital signature for the transaction. The contract has a function to later verify this signature.
 
### Backend of The DApp
 In order to interact with and test the above mentioned contract, a dummy backend was designed using Node.js, specifically its Web3 package. This is stored within the 'BackEnd.js' file. The contract was first compiled and later deployed onto a private BlockChain on the local host, created using Ganache. The calls to the contract are all hard coded here, and are simply to display the functioning of the contract. In a real DApp, the backend would accept transaction requests from the frontend, and interact with the contract accordingly. Similarly, the addresses passed to the function calls are all representative, in reality the requesting user's address would be passed.

### Bonus Task: Update The Owners
 There are functions within the contract to update the owners of the wallet. As the addresses of all owners are stored within the contract(in an array), these functions allow addition of new owners(by pushing into the array), or removal of existing ones(by popping out).

### Bonus Task: Prevention of Playback Attacks
 Playback attacks allow a transaction to be intercepted and replayed to the contract endless times, posing a major security threat. To combat this, a simple integer nonce is used. The backend and contract both start off with the same nonce value, which gets updated after every transaction. Thus, in the time that a hacker intercepts a transaction and replays it, other transaction calls to the contract would have updated its nonce, while the hacker sends the old intercepted value. Thus, the transaction request won't be accepted.
 Another possible way of combating this would have been to attach a timestamp to each transaction and keep a very short accepting time interval within the contract.
