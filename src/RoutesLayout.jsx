import { useEffect, useState } from 'react';
import Web3 from 'web3/dist/web3.min.js';
import { useMoralis } from 'react-moralis';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import NFTCollection from './pages/NFTCollection';
import MyCollection from './pages/MyCollection';

import Wallets from './pages/Wallets';
import NFTToken from './pages/NFTToken';
import NFTMinter from './pages/NFTMinter';
import NFTMarketTransactions from './pages/NFTMarketTransactions';
import NFTMarketPlace from './pages/NFTMarketPlace';

const RoutesLayout = () => {
  const { provider } = useMoralis();

  const [web3, setWeb3] = useState();

  useEffect(() => {
    if (provider) {
      let web = new Web3(provider);
      setWeb3(web);
    }
  }, [provider]);

  const ConnectWallet = () => {
    return <>connectWallet</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<NFTMarketPlace />}></Route>
          <Route path="market" element={<NFTMarketPlace />}></Route>
          <Route path="collection/:id" element={<NFTCollection />}></Route>
          <Route path="collection/:id/:tokenId" element={<NFTToken />}></Route>
          <Route path="mycollection" element={<MyCollection />}></Route>
          <Route path="exchange" element={<NFTMarketTransactions />}></Route>
          <Route path="wallets" element={<Wallets />} />
          <Route
            path="create"
            element={
              !provider || !web3 ? <ConnectWallet /> : <NFTMinter web3={web3} />
            }
          ></Route>
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default RoutesLayout;
