import React, { Component } from 'react';
import Web3 from 'web3'
import Navbar from './Navbar'
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadBlockChainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] })
    console.log(this.state.account);

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })
    console.log(this.state.ethBalance)


  }

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // Request account access if needed
      await window.ethereum.enable();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: ''
    }
  }

  render() {
    return (
      <div>
        <Navbar account = {this.state.account}></Navbar>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Hello World</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
