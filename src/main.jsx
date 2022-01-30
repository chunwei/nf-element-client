import React from 'react';
import ReactDOM from 'react-dom';
import { MoralisProvider } from 'react-moralis';
//import { MoralisDappProvider } from './context/MoralisDappContext';

import RoutesLayout from './RoutesLayout';
import QuickStart from './pages/QuickStart';
import { TransactionsProvider } from './context/TransactionContext';
import './index.css';

/** Get your free Moralis Account https://moralis.io/ */
const APP_ID = import.meta.env.VITE_MORALIS_APPLICATION_ID;
const SERVER_URL = import.meta.env.VITE_MORALIS_SERVER_URL;

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  if (isServerInfo)
    return (
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        {/* <MoralisDappProvider> */}
        <TransactionsProvider>
          <RoutesLayout isServerInfo />
        </TransactionsProvider>
        {/* </MoralisDappProvider> */}
      </MoralisProvider>
    );
  else {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
          <QuickStart />
        </MoralisProvider>
      </div>
    );
  }
};
ReactDOM.render(<Application />, document.getElementById('root'));
