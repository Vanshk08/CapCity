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
        {/* Keeping Features link */}
        <a href="#features" className="nav-link">Features</a>
        
        {/* **REMOVED: <a href="#tokenomics" className="nav-link">Tokenomics</a>** */}
        
        {/* Launch App Button */}
        <a href="#listings" className="primary-btn small-btn">Launch App</a>

        {/* Connect Wallet / Connected Account */}
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