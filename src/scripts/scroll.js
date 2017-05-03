/**
 * Class to enable smooth scrolling.
 * @author https://gist.github.com/austinpray/5994652
 */

// scroller will watch for section scrolls AND handle smooth scrolling
(function(window) {
	
	function Scroll() {
		console.log("INIT");
		this.sections = $('[data-track-section]');
		this.events();
	}
	
	Scroll.prototype.scrollTo = function(element) {
		this._scroll($(window), $($(element)).offset().top, 200, $(element).attr('id'));
	};
	
	Scroll.prototype.events = function(element) {
		var self = this;
		var timeout;
		
		/**
		 * Function to track section scrolls. Being debounced by half a second
		 */
		$(document).on('scroll', function(e) {
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				for(var i = 0; i < self.sections.length; i++) {
					if($(self.sections[i]).position().top <= $(this).scrollTop()) {
						console.log($(self.sections[i]).attr('id'));
						self.sections.splice(i, 1);
						return;
					}
				}
			}, 500);
		});
		
		/**
		 * Function to track 
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$(window).find('.smoothScroll').off().on('click', function(e) {
			console.log("CLICK");
	    e.preventDefault();
	    self._scroll($(window), $($(e.currentTarget).attr('href')).offset().top, 200, $(e.currentTarget).attr('href'));
		});
	};
	
	Scroll.prototype._scroll = function(el, to, duration, hash) {
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
	
	window.Scroll = Scroll;
})(window);