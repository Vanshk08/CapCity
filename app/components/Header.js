import Link from "next/link";

function Header({ account, onConnect }) {

  return (
    <header>
      <div className="brand-wrap">
        <p className="brand">Capacity</p>
      </div>

      <div className="header__right">
        <nav className="nav-links">
          <Link href="#features">Features</Link>
          <Link href="#tokenomics">Tokenomics</Link>
        </nav>

        <div className="header__actions">
          <a className="pill pill--primary" href="#listings">Launch App</a>
          {account ? (
            <button onClick={onConnect} className="btn--fancy">
              Connected · {account.slice(0, 6) + '...' + account.slice(38, 42)}
            </button>
          ) : (
            <button onClick={onConnect} className="btn--fancy">Connect wallet</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;