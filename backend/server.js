const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());


// =====================================================
// MYSQL CONNECTION POOL
// =====================================================

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Test MySQL connection
db.getConnection((err, connection) => {

    if (err) {
        console.error("MySQL connection failed:");
        console.error(err);
        return;
    }

    console.log("MySQL connected successfully");

    connection.release();
});


// =====================================================
// USERS
// =====================================================

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


// =====================================================
// SEARCH USER
// =====================================================

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


// =====================================================
// CREATE USER
// =====================================================

app.post("/users", (req, res) => {

    const { name, email } = req.body;

    const sql = `
        INSERT INTO users (name, email)
        VALUES (?, ?)
    `;

    db.query(sql, [name, email], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "User created successfully",
            userId: results.insertId
        });
    });
});


// =====================================================
// DELETE USER
// =====================================================

app.delete("/users/:id", (req, res) => {

    const userId = req.params.id;

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

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


// =====================================================
// UPDATE USER
// =====================================================

app.put("/users/:id", (req, res) => {

    const { id } = req.params;
    const { name, email } = req.body;

    const sql = `
        UPDATE users
        SET name = ?, email = ?
        WHERE id = ?
    `;

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


// =====================================================
// PRODUCTS
// =====================================================

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


// =====================================================
// CREATE PRODUCT
// =====================================================

app.post("/products", (req, res) => {

    const { product_name, price } = req.body;

    const sql = `
        INSERT INTO products (product_name, price)
        VALUES (?, ?)
    `;

    db.query(sql, [product_name, price], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Product created successfully",
            productId: results.insertId
        });
    });
});


// =====================================================
// DELETE PRODUCT
// =====================================================

app.delete("/products/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM products
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

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
            message: "Product deleted successfully"
        });
    });
});


// =====================================================
// UPDATE PRODUCT
// =====================================================

app.put("/products/:id", (req, res) => {

    const { id } = req.params;
    const { product_name, price } = req.body;

    const sql = `
        UPDATE products
        SET product_name = ?, price = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [product_name, price, id],
        (err, result) => {

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
        }
    );
});


// =====================================================
// SEARCH PRODUCT
// =====================================================

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


// =====================================================
// ORDERS - GET 1000
// =====================================================

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


// =====================================================
// ORDERS - SEARCH BY EMAIL
// =====================================================

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


// =====================================================
// DELETE ORDER
// =====================================================

app.delete("/orderss/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM orders
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Failed to delete order"
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order deleted successfully",
            deletedId: id
        });
    });
});


// =====================================================
// CREATE ORDER
// =====================================================

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


// =====================================================
// UPDATE ORDER
// =====================================================

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


// =====================================================
// BALANCE
// =====================================================

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


// =====================================================
// BUY PRODUCT
// =====================================================

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


    // =================================================
    // VALIDATION
    // =================================================

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


    // =================================================
    // GET A DEDICATED CONNECTION FROM POOL
    // =================================================

    db.getConnection((connectionError, connection) => {

        if (connectionError) {

            console.error(
                "GET CONNECTION ERROR:",
                connectionError
            );

            return res.status(500).json({
                message: "Could not get database connection",
                error: connectionError.message
            });
        }


        // =================================================
        // START TRANSACTION
        // =================================================

        connection.beginTransaction((transactionError) => {

            if (transactionError) {

                connection.release();

                console.error(
                    "TRANSACTION ERROR:",
                    transactionError
                );

                return res.status(500).json({
                    message: "Could not start transaction",
                    error: transactionError.message
                });
            }


            // =================================================
            // LOCK BALANCE ROW
            // =================================================

            const lockSql = `
                SELECT *
                FROM balance
                WHERE id = ?
                FOR UPDATE
            `;

            connection.query(
                lockSql,
                [balance_id],
                (lockError, rows) => {

                    if (lockError) {

                        return connection.rollback(() => {

                            connection.release();

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


                    // =================================================
                    // PRODUCT NOT FOUND
                    // =================================================

                    if (rows.length === 0) {

                        return connection.rollback(() => {

                            connection.release();

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


                    // =================================================
                    // CHECK STOCK
                    // =================================================

                    if (
                        availableQuantity <
                        requestedQuantity
                    ) {

                        return connection.rollback(() => {

                            connection.release();

                            res.status(409).json({
                                message:
                                    `Only ${availableQuantity} items are available.`
                            });
                        });
                    }


                    // =================================================
                    // REMAINING QUANTITY
                    // =================================================

                    const remainingQuantity =
                        availableQuantity -
                        requestedQuantity;


                    // =================================================
                    // INSERT ORDER
                    // =================================================

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


                    connection.query(
                        orderSql,
                        orderValues,
                        (orderError, orderResult) => {

                            if (orderError) {

                                return connection.rollback(() => {

                                    connection.release();

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


                            // =================================================
                            // SOLD OUT
                            // =================================================

                            if (remainingQuantity === 0) {

                                const deleteSql = `
                                    DELETE FROM balance
                                    WHERE id = ?
                                `;


                                connection.query(
                                    deleteSql,
                                    [balance_id],
                                    (deleteError) => {

                                        if (deleteError) {

                                            return connection.rollback(
                                                () => {

                                                    connection.release();

                                                    console.error(
                                                        "DELETE BALANCE ERROR:",
                                                        deleteError
                                                    );

                                                    res.status(500).json({
                                                        message:
                                                            "Failed to remove sold-out product",
                                                        error:
                                                            deleteError.message
                                                    });
                                                }
                                            );
                                        }


                                        // =================================================
                                        // COMMIT
                                        // =================================================

                                        connection.commit(
                                            (commitError) => {

                                                if (commitError) {

                                                    return connection.rollback(
                                                        () => {

                                                            connection.release();

                                                            console.error(
                                                                "COMMIT ERROR:",
                                                                commitError
                                                            );

                                                            res.status(500).json({
                                                                message:
                                                                    "Failed to complete purchase",
                                                                error:
                                                                    commitError.message
                                                            });
                                                        }
                                                    );
                                                }


                                                connection.release();


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

                                // =================================================
                                // UPDATE BALANCE
                                // =================================================

                                const updateSql = `
                                    UPDATE balance
                                    SET quantity = ?
                                    WHERE id = ?
                                `;


                                connection.query(
                                    updateSql,
                                    [
                                        remainingQuantity,
                                        balance_id
                                    ],
                                    (updateError) => {

                                        if (updateError) {

                                            return connection.rollback(
                                                () => {

                                                    connection.release();

                                                    console.error(
                                                        "UPDATE BALANCE ERROR:",
                                                        updateError
                                                    );

                                                    res.status(500).json({
                                                        message:
                                                            "Failed to update balance",
                                                        error:
                                                            updateError.message
                                                    });
                                                }
                                            );
                                        }


                                        // =================================================
                                        // COMMIT
                                        // =================================================

                                        connection.commit(
                                            (commitError) => {

                                                if (commitError) {

                                                    return connection.rollback(
                                                        () => {

                                                            connection.release();

                                                            console.error(
                                                                "COMMIT ERROR:",
                                                                commitError
                                                            );

                                                            res.status(500).json({
                                                                message:
                                                                    "Purchase failed",
                                                                error:
                                                                    commitError.message
                                                            });
                                                        }
                                                    );
                                                }


                                                connection.release();


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
});


// =====================================================
// ROOT / HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {

    res.json({
        message: "Backend is running",
        database: "Aiven MySQL"
    });
});


// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Server running on port ${PORT}`);

});