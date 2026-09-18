import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Balance from "./components/Balance";

// ======================================================
// BACKEND API URL
// ======================================================

const API_URL = "https://sql-project-2-ur3x.onrender.com";


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard() {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Welcome to MyStore</p>
    </div>
  );
}


// ======================================================
// USERS
// ======================================================

function Users() {

  const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [showGetUser, setShowGetUser] = useState(false);
  const [userId, setUserId] = useState("");
  const [getUserEmail, setGetUserEmail] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [showEditForm, setShowEditForm] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");


  // ======================================================
  // FETCH ALL USERS
  // ======================================================

  const fetchUsers = async () => {

    try {

      const response = await fetch(
        `${API_URL}/users`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      setUsers(data);

    } catch (error) {

      console.error(
        "Error fetching users:",
        error
      );

    }
  };


  // ======================================================
  // GET PARTICULAR USER
  // ======================================================

  const getUser = async () => {

    try {

      const response = await fetch(
        `${API_URL}/users/search?id=${userId}&email=${getUserEmail}`
      );

      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();

      setUsers([data]);

      setSelectedUser(data);

      setShowGetUser(false);

      setUserId("");
      setGetUserEmail("");

    } catch (error) {

      console.error(
        "Error fetching particular user:",
        error
      );

      alert("User not found");

    }
  };


  // ======================================================
  // ADD USER
  // ======================================================

  const addUser = async () => {

    try {

      const response = await fetch(
        `${API_URL}/users`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: name,
            email: email
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const data = await response.json();

      console.log(data);

      setName("");
      setEmail("");

      setShowForm(false);

      fetchUsers();

    } catch (error) {

      console.error(
        "Error adding user:",
        error
      );

    }
  };


  // ======================================================
  // OPEN EDIT USER
  // ======================================================

  const openEditForm = (user) => {

    setEditUserId(user.id);

    setEditName(user.name);

    setEditEmail(user.email);

    setShowEditForm(true);

  };


  // ======================================================
  // UPDATE USER
  // ======================================================

  const updateUser = async () => {

    try {

      const response = await fetch(
        `${API_URL}/users/${editUserId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: editName,
            email: editEmail
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();

      console.log(data);

      setShowEditForm(false);

      setEditUserId("");
      setEditName("");
      setEditEmail("");

      fetchUsers();

    } catch (error) {

      console.error(
        "Error updating user:",
        error
      );

    }
  };


  // ======================================================
  // DELETE USER
  // ======================================================

  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/users/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {

        const errorData =
          await response.json();

        console.log(
          "Backend error:",
          errorData
        );

        throw new Error(
          errorData.error ||
          errorData.message
        );

      }

      const data = await response.json();

      console.log(data);

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== id
        )
      );

    } catch (error) {

      console.error(
        "Error deleting user:",
        error
      );

    }
  };


  // ======================================================
  // USERS UI
  // ======================================================

  return (

    <div className="page">

      <div className="page-header">

        <div>

          <h1>Users</h1>

          <p>
            Manage your users
          </p>

        </div>


        <div className="actions">

          <button
            className="fetch-btn"
            onClick={fetchUsers}
          >
            Fetch Users
          </button>


          <button
            className="add-btn"
            onClick={() =>
              setShowForm(true)
            }
          >
            Add User
          </button>


          <button
            className="get-btn"
            onClick={() =>
              setShowGetUser(true)
            }
          >
            Get User
          </button>

        </div>

      </div>


      {/* ADD USER POPUP */}

      {showForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Add User
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>


            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />


            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />


            <button
              className="save-btn"
              onClick={addUser}
            >
              Save User
            </button>

          </div>

        </div>

      )}


      {/* GET USER POPUP */}

      {showGetUser && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Get User
              </h2>

              <button
                className="close-btn"
                onClick={() => {

                  setShowGetUser(false);

                  setSelectedUser(null);

                  setUserId("");

                  setGetUserEmail("");

                }}
              >
                ×
              </button>

            </div>


            <input
              type="number"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) =>
                setUserId(e.target.value)
              }
            />


            <input
              type="email"
              placeholder="Enter Email"
              value={getUserEmail}
              onChange={(e) =>
                setGetUserEmail(e.target.value)
              }
            />


            <button
              className="save-btn"
              onClick={getUser}
            >
              Fetch User
            </button>


            {selectedUser && (

              <div className="user-details">

                <p>
                  <strong>ID:</strong>{" "}
                  {selectedUser.id}
                </p>

                <p>
                  <strong>Name:</strong>{" "}
                  {selectedUser.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {selectedUser.email}
                </p>

              </div>

            )}

          </div>

        </div>

      )}


      {/* EDIT USER POPUP */}

      {showEditForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Edit User
              </h2>

              <button
                className="close-btn"
                onClick={() => {

                  setShowEditForm(false);

                  setEditUserId("");

                  setEditName("");

                  setEditEmail("");

                }}
              >
                ×
              </button>

            </div>


            <input
              type="text"
              value={editUserId}
              disabled
            />


            <input
              type="text"
              placeholder="Enter name"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
            />


            <input
              type="email"
              placeholder="Enter email"
              value={editEmail}
              onChange={(e) =>
                setEditEmail(e.target.value)
              }
            />


            <button
              className="save-btn"
              onClick={updateUser}
            >
              Update User
            </button>

          </div>

        </div>

      )}


      {/* USERS TABLE */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {users.length > 0 ? (

              users.map((user) => (

                <tr key={user.id}>

                  <td>
                    {user.id}
                  </td>

                  <td>
                    {user.name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditForm(user)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteUser(user.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="4">
                  No users found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}


// ======================================================
// PRODUCTS
// ======================================================

function Products() {

  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [productName, setProductName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [showSearch, setShowSearch] =
    useState(false);

  const [productId, setProductId] =
    useState("");

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [editProductId, setEditProductId] =
    useState("");

  const [editProductName, setEditProductName] =
    useState("");

  const [editPrice, setEditPrice] =
    useState("");


  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  const fetchProducts = async () => {

    try {

      const response = await fetch(
        `${API_URL}/products`
      );

      const data =
        await response.json();

      setProducts(data);

    } catch (error) {

      console.error(
        "Error fetching products:",
        error
      );

    }
  };


  useEffect(() => {

    fetchProducts();

  }, []);


  // ======================================================
  // SEARCH PRODUCT
  // ======================================================

  const searchProduct = async () => {

    try {

      const response = await fetch(
        `${API_URL}/products/search?id=${productId}`
      );

      if (!response.ok) {
        throw new Error(
          "Product not found"
        );
      }

      const data =
        await response.json();

      setProducts([data]);

      setShowSearch(false);

      setProductId("");

    } catch (error) {

      console.error(
        "Error searching product:",
        error
      );

      alert("Product not found");

    }
  };


  // ======================================================
  // ADD PRODUCT
  // ======================================================

  const addProduct = async () => {

    try {

      const response = await fetch(
        `${API_URL}/products`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            product_name:
              productName,

            price: price
          })
        }
      );

      const data =
        await response.json();

      console.log(data);

      setProductName("");

      setPrice("");

      setShowForm(false);

      fetchProducts();

    } catch (error) {

      console.error(
        "Error adding product:",
        error
      );

    }
  };


  // ======================================================
  // OPEN EDIT PRODUCT
  // ======================================================

  const openEditForm = (product) => {

    setEditProductId(product.id);

    setEditProductName(
      product.product_name
    );

    setEditPrice(product.price);

    setShowEditForm(true);

  };


  // ======================================================
  // UPDATE PRODUCT
  // ======================================================

  const updateProduct = async () => {

    try {

      const response = await fetch(
        `${API_URL}/products/${editProductId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            product_name:
              editProductName,

            price: editPrice
          })
        }
      );

      const data =
        await response.json();

      console.log(data);

      setShowEditForm(false);

      fetchProducts();

    } catch (error) {

      console.error(
        "Error updating product:",
        error
      );

    }
  };


  // ======================================================
  // DELETE PRODUCT
  // ======================================================

  const deleteProduct = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {

        const errorData =
          await response.json();

        console.log(
          "Backend error:",
          errorData
        );

        throw new Error(
          errorData.error ||
          errorData.message
        );

      }

      const data =
        await response.json();

      console.log(data);

      setProducts(
        (previousProducts) =>
          previousProducts.filter(
            (product) =>
              product.id !== id
          )
      );

    } catch (error) {

      console.error(
        "Error deleting product:",
        error
      );

    }
  };


  // ======================================================
  // PRODUCTS UI
  // ======================================================

  return (

    <div className="page">

      <h1>
        Products
      </h1>


      <div className="button-container">

        <button
          onClick={() =>
            setShowSearch(true)
          }
        >
          Search Product
        </button>


        <button
          onClick={() =>
            setShowForm(true)
          }
        >
          Add Product
        </button>


        <button
          onClick={fetchProducts}
        >
          Get All Products
        </button>

      </div>


      {/* SEARCH PRODUCT POPUP */}

      {showSearch && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Search Product
              </h2>

              <button
                className="close-btn"
                onClick={() => {

                  setShowSearch(false);

                  setProductId("");

                }}
              >
                ×
              </button>

            </div>


            <input
              type="number"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) =>
                setProductId(
                  e.target.value
                )
              }
            />


            <button
              className="save-btn"
              onClick={searchProduct}
            >
              Search Product
            </button>

          </div>

        </div>

      )}


      {/* ADD PRODUCT POPUP */}

      {showForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Add Product
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>


            <input
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) =>
                setProductName(
                  e.target.value
                )
              }
            />


            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
            />


            <button
              className="save-btn"
              onClick={addProduct}
            >
              Save Product
            </button>

          </div>

        </div>

      )}


      {/* EDIT PRODUCT POPUP */}

      {showEditForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Edit Product
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowEditForm(false)
                }
              >
                ×
              </button>

            </div>


            <input
              type="text"
              value={editProductId}
              disabled
            />


            <input
              type="text"
              placeholder="Product name"
              value={editProductName}
              onChange={(e) =>
                setEditProductName(
                  e.target.value
                )
              }
            />


            <input
              type="number"
              placeholder="Price"
              value={editPrice}
              onChange={(e) =>
                setEditPrice(
                  e.target.value
                )
              }
            />


            <button
              className="save-btn"
              onClick={updateProduct}
            >
              Update Product
            </button>

          </div>

        </div>

      )}


      {/* PRODUCTS TABLE */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>
                Product Name
              </th>

              <th>
                Price
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {products.length > 0 ? (

              products.map((product) => (

                <tr key={product.id}>

                  <td>
                    {product.id}
                  </td>

                  <td>
                    {product.product_name}
                  </td>

                  <td>
                    ₹{product.price}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditForm(product)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteProduct(
                          product.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="4">
                  No products found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}


// ======================================================
// ORDERS
// ======================================================

function Orders() {

  const [orders, setOrders] = useState([]);

  const [searchEmail, setSearchEmail] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    product_id: "",
    quantity: "",
    user_name: "",
    user_email: "",
    product_name: "",
    product_price: ""
  });


  // ======================================================
  // CONCURRENCY TEST
  // ======================================================

  const testConcurrency = async () => {

    const start = performance.now();

    const requests = [];

    for (let i = 0; i < 10; i++) {

      requests.push(
        fetch(
          `${API_URL}/orders?user_email=user59@gmail.com`
        )
          .then(res => {

            if (!res.ok) {

              throw new Error(
                `HTTP error: ${res.status}`
              );

            }

            return res.json();

          })
      );

    }

    try {

      const results =
        await Promise.all(requests);

      const end =
        performance.now();

      console.log(
        "Total time:",
        Math.round(end - start),
        "ms"
      );

      console.table(results);

    } catch (error) {

      console.error(
        "Concurrency test failed:",
        error
      );

    }

  };


  // ======================================================
  // FETCH ALL ORDERS
  // ======================================================

 const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orderss`);

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error || `HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Orders response:", data);

    setOrders(data.data);

  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};


  // ======================================================
  // SEARCH USER ORDERS
  // ======================================================

  const searchUser = async () => {

    if (!searchEmail) {

      alert(
        "Please enter user email"
      );

      return;

    }

    try {

      const response = await fetch(
        `${API_URL}/orders?user_email=${encodeURIComponent(searchEmail)}`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to search user"
        );

      }

      const data =
        await response.json();

      setOrders(data.orders);

      setShowSearch(false);

      setSearchEmail("");

    } catch (error) {

      console.error(
        "Error searching user:",
        error
      );

      alert(
        "No orders found for this user"
      );

    }

  };


  // ======================================================
  // HANDLE FORM INPUT
  // ======================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // ======================================================
  // ADD ORDER
  // ======================================================

  const addOrder = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        `${API_URL}/orderss`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(formData)
        }
      );


      if (!response.ok) {

        const errorData =
          await response.json();

        console.log(
          "Backend error:",
          errorData
        );

        throw new Error(
          errorData.message ||
          "Failed to add order"
        );

      }


      const data =
        await response.json();

      console.log(data);


      alert(
        "Order added successfully"
      );


      setShowAdd(false);


      setFormData({
        user_id: "",
        product_id: "",
        quantity: "",
        user_name: "",
        user_email: "",
        product_name: "",
        product_price: ""
      });


      fetchOrders();


    } catch (error) {

      console.error(
        "Error adding order:",
        error
      );

    }

  };


  // ======================================================
  // DELETE ORDER
  // ======================================================

  const deleteOrders = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `${API_URL}/orderss/${id}`,
        {
          method: "DELETE"
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to delete order"
        );

      }


      setOrders(
        (previousOrders) =>
          previousOrders.filter(
            (order) =>
              order.id !== id
          )
      );


    } catch (error) {

      console.error(
        "Error deleting order:",
        error
      );

    }

  };


  // ======================================================
  // OPEN EDIT FORM
  // ======================================================

  const openEditFormOrders = (order) => {

    setEditId(order.id);

    setFormData({

      user_id: order.user_id,

      product_id: order.product_id,

      quantity: order.quantity,

      user_name: order.user_name,

      user_email: order.user_email,

      product_name: order.product_name,

      product_price: order.product_price

    });

    setShowEdit(true);

  };


  // ======================================================
  // UPDATE ORDER
  // ======================================================

  const updateOrders = async (id) => {

    try {

      console.log(
        "Edit ID:",
        id
      );

      console.log(
        "Form Data:",
        formData
      );


      const response = await fetch(
        `${API_URL}/orderss/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(formData)
        }
      );


      if (!response.ok) {

        const errorData =
          await response.json();

        console.log(
          "Backend error:",
          errorData
        );

        throw new Error(
          errorData.message ||
          "Failed to update order"
        );

      }


      const data =
        await response.json();

      console.log(data);


      alert(
        "Order updated successfully"
      );


      setShowEdit(false);

      setEditId(null);


      setFormData({
        user_id: "",
        product_id: "",
        quantity: "",
        user_name: "",
        user_email: "",
        product_name: "",
        product_price: ""
      });


      fetchOrders();


    } catch (error) {

      console.error(
        "Error updating order:",
        error
      );

    }

  };


  // ======================================================
  // ORDERS UI
  // ======================================================

  return (

    <div className="page">

      <div className="page-header">

        <div>

          <h1>
            Orders
          </h1>

          <p>
            Manage all customer orders
          </p>

        </div>


        <div className="actions">

          <button
            className="search-btn"
            onClick={() =>
              setShowSearch(true)
            }
          >
            Search User
          </button>


          <button
            onClick={testConcurrency}
          >
            Test 10 Concurrent Requests
          </button>


          <button
            className="add-btn"
            onClick={() =>
              setShowAdd(true)
            }
          >
            Add Order
          </button>


          <button
            className="fetch-btn"
            onClick={fetchOrders}
          >
            Get All Orders
          </button>

        </div>

      </div>


      {/* ==================================================
          ORDERS TABLE
      ================================================== */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>User ID</th>

              <th>Product ID</th>

              <th>Quantity</th>

              <th>User Name</th>

              <th>User Email</th>

              <th>Product Name</th>

              <th>Product Price</th>

              <th>Order Date</th>

              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {orders.length > 0 ? (

              orders.map((order) => (

                <tr key={order.id}>

                  <td>
                    {order.id}
                  </td>

                  <td>
                    {order.user_id}
                  </td>

                  <td>
                    {order.product_id}
                  </td>

                  <td>
                    {order.quantity}
                  </td>

                  <td>
                    {order.user_name}
                  </td>

                  <td>
                    {order.user_email}
                  </td>

                  <td>
                    {order.product_name}
                  </td>

                  <td>
                    ₹{order.product_price}
                  </td>

                  <td>
                    {order.order_date}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditFormOrders(order)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteOrders(order.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="10">
                  No orders found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* ==================================================
          EDIT ORDER POPUP
      ================================================== */}

      {showEdit && (

        <div className="modal-overlay">

          <div className="modal order-modal">

            <div className="modal-header">

              <h2>
                Edit Order
              </h2>


              <button
                className="close-btn"
                onClick={() => {

                  setShowEdit(false);

                  setEditId(null);

                }}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={(e) => {

                e.preventDefault();

                updateOrders(editId);

              }}
            >

              <div className="order-form-grid">


                <div className="order-form-group">

                  <label>
                    User ID
                  </label>

                  <input
                    type="number"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    Product ID
                  </label>

                  <input
                    type="number"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    User Name
                  </label>

                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group full-width">

                  <label>
                    User Email
                  </label>

                  <input
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    Product Price
                  </label>

                  <input
                    type="number"
                    name="product_price"
                    value={formData.product_price}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {

                    setShowEdit(false);

                    setEditId(null);

                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-btn"
                >
                  Update Order
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ==================================================
          SEARCH USER POPUP
      ================================================== */}

      {showSearch && (

        <div className="modal-overlay">

          <div className="modal search-modal">

            <div className="modal-header">

              <h2>
                Search User
              </h2>


              <button
                className="close-btn"
                onClick={() => {

                  setShowSearch(false);

                  setSearchEmail("");

                }}
              >
                ×
              </button>

            </div>


            <input
              type="email"
              placeholder="Enter user email"
              value={searchEmail}
              onChange={(e) =>
                setSearchEmail(
                  e.target.value
                )
              }
            />


            <button
              className="save-btn"
              onClick={searchUser}
            >
              Search Orders
            </button>

          </div>

        </div>

      )}


      {/* ==================================================
          ADD ORDER POPUP
      ================================================== */}

      {showAdd && (

        <div className="modal-overlay">

          <div className="modal order-modal">

            <div className="modal-header">

              <h2>
                Add Order
              </h2>


              <button
                className="close-btn"
                onClick={() =>
                  setShowAdd(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={addOrder}
            >

              <div className="order-form-grid">


                <div className="order-form-group">

                  <label>
                    User ID
                  </label>

                  <input
                    type="number"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    Product ID
                  </label>

                  <input
                    type="number"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    User Name
                  </label>

                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group full-width">

                  <label>
                    User Email
                  </label>

                  <input
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="order-form-group">

                  <label>
                    Product Price
                  </label>

                  <input
                    type="number"
                    name="product_price"
                    value={formData.product_price}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowAdd(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-btn"
                >
                  Add Order
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}


// ======================================================
// APP
// ======================================================

function App() {

  return (

    <BrowserRouter>

      {/* NAVBAR */}

      <nav className="navbar">

        <h2>
          MyStore
        </h2>


        <div className="nav-links">

          <Link to="/">
            Dashboard
          </Link>

          <Link to="/users">
            Users
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/orders">
            Orders
          </Link>

          <Link to="/balance">
            Balance
          </Link>

        </div>

      </nav>


      {/* ROUTES */}

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/users"
          element={<Users />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/balance"
          element={<Balance />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;