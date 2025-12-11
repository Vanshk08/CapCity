import { ethers } from "ethers"

function List({ toggleCreate, fee, provider, factory }) {
  async function listHandler(form) {
    const name = form.get("name")
    const ticker = form.get("ticker")

    const signer = await provider.getSigner()

    const transaction = await factory.connect(signer).create(name, ticker, { value: fee })
    await transaction.wait()

    toggleCreate()
  }

  return (
    <div className="list">
      <div className="list__content-wrapper"> {/* NEW CONTAINER TO HOLD THE MODAL CONTENT */}
        <h2>Launch Your Creator Token</h2> 

        <div className="list__description">
          <p>Creation Fee: **{ethers.formatUnits(fee, 18)} ETH**</p>
        </div>

        <form action={listHandler}>
          <input type="text" name="name" placeholder="Token Name (e.g., StreamToken)" required minLength="3" />
          <input type="text" name="ticker" placeholder="Ticker Symbol (e.g., ST)" required minLength="2" maxLength="5" />
          
          <div className="form__actions"> {/* NEW CONTAINER FOR BUTTONS */}
            {/* Using the new primary-btn for the main action */}
            <button type="submit" className="primary-btn large-btn">List Token</button> 

            {/* Using the new secondary-btn for the cancel action */}
            <button type="button" onClick={toggleCreate} className="secondary-btn large-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default List;