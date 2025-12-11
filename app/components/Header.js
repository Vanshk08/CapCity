import React from 'react';

function Header({ account, onConnect }) {

  return (
    <header className="landing-navbar">
      {/* Logo (Stays on the far left) */}
      <div className="logo">
        StreamToken
      </div>

      {/* Navigation and Actions (This group will be centered) */}
      <div className="navigation-wrapper">
        <a href="#features" className="nav-link">Features</a>
        <a href="#tokenomics" className="nav-link">Tokenomics</a>
        
        {/* Launch App Button (Now part of the main centered group) */}
        <a href="#listings" className="primary-btn small-btn">Launch App</a>

        {/* Connect Wallet / Connected Account (Now part of the main centered group) */}
        {account ? (
          <p className="connected-account">
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </p>
        ) : (
          <button onClick={onConnect} className="primary-btn small-btn">Connect Wallet</button>
        )}
      </div>

    </header>
  );
}

export default Header;