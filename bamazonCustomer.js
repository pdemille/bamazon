// my variables and npm's
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');
// to personal file
var displayMyTable = require('./constructor.js');

//connection
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database:  'bamazon'
});

connection.connect(function (err) {
	if (err) {
		console.log('err connecting');
		throw err;
	}
});

// Display bamazon database using cli-table2
// after, we Prompt the user to determine item/quantity they want to buy
var displayForUser = function() {
	var display = new displayMyTable();
	connection.query('SELECT * FROM products', function(err, results){
		display.displayInventoryTable(results);
		purchaseItem();
	});
}

// Prompt user to enter id and quantity they wish to purchase
var purchaseItem = function() {
	console.log('\n  ');
	inquirer.prompt([{
		name: "id",
		type: "input",
		message: " Enter the Item ID of the product you want to purchase",

	}, {
		name: "quantity",
		type: "input",
		message: " Enter the quantity (units) you want to purchase",

	}]).then(function(answer) {
		// Query the database for info about item  
		connection.query('SELECT product_name, department_name, price, stock_quantity FROM products WHERE ?', {item_id: answer.id}, function(err,res) {
			
		console.log('\n  You would like to buy ' + answer.quantity + ' ' + res[0].product_name + ' ' + res[0].department_name + ' at $' + res[0].price + ' each'
			);
			if (res[0].stock_quantity >= answer.quantity) {
				//If enough inventory to complete order, update table and notify consumer
				var itemQuantity = res[0].stock_quantity - answer.quantity;
				connection.query("UPDATE products SET ? WHERE ?", [
				{
					stock_quantity: itemQuantity
				}, {
					item_id: answer.id
				}], function(err,res) {
					});	
				var cost = res[0].price * answer.quantity;
				console.log('\n  Order fulfilled! Your cost is $' + cost.toFixed(2) + '\n');
				// Order fulfilled
				customerPrompt();
					
			} else {
				//If not enought inventory notify consumer and prompt customer for desire to shop more
				console.log('\n  Not enough in stock to fulfill your order!\n');
				// Order not completed
				customerPrompt();
			}
		})
    });
}

var customerPrompt = function() {
    inquirer.prompt({
        name: "action",
        type: "list",

        message: " Do you want to continue shopping?\n",
        choices: ["Yes", "No"]
    }).then(function(answer) {
        switch(answer.action) {
            case 'Yes':
                displayForUser();
            break;

            case 'No':
                connection.end();
            break;
        }
    })
};

// Start app by Prompting consumer
customerPrompt();