(function(window) {
	
	// Function to bootstrap all page components
	$(window).on('ready', function() {
		var lightbox = new Lightbox($('.lightbox'))
		new Skills($('#skills'));		
		new Projects($('#projects'), lightbox);		
		new Contact($('#contact'));		
		new Apps($('#apps'), lightbox);		
		new SmoothScroll().events($('section.header'));
		
		// If its a webkit browser add 'webkit' class to HTML.	
		if('webkitTextFillColor' in document.documentElement.style) {
			$('html').addClass('webkit');
		}	
	});
	})(window);

// Load Webfonts (Generic)
WebFont.load({
	google: {
		families: [
			'Open Sans:300,400',
			'Press Start 2P:400'
		]
	}
});
// Load Projects webfont (subset only) 
WebFont.load({
	google: {
		families: ['Lily Script One:400'],
		text: 'Projects'
	}
});
WebFont.load({
	google: {
		families: ['Bungee Shade:400'],
		text: 'Apps'
	}
});