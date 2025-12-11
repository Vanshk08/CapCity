// File: ./components/Footer.js

export const Footer = () => {
  return (
    <footer>
      <p>&copy; 2024 StreamToken. All rights reserved.</p>
      <p className="tech-info">Powered by the **Solana** Blockchain and **Bonding Curve** Smart Contracts.</p>
      <div className="social-links">
        {/* We use React fragments or divs inside the map in case we turn this into a dynamic list later, 
            but for now, static links are cleanest. */}
        <a href="#">X (Twitter)</a>
        <a href="#">Discord</a>
        <a href="#">Security Audit</a>
        <a href="#">Whitepaper</a>
      </div>
    </footer>
  );
}