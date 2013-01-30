$(document).ready(function() {
	var self = this;
	var placeholders = [
		"What's your biggest personal secret?",
		'lipsum'
	];
	var $message = $('.message');

	$('#message').attr("placeholder",placeholders[0]);

	$('#button').on('click',onSend);
	$('textarea#message').keydown(limitText);
	$('textarea#message').keyup(limitText);


	function limitText() {
		var limitCount = 140;
		var limitField = $('textarea#message');
		//remove any @ signs that are typed
		if (limitField.val().match('@')){
            limitField.val(limitField.val().replace('@',''));
        }
		if (limitField.val().length > limitCount) {
			limitField.val(limitField.val().substring(0, limitCount));
			$("#countdown").text(0);
		} else {
			$("#countdown").text(limitCount - limitField.val().length);
		}
	}

	function validate(msg){
		//check for @ replies
		if(msg.match('@')){
			addErrorText("Sorry, no @reply messages");
			return;
		}
		//make sure there is a message
		if(msg.length < 1){
			addErrorText("Please enter a message");
			return;
		}
		return true;
	}

	function onSend(e){
		//prevent default form action
		if (e.preventDefault) e.preventDefault();

		//get msg and check if it is valid
		var msg = $('textarea#message').val();
		$("#countdown").text(140);

		if(!validate(msg)) return;

		//gather form data for sending to server
		var data = $('form').serialize();
		$('textarea#message').val('');
		$('form').off('submit',onSend);
		//
		$message.show();
		$.ajax({
			type: "POST",
			url: 'http://canttweetthis.herokuapp.com',
			//url: 'http://localhost:5000',
			data: data
		}).success(function(resp){
			//all good
			
			$('form').on('submit',onSend);
			addMessageText("Stay tuned, your secret tweet will appear below shortly.");
			$message.removeClass('error');
			
		}).error(function(resp){
			//server returned error
			var error = JSON.parse(resp.responseText);
			var twitterError = JSON.parse(error.error.data);
			var twitterErrorMsg = twitterError.errors[0].message;
			var twitterErrorCode = twitterError.errors[0].code;
			var status = error.error.statusCode;
			twitterErrorMsg ?  addErrorText(twitterErrorMsg) : addErrorText('Message rejected by Twitter');
	
			//addErrorText('There was an error connecting to the server');
		});
	}
	var addErrorText = function(text){
		console.log('Error:'+text);
		$message.show();
		$message.addClass('error');
		$message.text(text);
	};
	var addMessageText = function(text){
		$message.show();
		$message.removeClass('error');
		$message.text(text);
	};
});