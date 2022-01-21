import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import React, { Component } from 'react'
import "./styles.css";

class App extends Component {

  state = {
    manger: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    winners: []
  };

  

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const metaMaskAccounts = await web3.eth.getAccounts();
    const winners = await lottery.methods.getWinners().call();
    this.setState({ manager, players, balance, metaMaskAccounts, winners });
  }

  async distribute() {
    const accounts = await web3.eth.getAccounts();
    const winners = await lottery.methods.getWinners().call();
    const firstPrice = 4 / 9 * this.state.balance;
    const secondPrice = 3 / 9 * this.state.balance;
    const thirdPrice = 2 / 10 * this.state.balance;

    this.setState({
      winningPrice: [web3.utils.fromWei(firstPrice.toString(), 'ether'),
      web3.utils.fromWei(secondPrice.toString(), 'ether'),
      web3.utils.fromWei(thirdPrice.toString(), 'ether')]
    });
    //const we = web3.utils.toBN(firstPrice)
    await lottery.methods.distributeReward([firstPrice.toString(), secondPrice.toString(), thirdPrice.toString()]).send({ from: accounts[0] });
  }

  async shouldComponentUpdate(nextProps, nextState) {
    if (this.state.result) {

      this.setState({ result: false });
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      this.setState({ manager, players, balance });
    }
    return true;
  }
 
  onSubmit = async (event) => {

    
    if (event.target.value > 0.01) {
      event.preventDefault();
      const accounts = await web3.eth.getAccounts();
      this.setState({ message: 'Waiting on transaction success...' });
      await lottery.methods.enter().send({
  
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
  
      });
      this.setState({value:""});
      this.setState({ result: true });
      this.setState({ value: '' });
      this.setState({ message: 'Congrats you have been entered!' });
    }else {alert("Enter minimum amount of matic");}

    

  }


  onClick = async (event) => {


    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...' });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ balance: balance });
    this.distribute();
    // console.log(await lottery.methods.getWinners().call());
    this.setState({ message: 'Winner has been picked' });
  }


  render() {
  
    const playerList = this.state.players.map((item, position) => {
      return <li>{item}</li>
    })
 


    return (
      <div className="container">
        <div className="header">
          <h2>Lottery Contract</h2>
          <p>Address <a href="https://mumbai.polygonscan.com/address/0x5228ef51DE9f1595e03E0B1AE3eBaDD93aE2692b"  target="_blank" rel="noopener noreferrer" > {lottery.options.address} </a></p>
          <p>Loot {web3.utils.fromWei(this.state.balance, 'ether')} Matic!</p>
        </div>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

        <ul className="w3-ul w3-border">
          <li><h2>Participants</h2></li>
          {playerList}
        </ul>
        <hr />
        <hr />

        <form onSubmit={this.onSubmit}>

          <h4>Want to try your luck?</h4>
          <div>
            <input required
              type="text"
              placeholder="Matic > 0.01"
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}

            />
            <input type="submit" value="Wager" />

          </div>
          
        </form>
        <hr />
        {this.state.metaMaskAccounts && this.state.manager === this.state.metaMaskAccounts[0] &&
          <>

            <h4>Ready to pick winner?</h4>
            <button onClick={this.onClick}>Pick a winner</button>
          </>}
        <h1>{this.state.message}</h1>
      </div>


    );

  }

}

export default App;
