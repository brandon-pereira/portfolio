(function(window) {
	
	// Function to bootstrap all page components
	$(window).on('ready', function() {
		// new Skills($('#skills'));		
		// new Projects($('#projects'));		
		// new Contact($('#contact'));		
		new Apps($('#apps'));		
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