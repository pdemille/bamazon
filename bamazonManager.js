// my variables and npm's
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2'); //https://www.npmjs.com/package/cli-table2
// to personal file
var displayMyTable = require('./constructor.js');

var TASKS = 6; //variable leading to my case statement

// connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root', 
    database:  'bamazon'
});

connection.connect(function (err) {
    if (err) {
        console.log('Err connecting');
        throw err;
    }
});

// Prompt Manager for desire to continue or end connection to database
function promptManager() {
    inquirer.prompt({
        name: "action",
        type: "list",

        message: " Would like to continue?\n",
        choices: ["Yes", "No"]
    }).then(function(answer) {
        switch(answer.action) {
            case 'Yes':
                askManager();
            break;

            case 'No':
                connection.end();
            break;
        }
    });
}

// Select all product info
function viewProducts() {
    connection.query('SELECT * FROM products', function(err, results){        
        displayForManager(results);
        promptManager(); 
    })
}

//less than five in inventory, show product
function viewLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err,results) {
        console.log('\n  All products with quantity lower than 5 shown in Inventory Table\n');
        displayForManager(results); 
        promptManager();            
    })
}

// Update the quantity of an item already in bAmazon then display in table
function addInventory() {

    inquirer.prompt([{
        name: "id",
        type: "input",
        message: " Enter the Item ID of the product",

    }, {
        name: "quantity",
        type: "input",
        message: " Enter quantity to add to your cart",

    }]).then(function(answer) {

        connection.query('SELECT * FROM products WHERE ?', {item_id: answer.id},function(err,res) {
            itemQuantity = res[0].stock_quantity + parseInt(answer.quantity);

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: itemQuantity
            }, {
                item_id: answer.id
            }], function(err, results) {});

            connection.query('SELECT * FROM products WHERE ?', {item_id: answer.id},function(err,results) {
                console.log('\n Bamazons Stock Quantity was updated- see Table\n');   
                displayForManager(results);
                promptManager();
            });

        });
    });
}   

// Add a new product into the database with all of it's info, display the  table, prompt Manager if desires to continue
function addProduct() {
    inquirer.prompt([{
        name: "product_name",
        type: "input",
        message: " Enter the name of the product",
    }, {
        name: "department_name",
        type: "input",
        message: " Enter the department of the product",
    }, {
        name: "price",
        type: "input",
        message: " Enter price of the product",
    }, {
        name: "quantity", //here
        type: "input",
        message: " Enter the quantity",                
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock_quantity: answer.quantity //here
        }, function(err, res) {
            console.log('\n  The new product was added - See the Inventory Table\n');
                connection.query('SELECT * FROM products', function(err, results){  
                    displayForManager(results);
                    promptManager();
                });               
        }); 
    });
} 

function deleteProduct() {
        inquirer.prompt([{
        name: "id",
        type: "input",
        message: " Enter the Item ID of the product you wish to delete",

    }]).then(function(answer) {

        connection.query("DELETE FROM products WHERE ?", {
            item_id: answer.id
        }, function(err, results) {
            console.log('\n  The product was deleted - See the Inventory Table\n');
            connection.query('SELECT * FROM products', function(err, results){  
                    displayForManager(results);
                    promptManager();
            });
        });
    });
}

//  view or update database, option to terminate, and check for valid choice
function askManager() {
    var managerMsg = [
    '\nSelect the option number for the option you need:\n',
    "1 - View Items for Sale\n", 
    "2 - View Low Inventory\n", 
    "3 - Add to Inventory\n", 
    "4 - Add New Product\n",
    "5 - Delete Product\n",
    "6 - All Done\n",
    ];

    for (i = 0; i < managerMsg.length; i++) {
    console.log(managerMsg[i]);
    }

    inquirer.prompt({
        name: "option",
        type: "input",
        message: " Which option would you like to perform?\n",
    }).then(function(answer) {

        var choice = parseInt(answer.option);

        if (choice > 0 && choice <= TASKS) {
            switch(answer.option) {
                case '1':
                     viewProducts();
                     break;
                
                case '2':
                     viewLowInventory();
                     break;
                
                case '3':
                     addInventory();
                     break;
                
                case '4':
                     addProduct();
                     break;

                case '5':
                     deleteProduct();
                     break;

                case '6':
                     connection.end();
                     break;       
            } 
        } else {
            console.log('Please choose a number between 1 and ' + TASKS);
            askManager();
        }
    });
}

// Displays table for Manager, Results from a SELECT query are passed in as parameter and used 
var displayForManager = function(results) {   
    var display = new displayMyTable();
    display.displayInventoryTable(results);
}

// **** Start Main Function ****
askManager();

