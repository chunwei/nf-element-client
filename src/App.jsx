import { useEffect, useState } from 'react';
import Web3 from 'web3/dist/web3.min.js';
import { useMoralis } from 'react-moralis';
import 'antd/dist/antd.dark.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
function App({ isServerInfo }) {
  const {
    isWeb3Enabled,
    enableWeb3,
    authenticate,
    isAuthenticated,
    isWeb3EnableLoading,
    user,
    logout,
  } = useMoralis();
  const { provider } = useMoralis();

  const [web3, setWeb3] = useState();

  useEffect(() => {
    if (provider) {
      let web = new Web3(provider);
      setWeb3(web);
    }
  }, [provider]);

  useEffect(() => {
    const connectorId = window.localStorage.getItem('connectorId');
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);
  const [inputValue, setInputValue] = useState('explore');

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar setInputValue={setInputValue}></Navbar>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
