(function(window) {
	
	function Scroll() {
		this.sections = $('[data-track-section]');
		this._trackScrolling();
	}
	
	/**
	 * Function to scroll to an element
	 */
	Scroll.prototype.scrollTo = function(element) {
		this._scroll($(window), $(element).offset().top, 200, $(element).attr('id'));
	};
	
	/**
	 * Function to rebind the event listeners on smoothScroll elements.
	 */
	Scroll.prototype.reInitSmoothScroll = function() {
		var self = this;
		$('.smoothScroll').off().on('click', function(e) {
	    e.preventDefault();
	    self._scroll($(window), $($(e.currentTarget).attr('href')).offset().top, 200, $(e.currentTarget).attr('href'));
		});
	};
	
	/**
	 * Function to track section scrolls. Being debounced by half a second
	 */
	Scroll.prototype._trackScrolling = function() {
		var self = this;
		var timeout;
		$(document).on('scroll', function(e) {
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				for(var i = 0; i < self.sections.length; i++) {
					var scrollPos = $(this).scrollTop();
					var top = $(self.sections[i]).position().top;
					var bottom = $(self.sections[i])[0].offsetHeight + $(self.sections[i]).position().top;
					if(top <= scrollPos && bottom >= scrollPos) {
						var name = $(self.sections[i]).attr('id');
						self._logEvent('section', name);
						self.sections.splice(i, 1);
						return;
					}
				}
			}, 500);
		});
	};
	
	Scroll.prototype._logEvent = function(event, action) {
		if(ga) {
			ga('send', 'event', 'scroll', event, action);			
		} else {
			console.warn("Google Analytics not detected on page. Might be blocked?");
		}
	}
	
	/**
	 * Function to handle smooth scrolling 
	 * @private
	 * @author https://gist.github.com/austinpray/5994652
	 */
	Scroll.prototype._scroll = function(el, to, duration, hash) {
		if (duration < 0) {
			location.hash = hash;
			return;
		}
		var difference = to - $(window).scrollTop();
		var perTick = difference / duration * 10;
		this.scrollToTimerCache = setTimeout(function() {
			if (!isNaN(parseInt(perTick, 10))) {
				window.scrollTo(0, $(window).scrollTop() + perTick);
				this._scroll(el, to, duration - 10, hash);
			}
		}.bind(this), 10);
	};
	
	window.Scroll = Scroll;
})(window);