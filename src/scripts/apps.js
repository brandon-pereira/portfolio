(function(window, $, ko) {
	function Apps(element) {
		this.$element = $(element);
		this.init();
	}

	Apps.prototype.init = function() {
		this.$loader = this.$element.find('.loading');
		this.$content = this.$element.find('.init');
		this.$slides = this.$element.find('.carousel-slides')[0];
		
		this._initView();
		this._fetch();
	};
	
	Apps.prototype._fetch = function() {
		var self = this;
		$.ajax({
				url: 'templates/apps.json',
				success: function(response) {
					self._process(response);
					self._events();
				}
		});
	};
	
	Apps.prototype._events = function() {
		var self = this;
		var start = 0;
		var end = 0;
	
		this.$slides.addEventListener('touchstart', function(event) {
	    start = event.changedTouches[0].screenX;;
		}, false);

		this.$slides.addEventListener('touchend', function(event) {
	    end = event.changedTouches[0].screenX;;
		    handleGesure(start, end, 50);
		}, false); 

		
		function handleGesure(touchstart, touchend, threshold) {
	    if (touchend < touchstart && (touchstart - touchend) >= threshold) {
	     	self._goToNextSlide();
	    }
	    else if (touchend > touchstart && (touchend - touchstart) >= threshold) {
				self._goToPrevSlide();
	    }
		}
	}
	
	Apps.prototype._process = function(response) {
		this._updateView(response);
		this._setSlide(0);
		this.$loader.addClass('loaded');
		this.$content.addClass('true');
	};

	/**
	 * Function which delegates updating view
	 * @param  {Object} data.categories New cateories object to applu
	 */
	Apps.prototype._updateView = function (data) {
		if(data.applications) {
			this.view.slides(data.applications);
		}
	};
	
	Apps.prototype._goToNextSlide = function() {
		var currentSlide = this.view.currentSlide();
		var maxSlide = this.view.slides().length;	
		currentSlide++;
		if(currentSlide >= maxSlide) {
			currentSlide = 0;
		}
		this._setSlide(currentSlide);
	}
	
	Apps.prototype._goToPrevSlide = function() {
		var currentSlide = this.view.currentSlide();
		currentSlide--;
		if(currentSlide < 0) {
			currentSlide = this.view.slides().length - 1;
		}
		this._setSlide(currentSlide);	}
	
	Apps.prototype._setSlide = function(index) {
		if(this.currentSlide) {
			this.$element.removeClass(this.currentSlide.theme);			
		}
		this.currentSlide = this.view.slides()[index];
		this.view.currentSlide(index);
		this.$element.addClass(this.currentSlide.theme);
	}

	/**
	 * Function to initialize the view model using
	 * knockout. Uses observables.
	 */
	Apps.prototype._initView = function () {
		var self = this;
		this.view = {
			slides: ko.observable([]),
			currentSlide: ko.observable(0),
			goToSlide: function(index, event) {
				self._setSlide(ko.contextFor(event.target).$index());
			},
			goToNextSlide: function() {
				self._goToNextSlide();
			},
			goToPrevSlide: function() {
				self._goToPrevSlide();
			}
		};
		ko.applyBindings(this.view, this.$element[0]);
	};

	
	window.Apps = Apps;
	
})(window, $, ko);