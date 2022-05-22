import { ethers } from 'ethers';
import React, { useState } from 'react';
import tether from '../tether.png';

export const Main = ({
  tetherBalance,
  rwdBalance,
  stakingBalance,
  stakeTokens,
  unstakeToken,
}) => {
  const [amount, setAmount] = useState('');
  return (
    <div id="content" className="mt-3">
      <table className="table text-muted text-center">
        <thead>
          <tr>
            <th scopr="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{stakingBalance} USDT</td>
            <td>{rwdBalance} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className="card mb-2" style={{ opacity: '.9' }}>
        <form
          className="mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (typeof parseInt(amount) === 'number') {
              // console.log(ethers.utils.parseEther(amount));
              stakeTokens(ethers.utils.parseEther(amount));
              setAmount('')
            } else {
              window.alert('enter number!');
            }
          }}
        >
          <div style={{ borderSpacing: '0 1em' }}>
            <label className="float-left" style={{ marginLeft: '15px' }}>
              <b>Stake Tokens</b>
            </label>
            <span className="float-right" style={{ marginRight: '8px' }}>
              Balance: {tetherBalance}
            </span>
            <div className="input-group mb-4">
              <input
                type="text"
                placeholder="0"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                required
              />
              <div className="input-group-open">
                <div className="input-group-text">
                  <img src={tether} height="32" alt="tether" />
                  &nbsp;&nbsp;&nbsp;USDT
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block">
              DEPOSIT
            </button>
          </div>
        </form>
        <button className="btn btn-primary btn-lg btn-block" onClick={unstakeToken}>WITHDRAW</button>
        <div className="card-body text-center" style={{ color: 'blue' }}>
          AIRDROP
        </div>
      </div>
    </div>
  );
};
