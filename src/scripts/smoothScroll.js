/**
 * Class to enable smooth scrolling.
 * @author https://gist.github.com/austinpray/5994652
 */
(function(window) {
	
	function SmoothScroll() {}
	
	SmoothScroll.prototype.scrollTo = function(element) {
		this._scroll($(window), $($(element)).offset().top, 200, $(element).attr('id'));
	};
	
	SmoothScroll.prototype.events = function(element) {
		var self = this;
		
		$(element).find('.smoothScroll').off().on('click', function(e) {
	    e.preventDefault();
			console.log("EH");
	    self._scroll($(window), $($(e.currentTarget).attr('href')).offset().top, 200, $(e.currentTarget).attr('href'));
		});
	};
	
	SmoothScroll.prototype._scroll = function(el, to, duration, hash) {
		if (duration < 0) {
			return;
		}
		var difference = to - $(window).scrollTop();
		var perTick = difference / duration * 10;
		this.scrollToTimerCache = setTimeout(function() {
			if (!isNaN(parseInt(perTick, 10))) {
				window.scrollTo(0, $(window).scrollTop() + perTick);
				this._scroll(el, to, duration - 10);
			}
			if(hash) {
				location.hash = hash;
			}
		}.bind(this), 10);
	};
	
	window.SmoothScroll = SmoothScroll;
})(window);