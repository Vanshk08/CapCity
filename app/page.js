"use client"

import { useEffect, useState } from "react"
import { ethers } from 'ethers'

// Components
import Header from "./components/Header"
import List from "./components/List"
import Token from "./components/Token"
import Trade from "./components/Trade"
// IMPORTANT: Use the NAMED IMPORT method that worked previously
import { Footer } from "./components/Footer" 

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
  }, [showCreate, showTrade])

  return (
    <div className="page">
      <Header account={account} onConnect={connectWallet} />

      <main>
        <section className="hero">
          <div className="hero__content">
            <div className="eyebrow">fun.pump · creator launchpad</div>
            <h1>
              Own the Future of Streaming.<br />
              <span className="accent">Trade Your Favorite Creators.</span>
            </h1>
            <p className="hero__sub">
              The platform where audience engagement drives the value of creator tokens.
              Get in early and participate in the growth.
            </p>
            <div className="hero__actions">
              <button onClick={openCreate} className="btn-primary" disabled={!factory || !account}>
                {!account ? "Connect wallet to start" : "Start Trading Now"}
              </button>
              <a href="#how-it-works" className="btn-secondary">
                Learn How It Works
              </a>
            </div>
            {status && <p className="status muted">{status}</p>}
            <div className="hero__meta">
              <span>Live on localhost network</span>
              <span>Fee: {ethers.formatUnits(fee || 0n, 18)} ETH</span>
            </div>
          </div>

          <div className="hero__card">
            <p className="card__label">Live price</p>
            <p className="card__value">$0.00000042</p>
            <p className="card__change">+12%</p>
            <p className="card__note">The **Live** Price Graph</p>
          </div>
        </section>
        {/* --- START HOW IT WORKS SECTION --- */}
        <section id="how-it-works" className="how-it-works">
          <h1>How It Works</h1>

          <div className="how-it-works__grid">
            {/* Block 1: For Creators (Listing) */}
            <div className="process-card">
              <h3>1. Creator Launches Token</h3>
              <p>A streamer connects their wallet and pays a small fee to deploy a unique token contract for their brand. The token is instantly tradable via a pre-set bonding curve.</p>
            </div>

            {/* Block 2: For Users (Buying) */}
            <div className="process-card">
              <h3>2. Community Invests</h3>
              <p>Fans use ETH to purchase the creator's tokens. These purchases increase the token price and contribute ETH to the contract's liquidity pool.</p>
            </div>

            {/* Block 3: The Mechanism (Price) */}
            <div className="process-card">
              <h3>3. Value Grows</h3>
              <p>Token price is directly tied to demand. As more people buy, the price increases exponentially, rewarding the earliest and most dedicated supporters.</p>
            </div>
          </div>
        </section>
        {/* --- END HOW IT WORKS SECTION --- */}
        {/* --- START FEATURES SECTION (NEW) --- */}
        <section id="features" className="features">
          <h1>The Power of Capacity</h1>

          <div className="features__grid">
            <div className="feature-card">
              <h3>Live Price Discovery</h3>
              <p>Token price is determined by real-time viewer count, tips, and direct trading volume via a transparent **Bonding Curve** smart contract.</p>
            </div>

            <div className="feature-card">
              <h3>Creator Ownership</h3>
              <p>Every creator instantly launches their own personalized, audience-backed token (e.g., $ALICE, $BOB). No need for complex liquidity pools.</p>
            </div>

            <div className="feature-card">
              <h3>Instant Liquidity</h3>
              <p>Buy or sell creator tokens instantly at any time. The Bonding Curve acts as the automated market maker, guaranteeing trades with minimal slippage.</p>
            </div>
          </div>
        </section>
        {/* --- END FEATURES SECTION --- */}

        {/* --- START TOKENOMICS SECTION (NEW) --- */}
        <section id="tokenomics" className="tokenomics">
          <h1>TOKENOMICS AND MECHANICS</h1>

          <div className="tokenomics__content">
            <div className="tokenomics__text">
              <h2>The Bonding Curve</h2>
              <p>Every creator token is deployed with a non-linear **Bonding Curve**. This means the price of the token increases exponentially as more tokens are bought, rewarding early holders.</p>
              <p>When you buy a token, you deposit ETH into a contract, and the token is minted at the calculated price. When you sell, the token is burned, and you receive ETH back from the reserve.</p>
              <p></p> {/* Wrapped in <p> tag */}
            </div>
            <div className="tokenomics__data">
              <h3>Fee Structure</h3>
              <p className="label">Platform Fee (On Listing)</p>
              <p className="value">{ethers.formatUnits(fee || 0n, 18)} ETH</p>
              
              <p className="label">Buy/Sell Transaction Fee</p>
              <p className="value">5%</p>
              
              <p className="label">Fee Allocation</p>
              <ul className="allocation-list">
                <li>3% goes to the **Creator**</li>
                <li>2% goes to the **Liquidity Reserve**</li>
              </ul>
            </div>
          </div>
        </section>
        {/* --- END TOKENOMICS SECTION --- */}
        
        <div className="listings">
          <h1>new listings</h1>

          <div className="tokens">
            {!account ? (
              <p className="muted">Please connect wallet</p>
            ) : tokens.length === 0 ? (
              <p className="muted">No tokens listed</p>
            ) : (
              tokens.map((token, index) => (
                <Token
                  toggleTrade={toggleTrade}
                  token={token}
                  key={index}
                />
              ))
            )}
          </div>
        </div>

        {showCreate && (
          <List toggleCreate={toggleCreate} fee={fee} provider={provider} factory={factory} />
        )}

        {showTrade && (
          <Trade toggleTrade={toggleTrade} token={token} provider={provider} factory={factory} />
        )}
      </main>

      <Footer />
      
    </div>
  );
}