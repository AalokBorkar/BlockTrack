// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
} else {
    web3js = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<API_TOKEN>"));
}