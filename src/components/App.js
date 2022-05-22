import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
// import Web3 from 'web3';
import Tether from './../truffle_abis/Tether.json';
import RWD from './../truffle_abis/RWD.json';
import DecentralBank from './../truffle_abis/DecentralBank.json';
// refactoring
import { ethers } from 'ethers';
import { Main } from './Main';

const App = () => {
  const [accountNumber, setAccountNumber] = useState('0x');
  const [tether, setTether] = useState(null);
  const [rwd, setRwd] = useState({});
  const [decentralBank, setDecentralBank] = useState({});
  const [tetherBalance, setTetherBalance] = useState(0);
  const [rwdBalance, setRwdBalance] = useState(0);
  const [stakingBalance, setStakingBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // ethers.jsの場合
  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      setAccountNumber(await signer.getAddress());
    } catch (err) {
      alert(err.message);
    }
  };

  const loadBlockchainData = async () => {
    const url = 'http://localhost:7545';
    const provider = new ethers.providers.JsonRpcProvider(url);
    // const signer0 = provider.getSigner(0).getAddress();
    // const signer1 = provider.getSigner(1);
    const { chainId } = await provider.getNetwork();

    // Tether contract
    const tetherData = Tether.networks[chainId];
    if (tetherData) {
      const tetherContract = new ethers.Contract(
        tetherData.address,
        Tether.abi,
        provider
      );
      setTether(tetherContract);
      console.log(accountNumber);

      const tetherBalance = ethers.utils.formatEther(
        await tetherContract.balanceOf(accountNumber)
      );
      setTetherBalance(tetherBalance);
    }

    // RWD contract
    const rwdData = RWD.networks[chainId];
    if (rwdData) {
      const rwdContract = new ethers.Contract(
        rwdData.address,
        RWD.abi,
        provider
      );
      setRwd(rwdContract);
      const rwdBalance = ethers.utils.formatEther(
        await rwdContract.balanceOf(accountNumber)
      );
      setRwdBalance(rwdBalance);
    }

    // DecentralBank contract
    const decentralBankData = DecentralBank.networks[chainId];
    if (decentralBankData) {
      const decentralBankContract = new ethers.Contract(
        decentralBankData.address,
        DecentralBank.abi,
        provider
      );
      setDecentralBank(decentralBankContract);
      const stakingBalance = ethers.utils.formatEther(
        await decentralBankContract.stakingBalance(accountNumber)
      );
      setStakingBalance(stakingBalance);
    }
    setLoading(false);
  };

  useEffect(() => {
    connectWallet();
    loadBlockchainData();
  }, [accountNumber]);

  // staking function
  const stakeTokens = async (amount) => {
    try {
      setLoading(true);
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const approveTx = await tether
        .connect(signer)
        .approve(decentralBank.address, amount);
      await approveTx.wait();
      console.log(approveTx);

      await approveTx.wait();
      console.log(approveTx);

      const depositTx = await decentralBank
        .connect(signer)
        .depositTokens(amount);
      await depositTx.wait();
      console.log(depositTx);
      setLoading(false);
    } catch (err) {
      alert(err.message);
      setLoading(true)
    }
  };

  // unstaking function
  const unstakeToken = async () => {
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    setLoading(true);
    const unstakeTx = await decentralBank.connect(signer).unstakeTokens();
    await unstakeTx.wait();
    setLoading(false);
  };

  return (
    <div>
      <Navbar accountNumber={accountNumber} />

      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: '600px', minHeight: '100vm' }}
          >
            <div>
              {loading ? (
                <p className="text-center" style={{ margin: '30px' }}>
                  LOADING PLEASE WAIT...
                </p>
              ) : (
                <Main
                  tetherBalance={tetherBalance}
                  rwdBalance={rwdBalance}
                  stakingBalance={stakingBalance}
                  stakeTokens={stakeTokens}
                  unstakeToken={unstakeToken}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
