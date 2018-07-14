// Displays table for Manager 
Table = require('cli-table2');
var displayMyTable = function() {

    this.table = new Table({
        head: ['Item ID', 'Product Name', 'Price', 'Stock Quantity'],
    });

    //Allows price to be added to the product and make it dynamic
    this.displayInventoryTable = function(results) {
    	this.results = results;
	    for (var i=0; i <this.results.length; i++) {
	        this.table.push(
	            [this.results[i].item_id, this.results[i].product_name, '$'+ this.results[i].price, this.results[i].stock_quantity] );
	    }
    	console.log('\n' + this.table.toString());
	};
}
module.exports = displayMyTable;