(function(window, $, ko) {
	function Contact(element) {
		this.$element = $(element);
		this.init();
	}

	Contact.prototype.init = function() {
		this.$loader = this.$element.find('.loading');
		this.$content = this.$element.find('.init');
		
		this._initView();
		this._fetch();
	};
	
	Contact.prototype._fetch = function() {
		var self = this;
		$.ajax({
				url: '/templates/contact.json',
				success: function(response) {
					self._process(response);
				}
		});
	};
	
	Contact.prototype._process = function(response) {
		this._updateView(response);
		this.$loader.addClass('loaded');
		this.$content.addClass('true');
	};

	/**
	 * Function which delegates updating view
	 * @param  {Object} data.categories New cateories object to applu
	 */
	Contact.prototype._updateView = function (data) {
		if(data.contactLinks) {
			this.view.contactLinks(data.contactLinks);
		}
		if(data.socialLinks) {
			this.view.socialLinks(data.socialLinks);
		}
	};

	/**
	 * Function to initialize the view model using
	 * knockout. Uses observables.
	 */
	Contact.prototype._initView = function () {
		this.view = {
			contactLinks: ko.observable([]),
			socialLinks: ko.observable([])
		};
		ko.applyBindings(this.view, this.$element[0]);
	};

	
	window.Contact = Contact;
	
})(window, $, ko);