$(function () {
	//stock data
	companies = [
		{
			name: 'Apple'
			, symbol: 'AAPL'
			, price: '577'
			, shares: '0'
		},

		{
			name: 'Google'
			, symbol: 'GOOG'
			, price: '650'
			, shares: '0'
		},

		{
			name: 'JP Morgan Chase'
			, symbol: 'JPM'
			, price: '33'
			, shares: '0'
		},

		{
			name: 'Microsoft'
			, symbol: 'MSFT'
			, price: '35'
			, shares: '0'
		},

		{
			name: 'Facebook'
			, symbol: 'FB'
			, price: '27'
			, shares: '0'
		}
	];

	//your cash flow
	var cashflow = 1000;

	/*
	- your portfolio value
	- calculates based on
	current price of stocks
	and shares owned
	*/
	var portfolioValue = function () {

		var total = 0;

		for (var key in companies) {
			var obj = companies[key];
			var sharesOwned = 0;
			var priceOfThisStock = 0;

			for (var prop in obj) {
				switch (prop) {
					case 'price':
						//typecast string to float
						priceOfThisStock = parseFloat(obj[prop]);
						break;
					case 'shares':
						//typecast string to float
						var sharesOwned = parseFloat(obj[prop]);
						total += priceOfThisStock * sharesOwned;
						break;
				}
			}
		}

		return total;
	}


	var changePrice = function (price) {

		//generate random number -1 or 1
		chance = Math.round(Math.random()) * 2 - 1;

		//adds chance/10 to price
		price += chance / 10;

		return price;
	}

	//build the table
	for (var key in companies) {
		var obj = companies[key];
		var symbol = '';
		var html = "<tr>";
		for (var prop in obj) {
			/*
			- grab the symbol value
			- to use to make unique ids for tds
			*/
			if (prop === 'symbol')
				symbol = obj[prop];

			//this will build the table dimensions
			if (prop !== 'price') {
				html += "<td id='" + prop + symbol + "'>";
				html += obj[prop];
				html += "</td>";
			} else {
				html += "<td id='" + prop + symbol + "'>";
				html += "<span class='price'>" + obj[prop] + "</span>";
				html += "</td>";
			}
			/*
			- if the td is price then add
			  the tds for Shares You own,
			  Buy and Sell buttons
			  to the table row
			- manipulate the ids to be unique
			*/
			if (prop === 'shares')
				html += "<td> <a href='#' class='buy' id='" + symbol + "Buy" + "'>buy 1 share</a> </td> <td> <a href='#' class='sell' id='" + symbol + "Sell" + "'>sell 1 share</a> </td>";
		}
		html += "</tr>";
		$("#myPortfolio tbody").append(html);
	}

	//every second do this
	setInterval(function () {
		/*
			- iterate through the stock data
			- change the price to a float
			- run the price through changePrice()
			- replace the new price into the stock data
			- replace the new price of the stock into the table
		*/
		for (var key in companies) {
			var obj = companies[key];
			var symbol = '';
			for (var prop in obj) {
				switch (prop) {
					case 'symbol':
						symbol = obj[prop];
						break;
					case 'price':
						var priceOfThisStock = parseFloat(obj[prop]);
						obj[prop] = changePrice(priceOfThisStock);
						var roundedPrice = (obj[prop]).toFixed(2);
						$('#' + prop + symbol).html("<span class='price'>" + roundedPrice + "</span>");
						break;
				}
			}
		}

	}, 1000 /* every second */);


	//every second do this
	setInterval(function () {
		/*
			- run cash flow, portfolio value, total worth functions
			  and then put them in the dom
			- decide whether buy/sell buttons should appear
			  and then put them or remove them from the dom
		*/
		for (var key in companies) {
			var obj = companies[key];

			//initialize
			var symbol = '';
			var price = 0;
			var p = 0;
			var t = 0;

			for (var prop in obj) {
				if (prop === 'symbol')
					symbol = obj[prop];
				p = portfolioValue();
				t = cashflow + p;
				$('#cashflow').html(cashflow);
				$('#portfolio').html(p);
				$('#netWorth').html(t);
				if (cashflow === 0) $('a').each(function () {
					var id = String($(this).attr('id'));
					if (id.indexOf('Buy') > 0)
						$(this).hide();
				});
				switch (prop) {
					case 'price':
						price = parseFloat(obj[prop]);
						$('#' + symbol + 'Buy').toggle(cashflow >= price);
						break;
					case 'shares':
						var sharesOwned = parseFloat(obj[prop]);
						$('#' + symbol + 'Sell').toggle(sharesOwned > 0);
						break;
				}
			}
		}
	}, 1000 /* every 1000 mili seconds */);


	//happens live
	$(document).on('click', "a", function () {

		//grab the id of this link and typecast it to a string
		var id = String($(this).attr('id'));

		//if this is a buy button
		if (id.indexOf('Buy') > 0) {
			//extract the symbol of the stock this is for
			symbol = id.substr(0, id.indexOf('Buy'));

			//only do if cash flow is greater than share price
			//add a share
			//subtract share amount from cashflow

			//initialize
			var thisObj = 0; //specific object in companies
			var subtractPrice = false;

			for (var key in companies) {
				var obj = companies[key];
				for (var prop in obj) {
					switch (prop) {
						case 'symbol':
							if (obj[prop] === symbol)
								thisObj = key;
							break;
						case 'price':
							if (key === thisObj) {
								var PriceForThisStock = parseFloat(obj[prop]);
								if (cashflow > PriceForThisStock) {
									subtractPrice = true;
									cashflow = cashflow - PriceForThisStock;
								}
							}
							break;
						case 'shares':
							if (key === thisObj && subtractPrice) {
								var sharesForThisStock = parseFloat(obj[prop]);
								sharesForThisStock += 1;
								obj[prop] = sharesForThisStock;
								$('#' + 'shares' + symbol).html(sharesForThisStock);
							}
							break;
					}
				}
			}
		}

		//if this is a sell button
		if (id.indexOf('Sell') > 0) {

			//extract the symbol of the stock this is for
			symbol = id.substr(0, id.indexOf('Sell'));

			//only do if share of this stock is owned
			//subtract a share
			//add share amount to cash flow

			//initialize
			var thisObj = 0; //specific object in companies

			for (var key in companies) {
				var obj = companies[key];

				for (var prop in obj) {

					switch (prop) {
						case 'symbol':
							if (obj[prop] === symbol)
								thisObj = key;
							break;
						case 'price':
							if (key === thisObj)
								PriceForThisStock = parseFloat(obj[prop]);
							break;
						case 'shares':
							if (key === thisObj) {
								sharesForThisStock = parseFloat(obj[prop]);
								if (sharesForThisStock) {
									cashflow += PriceForThisStock;
									sharesForThisStock -= 1;
									obj[prop] = sharesForThisStock;
									$('#' + 'shares' + symbol).html(sharesForThisStock);
								}
							}
							break;
					}
				}
			}
		}
		//act like a button not a link
		return false;
	});
});

