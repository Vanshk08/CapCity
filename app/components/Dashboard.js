import { ethers } from 'ethers'

export default function Dashboard({ toggleDashboard, account, tokens, factory, toggleCreate, toggleTrade }) {

  // Logic to filter tokens created by the current connected account
  const creatorTokens = tokens.filter(token => 
    account && token.creator.toLowerCase() === account.toLowerCase()
  );

  return (
    <div className='dashboard'>
      
      {/* The "Go Back" button simply toggles the dashboard closed */}
      <button 
        className="go-back-arrow" 
        title="Go Back to Landing" 
        onClick={toggleDashboard} // This closes the dashboard
      >
        {/* SVG Arrow icon from your prototype */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
      </button>
      
      <div className='dashboard__content'>
        <div className='dashboard__header'>
          <h2>Creator Dashboard</h2>
          
          {/* BUTTON TO LAUNCH NEW TOKEN: PRESERVES LIST LOGIC */}
          <button 
            // Close the Dashboard, then open the List modal
            onClick={() => { 
                if (account) {
                    toggleDashboard(); 
                    toggleCreate();
                } else {
                    alert("Please connect your wallet to launch a new token.");
                }
            }} 
            className='primary-btn small-btn'
            disabled={!account}
          >
            Launch New Token
          </button>

        </div>
        
        <p className='dashboard__info muted'>
          Connected Account: {account ? account : 'Not Connected'}
        </p>

        <p className='dashboard__info muted'>
          Manage and track tokens you have launched on StreamToken. 
          Total tokens launched: {creatorTokens.length}
        </p>

        <div className='dashboard__list'>
          {account ? (
            creatorTokens.length === 0 ? (
              <p className="empty-message">You have not launched any tokens yet. Click 'Launch New Token' to start!</p>
            ) : (
              creatorTokens.map((token, index) => (
                <div key={index} className='dashboard-card'>
                  {/* Token Image Placeholder */}
                  <div className="token-image-placeholder" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                    {token.name.charAt(1)}
                  </div>
                  <div className='card-details'>
                    <h3>{token.name}</h3>
                    <p>Address: <span className='muted'>{token.token.slice(0, 6)}...{token.token.slice(-4)}</span></p>
                    <p>Raised: <strong>{ethers.formatUnits(token.raised, 18)} ETH</strong></p>
                    <p>Sold: {Number(token.sold)}</p>
                    <p>Status: {token.isOpen ? '🟢 Active' : '🔴 Closed'}</p>
                  </div>
                </div>
              ))
            )
          ) : (
            <p className="empty-message">Please connect your wallet to view your dashboard.</p>
          )}
        </div>
      </div>
    </div>
  )
}