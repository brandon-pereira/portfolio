(function(window) {
	
	// Function to bootstrap all page components
	$(window).on('ready', function() {
		new Skills($('#skills'));		
		new Projects($('#projects'));		
		new Contact($('#contact'));		
		new SmoothScroll({bind: true});		
	});
	
})(window);