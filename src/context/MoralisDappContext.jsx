import React, { useEffect, useState } from 'react';
//import Web3 from 'web3';
import { useChain, useMoralis } from 'react-moralis';
import { nftMarketAddress, nftMarketABI } from '../utils/constants';

const MoralisDappContext = React.createContext();

function MoralisDappProvider({ children }) {
  const { Moralis, user, provider } = useMoralis();
  const { chainId } = useChain();
  const [walletAddress, setWalletAddress] = useState();
  //const [chainId, setChainId] = useState();
  const [contractABI, setContractABI] = useState(nftMarketABI); //Smart Contract ABI here
  const [marketAddress, setMarketAddress] = useState(nftMarketAddress); //Smart Contract Address Here
  const [web3, setWeb3] = useState();
  useEffect(() => {
    if (provider) {
      let web = new Web3(provider);
      setWeb3(web);
    }
  }, [provider]);

  // useEffect(() => {
  //   Moralis.onChainChanged(function (chain) {
  //     setChainId(chain);
  //   });
  //   Moralis.onAccountsChanged(function (address) {
  //     setWalletAddress(address[0]);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  //useEffect(() => provider && setChainId(provider.chainId));
  useEffect(
    () =>
      provider &&
      setWalletAddress(provider.selectedAddress || user.get('ethAddress')),
    [web3, user]
  );

  return (
    <MoralisDappContext.Provider
      value={{
        walletAddress,
        chainId,
        marketAddress,
        setMarketAddress,
        contractABI,
        setContractABI,
      }}
    >
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error('useMoralisDapp must be used within a MoralisDappProvider');
  }
  return context;
}

export { MoralisDappContext, MoralisDappProvider, useMoralisDapp };
