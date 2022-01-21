import Web3 from "web3";
 
if (typeof window.web3 === 'undefined') {
    alert("Install meta mask extension")
    
}
window.ethereum.request({ method: "eth_requestAccounts" });
 
const web3 = new Web3(window.ethereum);
 
export default web3;
