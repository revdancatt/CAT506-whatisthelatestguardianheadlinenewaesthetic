control = {
	
	latestAPIUrl: '',
	lastUpdate: 0,
	loadMoreTmr: null,

	init: function() {
		
		//	This is where we set up all our events and stuff
		//	in this case we don't have any yet so yay!

		//	Load in the latest headline
		this.getLatestHeadline();

		//	Now set an interval timer to do it automatically every
		//	minute
		this.loadMoreTmr = setInterval(control.getLatestHeadline, 60 * 1000);

		
	},

	getLatestHeadline: function () {
	
		console.log('here');
		$.jsonp({
			url: 'http://content.guardianapis.com/search?page-size=1&format=json&callback=?',
			success: function (json) {
	
				//	If we have a response and an array or results with just one item in it
				//	then we have gotten back a valid result we may want to work with
				if ('response' in json && 'results' in json.response && json.response.results.length == 1) {
					control.parse(json.response.results[0]);
				} else {
					//	Something odd happened but I'm not quite sure what, possibly an over rate message
					//	we'll do something super clever with it here
				}
			},
			error: function () {
				alert('need to catch this error');
			}
		});
	
	},

	parse: function(json) {

		//	Make sure it has an apiUrl and that it's different
		//	(and therefor in theory, newer) that the current
		if ('apiUrl' in json && json.apiUrl != control.latestAPIUrl && 'webTitle' in json) {
			
			$('#container').fadeOut('slow', function() {
				//	build the main headline
				var h1 = $('<h1>').append($('<a>').attr('href', json.webUrl).html(json.webTitle)).addClass('section_' + json.sectionId);
				//	build the section part
				var h2 = $('<h2>').html('A moment ago in ').append($('<a>').attr('href','http://www.guardian.co.uk/' + json.sectionId).html(json.sectionName).addClass('section_' + json.sectionId));
				
				// put both of them into the container
				$('#container').empty();
				$('#container').append(h1);
				$('#container').append(h2);
				
				//	Store the apiUrl so we know what to do next time
				control.latestAPIUrl = json.apiUrl;
				control.lastUpdate = parseInt(new Date().getTime()/1000, 10);
				$('#container').fadeIn('fast');
			});
			
		} else {
			//	Otherwise let us just update the time
			var newMins = Math.round((parseInt(new Date().getTime()/1000, 10) - control.lastUpdate)/60);
			var tempHolder = $('#container h2 a').remove();
			if (newMins === 0) {
				$('#container h2').html('A moment ago in ').append(tempHolder);
			} else if (newMins == 1) {
				$('#container h2').html('About a minute ago in ').append(tempHolder);
			} else {
				$('#container h2').html('About ' + newMins + ' minutes ago in ').append(tempHolder);
			}
			
		}
		
	}



};