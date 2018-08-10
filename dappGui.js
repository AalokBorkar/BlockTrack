$(document).ready(function() {///////////////////////////

//hide all error messages initially
$('.input-errors').hide();

//initialize text area for signing transaction with placeholder multi-line formatting
var textAreas = document.getElementsByTagName('textarea');
Array.prototype.forEach.call(textAreas, function(elem) {
    elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
});

let setUp = new Promise(function(resolve, reject){ 
	    if (typeof web3 !== 'undefined') {
	        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
	        window.web3 = new Web3(web3.currentProvider);
	        console.log("Web3 initialized!");
	        resolve('done');
	    } 
	    else {
	    	console.log('No Web3 Detected... using HTTP Provider')
	        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
	        console.log("Web3 initialized!");
	        resolve('done');
	    }
});

setUp.then(function(){ //After setup above^

web3.eth.defaultAccount = web3.eth.accounts[0]; //current metamask account
console.log("The defaultAccount is: " + web3.eth.defaultAccount);


var contractABI = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "note",
				"type": "string"
			}
		],
		"name": "sign",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "notes",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]);

var Note = contractABI.at('0xea449D80E775607612Cc6d5ae9232EA10e417Ec1');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var currentOwner;
var doesOwn;
setInterval(function(){
	let hidecontent= new Promise(function(resolve, reject){ 
		Note.owner.call(function(err, res){
			if(!err){
				currentOwner = res;
				resolve('done');
			} else{
				console.log("Extracting current owner failed!");
			}
		});
	});
	hidecontent.then(function(){
		if(web3.eth.defaultAccount !== currentOwner){ //if the current Metamask account is NOT the current holder of the ledger hide owner functionality
			$('#sign').hide();
			$('#transfer').hide();
			doesOwn = false;
		} else{
			$('#sign').show();
			$('#transfer').show();
			doesOwn = true;
		}
	});

}, 101);

setInterval(function(){ //update current holder address every 100 milliseconds
	let changeOwner = new Promise(function(resolve, reject){ 
		Note.owner.call(function(err, res){
			if(!err){
				currentOwner = res;
				resolve('done');
			} else{
				console.log("Extracting current owner failed!");
			}
		});
	});
	changeOwner.then(function(){
		$('#ownerAddress').text(currentOwner);
	});

}, 100);

$('#viewButton').click(function(){
	
	if ($('#viewInput').val()){ //if text input is populated
		$('#view-input-error').hide();
		$('#viewInput').removeClass("orange");
		
		//alert(web3.eth.getBalance("0x353747f9D3EcA6F52f72e0C569e02aC18D8df442"));
		Note.notes($('#viewInput').val(), function(err, res){
			if(!err){
				alert("Success!" + '\n' + "Transaction id: " + res);

			} else{
				console.log("Error fetching information from given address");
			}

		});


	} else { //field is blank
		$('#view-input-error').show();
		$('#viewInput').addClass("orange");
	}

});

$('#signButton').click(function(){

	if ($('#signInput').val() && doesOwn){ //if text input is populated and the owner is logged in

		Note.sign($('#signInput').val(), function(err, res){
			if(!err){
				alert("Success!" + '\n' + "Transaction id: " + res);

			} else{
				console.log("Error signing the ledger!");
			}

		});

		$('#sign-input-error').hide();
		$('#signInput').removeClass("orange");

	} else { //field is blank
		$('#sign-input-error').show();
		$('#signInput').addClass("orange");
	}

});

$('#transferButton').click(function(){
	if ($('#transferInput').val() && doesOwn){ //if text input is populated and the owner is logged in

		Note.transferOwnership($('#transferInput').val(), function(err, res){
			if(!err){
				alert("Success!" + '\n' + "Transaction id: " + res);

			} else{
				console.log("Error sending ledger to given address!");
			}
		});


		$('#transfer-input-error').hide();
		$('#transferInput').removeClass("orange");

	} else { //field is blank
		$('#transfer-input-error').show();
		$('#transferInput').addClass("orange");
	}

});






}); //initial load promises 'then'

});/////////////////////////////////////////////////////