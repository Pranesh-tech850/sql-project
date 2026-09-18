import { useState } from "react";
import "./Balance.css";

// ==========================================
// BACKEND API URL
// ==========================================

const API_URL = "https://sql-project-2-ur3x.onrender.com";



function Balance() {

  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(false);

  // BUY MODAL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  // BUY QUANTITY
  const [buyQuantity, setBuyQuantity] = useState(1);

  // BUY LOADING
  const [buying, setBuying] = useState(false);

  // MESSAGE
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // ==========================================
  // FETCH BALANCE
  // ==========================================

  const fetchBalance = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/balance`
      );

      if (!response.ok) {

        throw new Error("Failed to fetch balance");

      }

      const data = await response.json();

      setBalance(data);

    } catch (error) {

      console.error("BALANCE ERROR:", error);

      setErrorMessage(
        "Unable to fetch balance from server."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // OPEN BUY MODAL
  // ==========================================

  const handleBuy = (product) => {

    setSelectedProduct(product);

    setBuyQuantity(1);

    setMessage("");

    setErrorMessage("");

    setShowBuyModal(true);

  };


  // ==========================================
  // CLOSE BUY MODAL
  // ==========================================

  const closeBuyModal = () => {

    if (buying) {
      return;
    }

    setShowBuyModal(false);

    setSelectedProduct(null);

    setBuyQuantity(1);

    setMessage("");

    setErrorMessage("");

  };


  // ==========================================
  // CONFIRM BUY
  // ==========================================

  const confirmBuy = async () => {

    if (!selectedProduct) {
      return;
    }


    // ======================================
    // CONVERT QUANTITY TO NUMBER
    // ======================================

    const quantity = Number(buyQuantity);


    // ======================================
    // VALIDATE QUANTITY
    // ======================================

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {

      setErrorMessage(
        "Please enter a valid quantity."
      );

      return;

    }


    if (
      quantity >
      Number(selectedProduct.quantity)
    ) {

      setErrorMessage(
        `Only ${selectedProduct.quantity} items are available.`
      );

      return;

    }


    try {

      setBuying(true);

      setMessage("");

      setErrorMessage("");


      // ======================================
      // GET CURRENT LOGGED-IN USER
      // ======================================

      let currentUser = null;

      const storedUser =
        localStorage.getItem("currentUser");


      if (storedUser) {

        try {

          currentUser = JSON.parse(storedUser);

        } catch (error) {

          console.error(
            "Invalid currentUser in localStorage"
          );

        }

      }


      // ======================================
      // BUYER INFORMATION
      // ======================================

      const buyerId =
        currentUser?.id ||
        currentUser?.user_id ||
        null;

      const buyerName =
        currentUser?.name ||
        currentUser?.user_name ||
        "";

      const buyerEmail =
        currentUser?.email ||
        currentUser?.user_email ||
        "";


      // ======================================
      // CHECK LOGIN
      // ======================================

      if (!buyerName || !buyerEmail) {

        setErrorMessage(
          "Please login before buying a product."
        );

        return;

      }


      // ======================================
      // SEND BUY REQUEST
      // ======================================

      const response = await fetch(
        `${API_URL}/buy`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            // BALANCE ROW
            balance_id:
              selectedProduct.id,

            // PRODUCT
            product_id:
              selectedProduct.product_id || null,

            product_name:
              selectedProduct.product_name,

            // SELLER
            seller_name:
              selectedProduct.user_name,

            seller_email:
              selectedProduct.user_email || null,

            // BUYER
            buyer_id:
              buyerId,

            buyer_name:
              buyerName,

            buyer_email:
              buyerEmail,

            // PURCHASE
            quantity:
              quantity,

            price:
              Number(selectedProduct.price)

          })

        }
      );


      // ======================================
      // READ RESPONSE
      // ======================================

      const data = await response.json();


      // ======================================
      // BACKEND ERROR
      // ======================================

      if (!response.ok) {

        setErrorMessage(
          data.message ||
          "Purchase failed."
        );

        return;

      }


      // ======================================
      // SUCCESS
      // ======================================

      setMessage(
        `Successfully bought ${quantity} ${selectedProduct.product_name}.`
      );


      // ======================================
      // UPDATE FRONTEND BALANCE
      // ======================================

      if (data.remainingQuantity === 0) {

        // Product completely sold
        // Remove it from table

        setBalance(
          (previousBalance) =>
            previousBalance.filter(
              (item) =>
                item.id !== selectedProduct.id
            )
        );

      } else {

        // Product still has stock
        // Update quantity

        setBalance(
          (previousBalance) =>
            previousBalance.map((item) => {

              if (
                item.id === selectedProduct.id
              ) {

                return {
                  ...item,
                  quantity:
                    data.remainingQuantity
                };

              }

              return item;

            })
        );

      }


      // ======================================
      // CLOSE MODAL AFTER SUCCESS
      // ======================================

      setTimeout(() => {

        setShowBuyModal(false);

        setSelectedProduct(null);

        setBuyQuantity(1);

        setMessage("");

      }, 1200);


    } catch (error) {

      console.error(
        "BUY ERROR:",
        error
      );

      setErrorMessage(
        "Unable to connect to the server."
      );

    } finally {

      setBuying(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <section className="balance-section">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="balance-header">

        <div>

          <span className="balance-label">
            INVENTORY BALANCE
          </span>

          <h2>
            Balance
          </h2>

          <p>
            Track products purchased from multiple users
          </p>

        </div>


        <button
          className="balance-fetch-btn"
          onClick={fetchBalance}
          disabled={loading}
        >

          {loading
            ? "Fetching..."
            : "Fetch Balance"
          }

        </button>

      </div>



      {/* ======================================
          BALANCE CARD
      ====================================== */}

      <div className="balance-card">


        <div className="balance-top">

          <div>

            <h3>
              Product Balances
            </h3>

            <span>

              {balance.length.toLocaleString()}
              {" "}
              records loaded

            </span>

          </div>


          {balance.length > 0 && (

            <span className="balance-badge">
              Active
            </span>

          )}

        </div>



        {/* ====================================
            EMPTY
        ==================================== */}

        {balance.length === 0 ? (

          <div className="balance-empty">

            <div className="balance-icon">
              💰
            </div>

            <h3>
              No balance data loaded
            </h3>

            <p>
              Click "Fetch Balance" to retrieve
              product balance information.
            </p>

          </div>

        ) : (


          /* ==================================
             TABLE
          ================================== */

          <div className="balance-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    User
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Quantity
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {balance.map((item) => (

                  <tr
                    key={item.id}
                  >

                    <td>

                      <span className="balance-id">
                        #{item.id}
                      </span>

                    </td>


                    <td>

                      <span className="user-name">
                        {item.user_name}
                      </span>

                    </td>


                    <td>

                      <strong className="balance-product">
                        {item.product_name}
                      </strong>

                    </td>


                    <td>

                      <span className="balance-quantity">
                        {item.quantity}
                      </span>

                    </td>


                    <td className="balance-price">

                      ₹
                      {Number(item.price).toFixed(2)}

                    </td>


                    {/* BUY BUTTON */}

                    <td>

                      <button
                        className="buy-btn"
                        onClick={() =>
                          handleBuy(item)
                        }
                      >
                        Buy
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>



      {/* ======================================
          BUY MODAL
      ====================================== */}

      {showBuyModal &&
        selectedProduct && (

          <div
            className="buy-modal-overlay"
            onClick={(e) => {

              if (
                e.target === e.currentTarget
              ) {

                closeBuyModal();

              }

            }}
          >

            <div className="buy-modal">


              {/* CLOSE */}

              <button
                className="buy-modal-close"
                onClick={closeBuyModal}
                disabled={buying}
              >
                ×
              </button>



              <h2>
                Buy Product
              </h2>



              {/* PRODUCT */}

              <div className="buy-product-info">

                <h3>
                  {selectedProduct.product_name}
                </h3>


                <p>

                  Seller:

                  {" "}

                  <strong>
                    {selectedProduct.user_name}
                  </strong>

                </p>


                <p>

                  Price:

                  {" "}

                  <strong>

                    ₹
                    {Number(
                      selectedProduct.price
                    ).toFixed(2)}

                  </strong>

                </p>


                <p>

                  Available Quantity:

                  {" "}

                  <strong>

                    {selectedProduct.quantity}

                  </strong>

                </p>

              </div>



              {/* QUANTITY */}

              <div className="buy-quantity-box">

                <label>
                  Quantity
                </label>


                <input
                  type="number"
                  min="1"
                  max={
                    selectedProduct.quantity
                  }
                  value={buyQuantity}
                  disabled={buying}
                  onChange={(e) => {

                    const value =
                      Number(e.target.value);

                    setBuyQuantity(value);

                    setErrorMessage("");

                  }}
                />

              </div>



              {/* TOTAL */}

              <div className="buy-total">

                <span>
                  Total
                </span>


                <strong>

                  ₹

                  {(
                    Number(
                      selectedProduct.price
                    ) *
                    Number(
                      buyQuantity || 0
                    )
                  ).toFixed(2)}

                </strong>

              </div>



              {/* ERROR */}

              {errorMessage && (

                <div className="buy-error">

                  {errorMessage}

                </div>

              )}



              {/* SUCCESS */}

              {message && (

                <div className="buy-success">

                  {message}

                </div>

              )}



              {/* CONFIRM */}

              <button
                className="confirm-buy-btn"
                onClick={confirmBuy}
                disabled={buying}
              >

                {buying
                  ? "Processing..."
                  : "Confirm Buy"
                }

              </button>


            </div>

          </div>

        )}

    </section>

  );

}


export default Balance;