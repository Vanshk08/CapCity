// File: ./components/Footer.js

// Using a named export (no 'default' keyword)
export function Footer() { 
  return (
    <footer>
      <p>&copy; 2024 StreamToken. All rights reserved.</p>
      <p className="tech-info">Powered by the **Solana** Blockchain and **Bonding Curve** Smart Contracts.</p>
      <div className="social-links">
        <a href="#">X (Twitter)</a>
        <a href="#">Discord</a>
        <a href="#">Security Audit</a>
        <a href="#">Whitepaper</a>
      </div>
    </footer>
  );
}