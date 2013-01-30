$(document).ready(function() {
	var self = this;
	var placeholders = [
		"What's your biggest personal secret?",
		'lipsum'
	];
	var $message = $('.message');

	$('#message').attr("placeholder",placeholders[0]);

	$('form').on('submit',onSend);
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
		if(!validate(msg)) return;

		//gather form data for sending to server
		var data = $('form').serialize();
		$('textarea#message').val('');
		//http://canttweetthis.herokuapp.com
		$message.show();
		$.ajax({
			type: "POST",
			//url: 'http://localhost:3001',
			data: data
		}).success(function(resp){
			if(resp.error){
				var err = resp.error;
				// handle any Error results from Twitter
				switch(err.statusCode){
					case 403:
					addErrorText('Message rejected by Twitter');
					break;

					default:
					addErrorText('Generic Twitter Error');
				}
				
			} else {
				//all good
				addMessageText("Stay tuned, your secret tweet will appear below shortly");
				$message.removeClass('error');
			}
		}).error(function(e){
			//couldnt make the POST call
			addErrorText('There was an error connecting to the server');
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