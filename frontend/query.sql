CREATE DATABASE my_app;
USE my_app;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100)
);
SELECT DATABASE();
SHOW TABLES;

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

SHOW TABLES;
INSERT INTO users (name, email)
VALUES
('Pranesh', 'pranesh@gmail.com'),
('Arun', 'arun@gmail.com'),
('Karthik', 'karthik@gmail.com'),
('Rahul', 'rahul@gmail.com'),
('Vijay', 'vijay@gmail.com');

select * from users;
INSERT INTO products (product_name, price)

WITH RECURSIVE numbers AS (
    SELECT 1 AS n

    UNION ALL

    SELECT n + 1
    FROM numbers
    WHERE n < 500
)

SELECT
    CONCAT('Product ', n),
    ROUND(100 + (RAND() * 9900), 2)
FROM numbers;
SELECT COUNT(*) FROM products;
SELECT * FROM products;
INSERT INTO orders (user_id, product_id, quantity)
SELECT
    FLOOR(1 + RAND() * 5),
    FLOOR(1 + RAND() * 500),
    FLOOR(1 + RAND() * 10)
FROM
    (SELECT 1 n
     FROM information_schema.columns
     LIMIT 596281) a;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM numbers;
SELECT * FROM orders;

CREATE TEMPORARY TABLE numbers (
    n INT PRIMARY KEY
);

INSERT INTO numbers (n)
SELECT
    a.n
    + b.n * 10
    + c.n * 100
    + d.n * 1000
    + e.n * 10000
    + f.n * 100000
FROM
    (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
     UNION ALL SELECT 8 UNION ALL SELECT 9) a
CROSS JOIN
    (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
     UNION ALL SELECT 8 UNION ALL SELECT 9) b
CROSS JOIN
    (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
     UNION ALL SELECT 8 UNION ALL SELECT 9) c
CROSS JOIN
    (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
     UNION ALL SELECT 8 UNION ALL SELECT 9) d
CROSS JOIN
    (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
     UNION ALL SELECT 8 UNION ALL SELECT 9) e
CROSS JOIN
    (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
     UNION ALL SELECT 8 UNION ALL SELECT 9) f
WHERE
    a.n
    + b.n * 10
    + c.n * 100
    + d.n * 1000
    + e.n * 10000
    + f.n * 100000 < 600000;
    
    SELECT count(*) FROM numbers;
    INSERT INTO orders (user_id, product_id, quantity)
SELECT
    FLOOR(1 + RAND() * 5),
    FLOOR(1 + RAND() * 500),
    FLOOR(1 + RAND() * 10)
FROM numbers
LIMIT 596281;
SELECT COUNT(*) FROM orders;
ALTER TABLE orders
ADD COLUMN user_name VARCHAR(100),
ADD COLUMN user_email VARCHAR(100),
ADD COLUMN product_name VARCHAR(150),
ADD COLUMN product_price DECIMAL(10,2),
ADD COLUMN order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

select * from orders;
UPDATE orders
SET
    user_id = FLOOR(1 + RAND() * 5),
    product_id = FLOOR(1 + RAND() * 500),
    quantity = FLOOR(1 + RAND() * 10);

SELECT
    o.id AS order_id,
    o.user_id,
    u.name AS user_name,
    u.email AS user_email,
    o.product_id,
    p.product_name,
    p.price AS product_price,
    o.quantity,
    o.order_date
FROM orders o
JOIN users u
    ON o.user_id = u.id
JOIN products p
    ON o.product_id = p.id;


select * from orders;
UPDATE orders
SET
    user_name = CONCAT('User ', user_id),
    user_email = CONCAT('user', id, '@gmail.com'),
    product_name = CONCAT('Product ', product_id),
    product_price = ROUND(100 + RAND() * 9900, 2)
WHERE id >= 1 AND id <= 10000;


UPDATE orders
SET
    user_name = CONCAT('User ', user_id),
    user_email = CONCAT('user', id, '@gmail.com'),
    product_name = CONCAT('Product ', product_id),
    product_price = ROUND(100 + RAND() * 9900, 2)
WHERE id >= 10001 AND id <= 50000;

UPDATE orders
SET
    user_name = CONCAT('User ', user_id),
    user_email = CONCAT('user', id, '@gmail.com'),
    product_name = CONCAT('Product ', product_id),
    product_price = ROUND(100 + RAND() * 9900, 2)
WHERE id >= 10002 AND id <= 90000;

UPDATE orders
SET
    user_name = CONCAT('User ', user_id),
    user_email = CONCAT('user', id, '@gmail.com'),
    product_name = CONCAT('Product ', product_id),
    product_price = ROUND(100 + RAND() * 9900, 2)
WHERE id >= 10003 AND id <= 200000;

UPDATE orders
SET
    user_name = CONCAT('User ', user_id),
    user_email = CONCAT('user', id, '@gmail.com'),
    product_name = CONCAT('Product ', product_id),
    product_price = ROUND(100 + RAND() * 9900, 2)
WHERE id >= 10004 AND id <= 500000;

UPDATE orders
SET
    user_name = CONCAT('User ', user_id),
    user_email = CONCAT('user', id, '@gmail.com'),
    product_name = CONCAT('Product ', product_id),
    product_price = ROUND(100 + RAND() * 9900, 2)
WHERE id >= 10004 AND id <= 600000;
select * from orders;

  
  
select  * from orders;
UPDATE orders
SET user_email = 'pranesh@gmail.com'
WHERE id = 2;

UPDATE orders
SET user_email = 'balaji@gmail.com'
WHERE id = 2678;

CREATE TABLE balance;

