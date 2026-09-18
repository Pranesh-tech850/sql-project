const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully");
});

app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

app.get("/users/search", (req, res) => {

    const { id, email } = req.query;

    const sql = `
        SELECT * FROM users
        WHERE id = ? AND email = ?
    `;

    db.query(sql, [id, email], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(results[0]);
    });
});



app.post("/users", (req, res) => {
    const { name, email } = req.body;
    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.query(sql, [name, email], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        else {
            res.status(201).json({
                message: "User created successfully",
                userId: results.insertId
            })
        }

    });
});

app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        else {
            res.status(200).json({
                message: "User deleted successfully"
            })
        }
    });
});


app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";

    db.query(sql, [name, email, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User updated successfully"
        });
    });
});


app.delete("/users/:id", (req, res) => {



    const userId = req.params.id;

    const sql = "DELETE FROM users WHERE id = ?";

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully"
        });

     

    });
});
// """""""""""""""""""""""""""""""Product page to get all list of products"""""""""""""""""""""""""""""""""
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(results);
    });
});


app.post("/products", (req, res) => {
    const { product_name,price } = req.body;
    const sql = "INSERT INTO products (product_name, price) VALUES (?, ?)";
    db.query(sql, [product_name, price], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        else {
            res.status(201).json({
                message: "Product created successfully",
                userId: results.insertId
            })
        }

    });
});

app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        else {
            res.status(200).json({
                message: "Product  deleted successfully"
            })
        }
    });
});


app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const { product_name, price } = req.body;

    const sql = "UPDATE products SET product_name = ?, price = ? WHERE id = ?";

    db.query(sql, [product_name, price, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully"
        });
    });
});

app.get("/products/search", (req, res) => {

    const { id } = req.query;

    const sql = `
        SELECT * FROM products
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);
    });
});



// """""""""""""""""""""""""""""""Product page to get all list of products"""""""""""""""""""""""""""""""""

app.get("/orderss", (req, res) => {

    const start = Date.now();

    db.query(
        "SELECT * FROM orders LIMIT 1000",
        (err, result) => {

            const time = Date.now() - start;

            if (err) {
                return res.status(500).json({
                    error: err.message,
                    time: time + " ms"
                });
            }

            res.json({
                orders: result,
                rows: result.length,
                time: time + " ms"
            });
        }
    );
});

// email
app.get("/orders", (req, res) => {

    const { user_email } = req.query;

    if (!user_email) {
        return res.status(400).json({
            error: "Please provide user email"
        });
    }

    const start = Date.now();

    const sql = `
        SELECT *
        FROM orders
        WHERE user_email = ?
    `;

    db.query(sql, [user_email], (err, result) => {

        const time = Date.now() - start;

        if (err) {
            return res.status(500).json({
                error: err.message,
                time: time + " ms"
            });
        }

        res.json({
            orders: result,
            rows: result.length,
            time: time + " ms"
        });
    });
});

app.delete("/orderss/:id", (req, res) => {

  const id = req.params.id;

  const sql = "DELETE FROM orders WHERE id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to delete order"
      });
    }

    res.json({
      message: "Order deleted successfully",
      deletedId: id
    });

  });

});

app.post("/orderss", (req, res) => {

    const {
        user_id,
        product_id,
        quantity,
        user_name,
        user_email,
        product_name,
        product_price
    } = req.body;

    const sql = `
        INSERT INTO orders
        (user_id, product_id, quantity, user_name, user_email, product_name, product_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        user_id,
        product_id,
        quantity,
        user_name,
        user_email,
        product_name,
        product_price
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error("MYSQL ERROR:", err);

            return res.status(500).json({
                message: "Failed to add order",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Order added successfully",
            orderId: result.insertId
        });
    });
});



app.put("/orderss/:id", (req, res) => {

    const id = req.params.id;

    const {
        user_id,
        product_id,
        quantity,
        user_name,
        user_email,
        product_name,
        product_price
    } = req.body;

    const sql = `
        UPDATE orders
        SET
            user_id = ?,
            product_id = ?,
            quantity = ?,
            user_name = ?,
            user_email = ?,
            product_name = ?,
            product_price = ?
        WHERE id = ?
    `;

    const values = [
        user_id,
        product_id,
        quantity,
        user_name,
        user_email,
        product_name,
        product_price,
        id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error("MYSQL ERROR:", err);

            return res.status(500).json({
                message: "Failed to update order",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order updated successfully",
            updatedId: id
        });
    });
});


// ====================================BALANCE ===================================================================
// ====================================
// BALANCE
// ====================================

app.get("/balance", (req, res) => {

    const sql = `
        SELECT *
        FROM balance
        ORDER BY id
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("BALANCE MYSQL ERROR:", err);

            return res.status(500).json({
                message: "Failed to fetch balance",
                error: err.message
            });
        }

        res.json(results);

    });

});



// ====================================
// BUY PRODUCT
// ====================================

app.post("/buy", (req, res) => {

    const {
        balance_id,
        product_id,
        product_name,

        seller_name,
        seller_email,

        buyer_id,
        buyer_name,
        buyer_email,

        quantity,
        price

    } = req.body;


    // ==================================
    // VALIDATION
    // ==================================

    if (!balance_id) {

        return res.status(400).json({
            message: "Balance ID is required"
        });

    }


    if (!quantity || quantity <= 0) {

        return res.status(400).json({
            message: "Invalid quantity"
        });

    }


    if (!buyer_name || !buyer_email) {

        return res.status(400).json({
            message: "Buyer login information is required"
        });

    }


    // ==================================
    // START TRANSACTION
    // ==================================

    db.beginTransaction((transactionError) => {

        if (transactionError) {

            console.error(
                "TRANSACTION ERROR:",
                transactionError
            );

            return res.status(500).json({
                message: "Could not start transaction"
            });

        }


        // ==================================
        // LOCK BALANCE ROW
        // ==================================

        const lockSql = `
            SELECT *
            FROM balance
            WHERE id = ?
            FOR UPDATE
        `;


        db.query(
            lockSql,
            [balance_id],
            (lockError, rows) => {

                if (lockError) {

                    return db.rollback(() => {

                        console.error(
                            "LOCK ERROR:",
                            lockError
                        );

                        res.status(500).json({
                            message:
                                "Failed to check product stock",
                            error:
                                lockError.message
                        });

                    });

                }


                // ==================================
                // PRODUCT NOT FOUND
                // ==================================

                if (rows.length === 0) {

                    return db.rollback(() => {

                        res.status(404).json({
                            message:
                                "Product is no longer available"
                        });

                    });

                }


                const product = rows[0];


                const availableQuantity =
                    Number(product.quantity);


                const requestedQuantity =
                    Number(quantity);


                // ==================================
                // CHECK STOCK
                // ==================================

                if (
                    availableQuantity <
                    requestedQuantity
                ) {

                    return db.rollback(() => {

                        res.status(409).json({

                            message:
                                `Only ${availableQuantity} items are available.`

                        });

                    });

                }


                // ==================================
                // CALCULATE REMAINING
                // ==================================

                const remainingQuantity =
                    availableQuantity -
                    requestedQuantity;


                // ==================================
                // INSERT ORDER
                // ==================================

                const orderSql = `
                    INSERT INTO orders
                    (
                        user_id,
                        product_id,
                        quantity,
                        user_name,
                        user_email,
                        product_name,
                        product_price
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;


                const orderValues = [

                    buyer_id,

                    product_id,

                    requestedQuantity,

                    buyer_name,

                    buyer_email,

                    product_name ||
                    product.product_name,

                    price ||
                    product.price

                ];


                db.query(
                    orderSql,
                    orderValues,
                    (orderError, orderResult) => {

                        if (orderError) {

                            return db.rollback(() => {

                                console.error(
                                    "ORDER INSERT ERROR:",
                                    orderError
                                );

                                res.status(500).json({

                                    message:
                                        "Failed to create order",

                                    error:
                                        orderError.message

                                });

                            });

                        }


                        // ==================================
                        // IF SOLD OUT
                        // DELETE BALANCE ROW
                        // ==================================

                        if (
                            remainingQuantity === 0
                        ) {

                            const deleteSql = `
                                DELETE FROM balance
                                WHERE id = ?
                            `;


                            db.query(
                                deleteSql,
                                [balance_id],
                                (deleteError) => {

                                    if (
                                        deleteError
                                    ) {

                                        return db.rollback(
                                            () => {

                                                console.error(
                                                    "DELETE BALANCE ERROR:",
                                                    deleteError
                                                );

                                                res.status(
                                                    500
                                                ).json({

                                                    message:
                                                        "Failed to remove sold-out product",

                                                    error:
                                                        deleteError.message

                                                });

                                            }
                                        );

                                    }


                                    // ==================================
                                    // COMMIT
                                    // ==================================

                                    db.commit(
                                        (commitError) => {

                                            if (
                                                commitError
                                            ) {

                                                return db.rollback(
                                                    () => {

                                                        console.error(
                                                            "COMMIT ERROR:",
                                                            commitError
                                                        );

                                                        res.status(
                                                            500
                                                        ).json({

                                                            message:
                                                                "Failed to complete purchase",

                                                            error:
                                                                commitError.message

                                                        });

                                                    }
                                                );

                                            }


                                            res.status(201).json({

                                                message:
                                                    "Product sold successfully",

                                                orderId:
                                                    orderResult.insertId,

                                                remainingQuantity:
                                                    0,

                                                soldOut:
                                                    true

                                            });

                                        }
                                    );

                                }
                            );


                        } else {


                            // ==================================
                            // UPDATE BALANCE
                            // ==================================

                            const updateSql = `
                                UPDATE balance
                                SET quantity = ?
                                WHERE id = ?
                            `;


                            db.query(
                                updateSql,
                                [
                                    remainingQuantity,
                                    balance_id
                                ],
                                (updateError) => {

                                    if (
                                        updateError
                                    ) {

                                        return db.rollback(
                                            () => {

                                                console.error(
                                                    "UPDATE BALANCE ERROR:",
                                                    updateError
                                                );

                                                res.status(
                                                    500
                                                ).json({

                                                    message:
                                                        "Failed to update balance",

                                                    error:
                                                        updateError.message

                                                });

                                            }
                                        );

                                    }


                                    // ==================================
                                    // COMMIT
                                    // ==================================

                                    db.commit(
                                        (commitError) => {

                                            if (
                                                commitError
                                            ) {

                                                return db.rollback(
                                                    () => {

                                                        console.error(
                                                            "COMMIT ERROR:",
                                                            commitError
                                                        );

                                                        res.status(
                                                            500
                                                        ).json({

                                                            message:
                                                                "Purchase failed",

                                                            error:
                                                                commitError.message

                                                        });

                                                    }
                                                );

                                            }


                                            res.status(201).json({

                                                message:
                                                    "Product purchased successfully",

                                                orderId:
                                                    orderResult.insertId,

                                                remainingQuantity:
                                                    remainingQuantity,

                                                soldOut:
                                                    false

                                            });

                                        }
                                    );

                                }
                            );

                        }

                    }
                );

            }
        );

    });

});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});