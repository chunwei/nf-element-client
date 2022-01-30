import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { nfElementABI, nfElementAddress } from '../utils/constants';

export const NFElementContext = React.createContext();

const { ethereum } = window;

const createEthereumNFE = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const nfElementContract = new ethers.Contract(
    nfElementAddress,
    nfElementABI,
    signer
  );

  return nfElementContract;
};