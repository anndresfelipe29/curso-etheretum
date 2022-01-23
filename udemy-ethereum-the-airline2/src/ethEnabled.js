// ahora se creo un estandar y se conecta diferente a metamask https://medium.com/valist/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a

// nueva forma, mas simple y estandar para diferentes billeteras
// const Web3 = require("web3");
const ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  }
  

  export default ethEnabled;