(function(window, $, ko) {
	function Lightbox(element) {
		this.$element = $(element);
		this.init();
	}
	
	Lightbox.prototype.open = function(file) {
		var model = {
			src: '',
			title: '',
			poster: '',
			isVideo: false,
			styling: ''
		}
		$.extend(model, file);
		if(model.type === 'video') model.isVideo = true;
		this._preload(model.src);
		this._updateView(model);
	};
	
	Lightbox.prototype._updateView = function(model) {
		v = this.view;
		v.open(true);
		v.src(model.src);
		v.title(model.title);
		v.poster(model.poster);
		v.isVideo(model.isVideo);
		v.styling(model.styling);
	}
	
	Lightbox.prototype.close = function() {
		this.view.open(false);
	}
	
	Lightbox.prototype._preload = function(src) {
		var view = this.view;
		view.isLoaded(false);
		var img = new Image();
		img.onload = function() {
			view.isLoaded(true);
		};
		img.src = src;
	}

	Lightbox.prototype.init = function() {	
		var self = this;	
		this.view = {
			open: ko.observable(false),
			src: ko.observable(''),
			title: ko.observable(''),
			poster: ko.observable(''),
			isVideo: ko.observable(false),
			styling: ko.observable(''),
			isLoaded: ko.observable(false),
			close: function() {
				self.close();
			}
		};
		ko.applyBindings(this.view, this.$element[0]);
	};
	
	window.Lightbox = Lightbox;
	
})(window, $, ko);