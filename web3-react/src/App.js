import logo from "./logo.svg";
import "./App.css";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useEffect, useState } from "react";
import ERC20 from './ERC20.json';

const WALLETCONNECT_BRIDGE_URL = "https://bridge.walletconnect.org";
const INFURA_KEY = "10df728faa6e46bea492bea63eaba945";
const NETWORK_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  5: `https://goerli.infura.io/v3/${INFURA_KEY}`,
};

const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 5],
});

const walletConnectConnector = new WalletConnectConnector({
  supportedChainIds: [1, 4, 5],
  rpc: NETWORK_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
});

function App() {
  const { account, chainId, connector, activate, library } = useWeb3React();
  console.log('CHAINID:', chainId);
  const [balance, setBlance] = useState(0);

  console.log(library);
  const connectInjectedConnector = () => {
    activate(injected);
  };

  const connectWalletConnectConnector = () => {
    activate(walletConnectConnector, undefined, true).catch(e => console.log('ee', e));
  };

  const withdraw = async () => {
    if (account && chainId && library) {
      const web3 = new Web3(library.provider);
    } 
  }

  const getBalance = async () => {
    const web3 = new Web3(library.provider);
    console.log(library.provider);
    const wethContract = new web3.eth.Contract(ERC20, '0xc778417e063141139fce010982780140aa0cd5ab');
    console.log(wethContract);
    const balanceAccount = await wethContract.methods.balanceOf(account).call();
    console.log(balanceAccount);
    setBlance(web3.utils.fromWei(balanceAccount));
  }

  const getStaticInfo = async () => {
    await getBalance();
  };

  const deposit = async () => {
    const web3 = new Web3(library.provider);
    console.log(library.provider);
    const wethContract = new web3.eth.Contract(ERC20, '0xc778417e063141139fce010982780140aa0cd5ab');
    await wethContract.methods.deposit().send({ value: web3.utils.toWei('0.1'), from: account });
    console.log('DEPOSIT SUCCESS');
  };

  useEffect(() => {
    if(account){
      getStaticInfo();
    }
  }, [account]);
  return (
    <div className="App">
      <div style={{ marginTop: "4rem" }}>
        {
          account ? 
          <> <h1>Account: {account} </h1> 
              <h2>Balance: {balance}</h2>
              <button onClick={deposit}>Deposit</button>
          </> :
          <> <button onClick={connectInjectedConnector}>Connect Metamask</button> 
          <br/>
            <button style={{ marginTop: '3rem' }} onClick={connectWalletConnectConnector}>Connect WalletConnect</button> 
          </>
        }
      </div>
    </div>
  );
}

export default App;
