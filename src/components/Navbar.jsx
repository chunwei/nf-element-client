import React from 'react';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';

import logo from '../../images/logo.svg';

import Account from './Account/Account';
import Chains from './Chains';
// import TokenPrice from './TokenPrice';
// import NativeBalance from './NativeBalance';

const styles = {
  content: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Roboto, sans-serif',
    color: '#041836',
    marginTop: '130px',
    padding: '10px',
  },
  header: {
    position: 'fixed',
    zIndex: 1,
    width: '100%',
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Roboto, sans-serif',
    borderBottom: '2px solid rgba(0, 0, 0, 0.06)',
    padding: '0 10px',
    boxShadow: '0 1px 10px rgb(151 164 175 / 10%)',
  },
  headerRight: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: '600',
  },
};

const NavBarItem = ({ item, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>
    <NavLink
      to={item.to}
      style={({ isActive }) => ({ color: isActive ? '#00e8ff' : '' })}
    >
      {item.name}
    </NavLink>
  </li>
);
const MENUITEMS = [
  { name: 'Wallets', to: '/wallets' },
  { name: 'Market', to: '/market' },
  { name: 'My Collections', to: '/mycollection' },
  { name: 'Transactions', to: '/transactions' },
  { name: 'Create', to: '/create' },
];
const Navbar = ({ setInputValue }) => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-48 cursor-pointer" />
      </div>

      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {MENUITEMS.map((item, index) => (
          <NavBarItem key={item.name.replace(' ', '_') + index} item={item} />
        ))}
        {/* <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          Login
        </li> */}
      </ul>
      <div style={styles.headerRight}>
        <Chains />
        {/*   <TokenPrice
          address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
          chain="eth"
          image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/"
          size="40px"
        />
        <NativeBalance /> */}
        <Account />
      </div>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {MENUITEMS.map((item, index) => (
              <NavBarItem
                key={item.name.replace(' ', '_') + index}
                item={item}
                classprops="my-2 text-lg"
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
