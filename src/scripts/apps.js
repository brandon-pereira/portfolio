(function(window, $, ko) {
	function Apps(element) {
		this.$element = $(element);
		this.init();
	}

	Apps.prototype.init = function() {
		this.$loader = this.$element.find('.loading');
		this.$content = this.$element.find('.init');
		
		this._initView();
		this._fetch();
	};
	
	Apps.prototype._fetch = function() {
		var self = this;
		$.ajax({
				url: 'templates/apps.json',
				success: function(response) {
					self._process(response);
				}
		});
	};
	
	Apps.prototype._process = function(response) {
		this._updateView(response);
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
		// if(data.socialLinks) {
		// 	this.view.socialLinks(data.socialLinks);
		// }
	};

	/**
	 * Function to initialize the view model using
	 * knockout. Uses observables.
	 */
	Apps.prototype._initView = function () {
		this.view = {
			slides: ko.observable([]),
			currentSlide: ko.observable(1)
			// socialLinks: ko.observable([])
		};
		ko.applyBindings(this.view, this.$element[0]);
	};

	
	window.Apps = Apps;
	
})(window, $, ko);