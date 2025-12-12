import { useEffect, useState } from "react"
import { ethers } from "ethers"

function Trade({ toggleTrade, token, provider, factory }) {
  const [target, setTarget] = useState(0)
  const [limit, setLimit] = useState(0)
  const [cost, setCost] = useState(0)

  async function buyHandler(form) {
    const amount = form.get("amount")

    const cost = await factory.getCost(token.sold)
    const totalCost = cost * BigInt(amount)

    const signer = await provider.getSigner()

    const transaction = await factory.connect(signer).buy(
      token.token,
      ethers.parseUnits(amount, 18),
      { value: totalCost }
    )
    await transaction.wait()

    toggleTrade()
  }

  async function getSaleDetails() {
    const target = await factory.TARGET()
    setTarget(target)

    const limit = await factory.TOKEN_LIMIT()
    setLimit(limit)

    const cost = await factory.getCost(token.sold)
    setCost(cost)
  }

  useEffect(() => {
    getSaleDetails()
  }, [])

  return (
    // 1. New full-screen wrapper
    <div className="trade-dashboard">
      
      {/* 2. Go Back Arrow/Button to close the modal */}
      <div className="go-back-arrow" onClick={() => toggleTrade(null)}>
        &larr; Go Back
      </div>

      {/* 3. Central content container */}
      <div className="trade-content">
        
        {/* Header Section */}
        <div className="trade__header">
            <h2>{token.name} Token Trading</h2>
        </div>
        
        {/* Token Details Section - Now centralized and cleaner */}
        <div className="token__details trade__token-info"> 
          <img src={token.image} alt={token.name} width={256} height={256} />
          <p>Creator: {token.creator.slice(0, 6) + '...' + token.creator.slice(38, 42)}</p>
          <p>Marketcap: {ethers.formatUnits(token.raised, 18)} ETH</p>
          {/* Highlight Base Cost */}
          <p className="accent">Base Cost: {ethers.formatUnits(cost, 18)} ETH</p>
        </div>

        {/* Trade Form Wrapper */}
        <div className="trade-form-wrapper">
          {token.sold >= limit || token.raised >= target ? (
            <p className="disclaimer">Target Reached! No more tokens for sale.</p>
          ) : (
            // Form action remains unchanged
            <form action={buyHandler}>
              <input type="number" name="amount" min={1} max={10000} placeholder="Enter Amount" />
              
              {/* Using form__actions from the List component for button alignment */}
              <div className="form__actions"> 
                {/* Use the primary button class */}
                <input type="submit" value="Buy Tokens" className="btn-primary" />
                {/* Explicit Cancel button using secondary style */}
                <button type="button" onClick={toggleTrade} className="btn-secondary">Cancel</button> 
              </div>
            </form>
          )}
        </div>
        
      </div>
    </div >
  );
}

export default Trade;