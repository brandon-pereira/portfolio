/**
 * Class to enable smooth scrolling.
 * @author https://gist.github.com/austinpray/5994652
 */
(function(window) {
	function SmoothScroll(options) {
		if(!options) options = {};
		if(options.bind && options.bind === true) {
			this.events();				
		}
	}
	
	SmoothScroll.prototype.events = function() {
		var self = this;
		console.log("events");
		$('.smoothScroll').on('click', function(e) {
	    e.preventDefault();
	    self.scroll($(window), $($(e.currentTarget).attr('href')).offset().top, 200);
		});
	};
	
	SmoothScroll.prototype.scroll = function(el, to, duration) {
		console.log(to);
		if (duration < 0) {
			return;
		}
		var difference = to - $(window).scrollTop();
		var perTick = difference / duration * 10;
		this.scrollToTimerCache = setTimeout(function() {
			if (!isNaN(parseInt(perTick, 10))) {
				window.scrollTo(0, $(window).scrollTop() + perTick);
				this.scroll(el, to, duration - 10);
			}
		}.bind(this), 10);
	};
	
	window.SmoothScroll = SmoothScroll;
})(window);