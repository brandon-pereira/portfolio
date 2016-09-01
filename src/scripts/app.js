(function(window) {
	
	// Function to bootstrap all page components
	$(window).on('ready', function() {
		new Skills($('#skills'));		
		new Projects($('#projects'));		
		new Contact($('#contact'));		
		new SmoothScroll().events($('section.header'));
		
		// If its a webkit browser add 'webkit' class to HTML.	
		if('webkitTextFillColor' in document.documentElement.style) {
			$('html').addClass('webkit');
		}	
	});
	
})(window);