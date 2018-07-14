-- Create "bamazon" database --
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

-- all of the code will affect "bamazon" --
USE bamazon;

-- Creates the table "products" within bamazon --
CREATE TABLE products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name  VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2),
  stock_quantity INTEGER(10),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Batman", "Toy", 29.95, 10);
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Superman", "Toy", 19.95, 15);
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Green Lantern", "Toy", 19.95, 10);
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Captain America", "Toy", 29.95, 10);
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Drake", "Music", 13.95, 2);
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("PARTYNEXTDOOR", "Music", 10.95, 3);
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("The Weeknd", "Music", 12.95, 20);
INSERT INTO products ( product_name,department_name,price,stock_quantity)
VALUES ("Inception", "Movies", 14.99, 30);
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Dark Knight", "Movies", 19.99, 50);
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Fired Up", "Movies", 9.99, 23);

select * FROM products