"use client"

import { useEffect, useState } from "react"
import { ethers } from 'ethers'

// Components
import Header from "./components/Header"
import List from "./components/List"
import Token from "./components/Token"
import Trade from "./components/Trade"
// Assuming these are defined in your components folder
import { Footer } from "./components/Footer" 
import Dashboard from "./components/Dashboard" 

// ABIs & Config
import Factory from "./abis/Factory.json"
import config from "./config.json"
import images from "./images.json"

export default function Home() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [factory, setFactory] = useState(null)
  const [fee, setFee] = useState(0)
  const [tokens, setTokens] = useState([])
  const [token, setToken] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showTrade, setShowTrade] = useState(false)
  const [status, setStatus] = useState("")
  // New state for the Dashboard/App view
  const [showDashboard, setShowDashboard] = useState(false) 

  const TARGET_CHAIN_ID_HEX = "0x7A69" // 31337 Hardhat

  function openCreate() {
    if (factory && account) {
      toggleCreate()
    }
  }

  function toggleCreate() {
    showCreate ? setShowCreate(false) : setShowCreate(true)
  }

  function toggleTrade(token) {
    setToken(token)
    showTrade ? setShowTrade(false) : setShowTrade(true)
  }

  // Logic to toggle the main App/Dashboard view
  function toggleDashboard() {
    // If opening dashboard, ensure other modals are closed for safety
    if (!showDashboard) {
      setShowCreate(false);
      setShowTrade(false);
    }
    setShowDashboard(prev => !prev);
  }

  async function ensureNetwork() {
    const { ethereum } = window
    const chainId = await ethereum.request({ method: "eth_chainId" })
    if (chainId === TARGET_CHAIN_ID_HEX) return

    try {
      await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: TARGET_CHAIN_ID_HEX }] })
    } catch (switchError) {
      // If chain is missing, add it
      if (switchError.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: TARGET_CHAIN_ID_HEX,
            chainName: "Hardhat Local",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["http://127.0.0.1:8545"]
          }]
        })
      } else {
        throw switchError
      }
    }
  }

  async function loadBlockchainData(useExistingProvider) {
    if (!window.ethereum) {
      setStatus("Please install MetaMask to use the dapp.")
      return
    }

    try {
      const nextProvider = useExistingProvider || new ethers.BrowserProvider(window.ethereum)
      setProvider(nextProvider)

      const network = await nextProvider.getNetwork()
      const chainConfig = config[network.chainId]

      if (!chainConfig) {
        setStatus(`Unsupported network (chainId ${network.chainId}). Switch to localhost/Hardhat.`)
        setFactory(null)
        setTokens([])
        return
      }

      const nextFactory = new ethers.Contract(chainConfig.factory.address, Factory, nextProvider)
      setFactory(nextFactory)
      setStatus("")

      const onChainFee = await nextFactory.fee()
      setFee(onChainFee)

      const totalTokens = await nextFactory.totalTokens()
      const nextTokens = []

      for (let i = 0; i < totalTokens && i < images.length; i++) {
        const tokenSale = await nextFactory.getTokenSale(i)

        const token = {
          token: tokenSale.token,
          name: tokenSale.name,
          creator: tokenSale.creator,
          sold: tokenSale.sold,
          raised: tokenSale.raised,
          isOpen: tokenSale.isOpen,
          image: images[i]
        }

        nextTokens.push(token)
      }

      setTokens(nextTokens.reverse())
    } catch (err) {
      console.error(err)
      setStatus("Failed to load on-chain data. Check wallet connection and network.")
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("Please install MetaMask to use the dapp.")
      return
    }

    try {
      await ensureNetwork()
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const nextAccount = ethers.getAddress(accounts[0])

      const nextProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(nextProvider)
      setAccount(nextAccount)
      setStatus("")
      await loadBlockchainData(nextProvider)
    } catch (err) {
      console.error(err)
      setStatus("Failed to connect wallet. Check network and permissions.")
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [showCreate, showTrade, showDashboard]) // Reload tokens after any modal action

  return (
    <div className="page">
      <Header 
        account={account} 
        onConnect={connectWallet} 
        toggleDashboard={toggleDashboard} 
      />

      <main>
        
        {/* HERO SECTION - New structure and class names */}
        <section id="hero" className="hero-section">
            <div className="hero-content">
                <h1 className="headline">
                    Own the Future of Streaming. <span className="accent-text">Trade Your Favorite Creators.</span>
                </h1>
                <p className="subheadline">
                    The revolutionary platform where audience engagement directly drives the value of creator tokens.
                    Get in early and participate in the growth.
                </p>
                <div className="hero-cta">
                    {/* CTA: Opens the App/Dashboard component */}
                    <button onClick={toggleDashboard} className="primary-btn large-btn">Start Trading Now</button>
                    {/* Secondary CTA: Links to the explanation section */}
                    <a href="#howitworks" className="secondary-btn large-btn">Learn How It Works</a>
                </div>
            </div>
            
            <div className="hero-visual">
                <div className="visual-placeholder">
                    <div className="chart-mockup">
                        <span className="mock-price up">$0.0000042</span>
                        <span className="mock-price-change">+12%</span>
                    </div>
                    <p>The **Live** Price Graph</p>
                </div>
            </div>
        </section>

        <hr className="section-divider" />

        {/* FEATURES SECTION */}
        <section id="features" className="features-section">
            <h2 className="section-title">The Power of StreamToken</h2>
            <p className="section-subtitle">We turn viewers into vested participants in a creator's success.</p>
            
            <div className="feature-grid">
                <div className="feature-card">
                    <span className="icon">🔗</span>
                    <h3>Live Price Discovery</h3>
                    <p>Token price is determined by real-time viewer count, tips, and direct trading volume via a transparent **Bonding Curve** smart contract.</p>
                </div>
                <div className="feature-card">
                    <span className="icon">💰</span>
                    <h3>Creator Ownership</h3>
                    <p>Every creator instantly launches their own personalized, audience-backed token (e.g., $ALICE, $BOB). No need for complex liquidity pools.</p>
                </div>
                <div className="feature-card">
                    <span className="icon">⚡</span>
                    <h3>Instant Liquidity</h3>
                    <p>Buy or sell creator tokens instantly at any time. The Bonding Curve acts as the automated market maker, guaranteeing trades with minimal slippage.</p>
                </div>
            </div>
        </section>

        <hr className="section-divider" />
        
        {/* LIVE TOKEN LISTINGS - Existing Logic */}
        <section id="listings" className="token-list-section">
            <h2 className="section-title">Featured Creator Tokens</h2>
            <p className="section-subtitle">Jump into the action and trade a token now.</p>

            <div className="token-grid" id="featured-token-grid">
                {/* EXISTING TOKEN MAPPING LOGIC REMAINS */}
                {!account ? (
                    <p className="muted" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Please connect wallet to view live listings</p>
                ) : tokens.length === 0 ? (
                    <p className="muted" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No tokens listed yet</p>
                ) : (
                    tokens.map((token, index) => (
                        // Existing Token component usage
                        <Token
                            toggleTrade={toggleTrade} 
                            token={token}
                            key={index}
                        />
                    ))
                )}
            </div>

            {/* CTA: Opens the App/Dashboard component */}
            <button onClick={toggleDashboard} className="primary-btn large-btn" style={{ marginTop: '40px' }}>View All Live Streams</button>
        </section>

        <hr className="section-divider" />

        {/* HOW IT WORKS / TOKENOMICS SECTION */}
        <section id="howitworks" className="how-it-works-section">
            <h2 className="section-title">Tokenomics Explained Simply</h2>
            <div className="token-steps">
                <div className="step-card">
                    <div className="step-number">1</div>
                    <h3>Go Live & Launch Your Token</h3>
                    <p>Your journey starts by going live. Creators can stream anything they love — gaming, IRL, music, or chill hangouts. The moment you start a stream, your creator token is automatically launched on the platform.</p>
                </div>
                <div className="step-card">
                    <div className="step-number">2</div>
                    <h3>Trade Tokens Using ETH</h3>
                    <p>As viewers join, they can buy and sell your token using ETH, trading it in real time while your stream is live. The more people watch and trade, the more your token grows. You earn from stream engagement + token activity, creating a brand-new way to monetize your content.</p>
                </div>
                <div className="step-card">
                    <div className="step-number">3</div>
                    <h3>Grow With Your Community</h3>
                    <p>Fans get a new way to support you: by holding your token. As your community grows, so does the value of their support. It’s simple, transparent, and built to reward both creators and fans.</p>
                </div>
            </div>
            <div className="cta-banner">
                <p>Ready to jump into the most dynamic creator market?</p>
                {/* CTA: Opens the App/Dashboard component */}
                <button onClick={toggleDashboard} className="primary-btn large-btn">Launch App Now</button>
            </div>
        </section>

        <hr className="section-divider" />

        {/* CREATOR CTA SECTION */}
        <section className="creator-cta-section">
            <h2 className="section-title">Are You a Creator?</h2>
            <p className="section-subtitle">Monetize your audience engagement like never before. Launch your token in minutes.</p>
            <div className="creator-benefits">
                <ul>
                    <li>💸 **Instant Payouts:** Receive ETH directly from trades and tips.</li>
                    <li>🔗 **True Ownership:** Control your own token and community metrics.</li>
                    <li>🚀 **Zero Fees to Launch:** We cover the initial cost of token creation.</li>
                </ul>
            </div>
            {/* CTA: Opens the App/Dashboard component */}
            <button onClick={toggleDashboard} className="primary-btn large-btn">Launch Your Token Instantly</button>
        </section>

      </main>
      
      {/* MODALS/APP VIEWS - Existing Logic (Renders outside main) */}
      {showCreate && (
        <List toggleCreate={toggleCreate} fee={fee} provider={provider} factory={factory} />
      )}

      {showTrade && (
        <Trade toggleTrade={toggleTrade} token={token} provider={provider} factory={factory} />
      )}
      
      {/* DASHBOARD/APP VIEW - Renders only when toggled */}
      {showDashboard && (
        <Dashboard 
          toggleDashboard={toggleDashboard} 
          account={account}
          tokens={tokens}
          factory={factory}
          toggleCreate={toggleCreate} // Pass logic to allow launching token from dashboard
          toggleTrade={toggleTrade}   // Pass logic to allow trading from dashboard (if needed)
        />
      )}
      
      {/* Footer component rendered here */}
      <Footer />
      
    </div>
  );
}