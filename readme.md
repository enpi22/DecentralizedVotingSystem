# Decentralized Voting System
1. A decentralized voting system on the sepolia test network. <br>
2. Users can vote for the candidates once they have connected their metamask accounts. <br>
3. Options to add candidates after the contract has been deployed. <br>

### Installation:
Clone this repository and complete the following installations,
```
npm install
```

### Deploy and run the application:
1. Create a .env file with the following variables and assign their values,
```
API_KEY
PRIVATE_KEY
CONTRACT_ADDRESS
```
2. Pass the list of names of the candidates and the time period (in minutes) for which voting is valid in the constructor in deploy.js file. <br>
3. Deploy the smart contract and obtain the contract address using the following,
```
npx hardhat compile
npx hardhat run --network sepolia scripts/deploy.js
```
4. Replace the contractAddress (optained after deploying) in main.js and .env files. <br>
5. Run the application using,
```
npm start
```
