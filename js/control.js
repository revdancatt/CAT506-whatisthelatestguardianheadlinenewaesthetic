control = {
	
	latestAPIUrl: '',
	lastUpdate: 0,
	loadMoreTmr: null,
	resizeTmr: null,

	init: function() {
		
		//	This is where we set up all our events and stuff
		
		//	catch the resize event and keep restarting a timer to track it
		//	300ms after the final resize event we'll call our function
		$(window).resize(function () {
			if (control.resizeTmr !== null) {
				clearTimeout(control.resizeTmr);
			}
			control.resizeTmr = setTimeout(control.resized, 300);
		});

        $('#background').load(function() {
            $('#background').stop(true,true).fadeTo(666, 1);
        });
        
		//	Load in the latest headline
		this.getLatestHeadline();

		//	Now set an interval timer to do it automatically every
		//	minute
		this.loadMoreTmr = setInterval(control.getLatestHeadline, 60 * 1000);

		
	},

	getLatestHeadline: function () {
	
		$.jsonp({
			url: 'http://content.guardianapis.com/search?page-size=1&format=json&show-fields=thumbnail&callback=?',
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
			
            
            //  fade the contents in and back out again
			$('#container').stop(true,true).fadeTo(666, 0, function() {
				

                //  set the image, if there is one.
                $('#background').stop(true,true).fadeTo(666, 0, function() {
                    if ('fields' in json && 'thumbnail' in json.fields) {
                        $('#background').attr('src', json.fields.thumbnail);
                    }
                });

                //	set the title
				document.title = json.webTitle + ' | What is the Latest Guardian Headline?';
				
				//	build the main headline
				var h1 = $('<h1>').append($('<a>').attr('href', json.webUrl).html(json.webTitle)).addClass('section_' + json.sectionId).addClass('shadow');
				//	build the section part
				var h2 = $('<h2>').html('A moment ago in ').append($('<a>').attr('href','http://www.guardian.co.uk/' + json.sectionId).html(json.sectionName)).addClass('section_' + json.sectionId);
				
				// put both of them into the container
				$('#container').empty();
				$('#container').append(h1);
                $('h2').remove();
				$('body').append(h2);
				
				//	Store the apiUrl so we know what to do next time
				control.latestAPIUrl = json.apiUrl;
				control.lastUpdate = parseInt(new Date().getTime()/1000, 10);
				
                $('#container').css({opacity: 0.0, display: 'block'});
				control.resized();
				$('#container').fadeTo(666, 1);
                
			});
			
		} else {

            //	Otherwise let us just update the time
			var newMins = Math.round((parseInt(new Date().getTime()/1000, 10) - control.lastUpdate)/60);
			var tempHolder = $('h2 a').remove();
			if (newMins === 0) {
				$('h2').html('A moment ago in ').append(tempHolder);
			} else if (newMins == 1) {
				$('h2').html('About a minute ago in ').append(tempHolder);
			} else {
				$('h2').html('About ' + newMins + ' minutes ago in ').append(tempHolder);
			}
			
		}
		
	},
	
	//	make the text fit into the window again
	resized: function() {
		$('#container').css('font-size', '128px');
		$('#container').textfill({ innerTag: 'h1', maxFontPixels: 128 });
		
		if ($(window).width() <= 768) {
			$('.ribbonHolder').css('display', 'none');
		} else {
			$('.ribbonHolder').css('display', 'block');
		}

		//	Oh please shoot me for doing this, but it's late and I can't be arsed to
		//	do it properly.
		//	TODO: FIX THIS!
		if ($(window).width() <= 600) {
			$('h2').css('font-size', '16px');
		} else {
			$('h2').css('font-size', '24px');
		}


	}



};